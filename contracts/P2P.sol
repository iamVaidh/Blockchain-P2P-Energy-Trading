// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract P2P {
    struct Prosumer {
        string name;
        address id;
        uint energyStatus;
        uint balance;
        uint reward;
    }

    mapping(address => Prosumer) prosumers;

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

    uint256 private price;

    function setPrice(uint256 newPrice) public {
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

        emit ProsumerRegistered(
            msg.sender,
            name,
            energyStatus,
            newProsumer.balance
        );
    }

    function buyEnergy(uint amount) public payable {
        require(price > 0);
        require(amount > 0);

        Prosumer storage buyer = prosumers[msg.sender];
        require(buyer.energyStatus >= amount);
        require(buyer.balance >= price * amount);

        Prosumer storage seller = prosumers[buyer.id];
        require(seller.energyStatus >= amount);

        buyer.energyStatus -= amount;
        seller.energyStatus += amount;
        buyer.balance -= price * amount;
        seller.balance += price * amount;

        // Reward the buyer and seller
        buyer.reward += (price * amount) / 100;
        seller.reward += (price * amount) / 100;

        emit EnergyTraded(msg.sender, seller.id, amount, price);
    }

    function sellEnergy(uint amount) public {
        require(amount > 0);

        Prosumer storage seller = prosumers[msg.sender];
        require(seller.energyStatus >= amount);

        seller.energyStatus -= amount;
        seller.balance += price * amount;
        seller.reward += (price * amount) / 100;

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

    function isProsumerRegistered(address prosumer) public view returns (bool) {
        return bytes(prosumers[prosumer].name).length > 0;
    }

    function deposit() public payable {
        require(msg.value > 0);

        contractBalance += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    uint256 public contractBalance;
    event Deposited(address indexed sender, uint amount);

    function withdraw() public {
        require(getEnergyStatus(msg.sender) >= 0);

        address payable sender = payable(msg.sender);
        uint amount = getEnergyStatus(sender);

        sender.transfer(amount);
    }
}


// Code above this is the ideal one.
// pragma solidity ^0.8.19;

// contract P2P {
//     struct Prosumer {
//         string name;
//         address id;
//         uint energyStatus;
//         uint balance;
//         uint reward;
//     }

//     mapping(address => Prosumer) prosumers;
//     uint256 private price;

//     event ProsumerRegistered(
//         address indexed prosumer,
//         string name,
//         uint energyStatus,
//         uint balance
//     );
    
//     event EnergyTraded(
//         address indexed buyer,
//         address indexed seller,
//         uint amount,
//         uint price
//     );

//     event Deposited(address indexed sender, uint amount);

//     function setPrice(uint256 newPrice) public {
//         price = newPrice;
//     }

//     function registerProsumer(string memory name, uint256 energyStatus) public {
//         require(bytes(name).length > 0);
//         require(energyStatus >= 0);

//         Prosumer storage newProsumer = prosumers[msg.sender];
//         newProsumer.name = name;
//         newProsumer.id = msg.sender;
//         newProsumer.energyStatus = energyStatus;
//         newProsumer.balance = 0;
//         newProsumer.reward = 0;

//         emit ProsumerRegistered(
//             msg.sender,
//             name,
//             energyStatus,
//             newProsumer.balance
//         );
//     }

//     function buyEnergy(uint amount) public payable {
//         require(price > 0);
//         require(amount > 0);
//         require(msg.value == price * amount);

//         Prosumer storage buyer = prosumers[msg.sender];
//         require(buyer.energyStatus >= amount);
//         require(address(this).balance >= price * amount);

//         Prosumer storage seller = prosumers[buyer.id];
//         require(seller.energyStatus >= amount);

//         buyer.energyStatus -= amount;
//         seller.energyStatus += amount;
//         buyer.balance += msg.value;
//         seller.balance += (price * amount);

//         // Reward the buyer and seller
//         uint256 rewardAmount = (price * amount) / 100;
//         buyer.reward += rewardAmount;
//         seller.reward += rewardAmount;

//         emit EnergyTraded(msg.sender, seller.id, amount, price);
//     }

//     function sellEnergy(uint amount) public {
//         require(amount > 0);

//         Prosumer storage seller = prosumers[msg.sender];
//         require(seller.energyStatus >= amount);

//         seller.energyStatus -= amount;
//         seller.balance += (price * amount);
//         seller.reward += (price * amount) / 100;

//         emit EnergyTraded(seller.id, msg.sender, amount, price * amount);
//     }

//     function getEnergyStatus(address prosumer) public view returns (uint) {
//         require(isProsumerRegistered(prosumer), "Prosumer is not registered");
//         return prosumers[prosumer].energyStatus;
//     }

//     function getBalance(address prosumer) public view returns (uint) {
//         require(isProsumerRegistered(prosumer), "Prosumer is not registered");
//         return prosumers[prosumer].balance;
//     }

//     function getReward(address prosumer) public view returns (uint) {
//         require(isProsumerRegistered(prosumer), "Prosumer is not registered");
//         return prosumers[prosumer].reward;
//     }

//     function isProsumerRegistered(address prosumer) public view returns (bool) {
//         return bytes(prosumers[prosumer].name).length > 0;
//     }

//     function deposit() public payable {
//         require(msg.value > 0);
//         contractBalance += msg.value;
//         emit Deposited(msg.sender, msg.value);
//     }

//     uint256 public contractBalance;

//     function withdraw() public {
//         require(isProsumerRegistered(msg.sender), "Prosumer is not registered");
//         Prosumer storage prosumer = prosumers[msg.sender];
//         require(prosumer.balance > 0, "Insufficient balance to withdraw");
//         uint256 amount = prosumer.balance;
//         prosumer.balance = 0;
//         payable(msg.sender).transfer(amount);
//     }
// }
