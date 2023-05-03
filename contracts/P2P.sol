// SPDX-License-Identifier: MIT
pragma solidity <=0.8.19;

contract P2P {
    struct Prosumer {
        string name;
        address id;
        uint energyStatus;
        uint balance;
        uint reward;
        bool isSeller;
        bool isBuyer;
    }

    mapping(address => Prosumer) prosumers;

    address[] public sellers;
    address[] public buyers;

    event ProsumerRegistered(
        address indexed prosumer,
        string name,
        uint energyStatus,
        uint balance
    );
    event EnergyTraded(
        address indexed buyer,
        address indexed seller,
        uint amount,
        uint price
    );
    event EnergyWithdrawn(address indexed sender, uint amount);
    event Deposited(address indexed sender, uint amount);

    uint256 private price = 1 gwei;
    uint256 public contractBalance;

    function setPrice(uint256 newPrice) public {
        require(newPrice > 0);
        price = newPrice;
    }

    function registerProsumer(string memory name, uint256 energyStatus) public {
        require(bytes(name).length > 0);
        require(energyStatus >= 0);

        Prosumer storage newProsumer = prosumers[msg.sender];
        newProsumer.name = name;
        newProsumer.id = msg.sender;
        newProsumer.energyStatus = energyStatus;
        newProsumer.balance = 0;
        newProsumer.reward = 0;

        if (energyStatus > 0) {
            // Prosumer is a seller
            newProsumer.isSeller = true;
            sellers.push(msg.sender);
        } else {
            // Prosumer is a buyer
            newProsumer.isBuyer = true;
            buyers.push(msg.sender);
        }

        emit ProsumerRegistered(
            msg.sender,
            name,
            energyStatus,
            newProsumer.balance
        );
    }

    function isProsumerRegistered(address prosumer) public view returns (bool) {
        return bytes(prosumers[prosumer].name).length > 0;
    }

    function getBestSeller(uint amount) private view returns (address payable) {
        address payable bestSeller;
        uint256 lowestPrice = type(uint256).max;

        for (uint256 i = 0; i < sellers.length; i++) {
            Prosumer storage seller = prosumers[sellers[i]];
            if (seller.energyStatus >= amount && seller.balance < lowestPrice) {
                bestSeller = payable(sellers[i]);
                lowestPrice = seller.balance;
            }
        }

        require(
            bestSeller != address(0),
            "No sellers available for the requested amount"
        );
        return bestSeller;
    }

    function buyEnergy(uint amount) public payable {
        require(price > 0);
        require(amount > 0);

        Prosumer storage buyer = prosumers[msg.sender];
        require(buyer.isBuyer == true);
        require(buyer.energyStatus >= amount);
        require(buyer.balance >= price * amount);

        address payable sellerAddress = getBestSeller(amount);
        Prosumer storage seller = prosumers[sellerAddress];
        require(seller.isSeller == true);
        require(seller.energyStatus >= amount);

        buyer.energyStatus -= amount;
        seller.energyStatus += amount;
        buyer.balance -= price * amount;
        seller.balance += price * amount;

        // Reward the buyer and seller

        buyer.reward += (price * amount) / 1000;
        seller.reward += (price * amount) / 200;

        emit EnergyTraded(msg.sender, seller.id, amount, price);
    }

    function sellEnergy(uint amount) public payable {
        require(amount > 0);

        Prosumer storage seller = prosumers[msg.sender];
        require(seller.isSeller == true);
        require(seller.energyStatus >= amount);

        seller.energyStatus -= amount;
        seller.balance += price * amount;
        seller.reward += (price * amount) / 200;

        emit EnergyTraded(seller.id, msg.sender, amount, 0);
    }

    function getEnergyStatus(address prosumer) public view returns (uint) {
        return prosumers[prosumer].energyStatus;
    }

    function getBalance(address prosumer) public view returns (uint) {
        return prosumers[prosumer].balance;
    }

    function getReward(address prosumer) public view returns (uint) {
        return prosumers[prosumer].reward;
    }

    function deposit() public payable {
        require(msg.value > 0);
        contractBalance += msg.value;
        Prosumer storage newProsumer = prosumers[msg.sender];
        newProsumer.balance = contractBalance;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() public payable {
        require(getEnergyStatus(msg.sender) >= 0);

        address payable sender = payable(msg.sender);
        uint amount = getEnergyStatus(sender);

        if (amount > contractBalance) {
            // Not enough energy in the contract to withdraw.
            return;
        }

        require(amount <= prosumers[msg.sender].energyStatus);

        sender.transfer(amount);
        contractBalance -= amount;
        prosumers[msg.sender].energyStatus -= amount;

        emit EnergyWithdrawn(msg.sender, amount);
    }

    
}
