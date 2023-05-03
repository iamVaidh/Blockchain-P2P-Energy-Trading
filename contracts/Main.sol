// SPDX-License-Identifier: MIT
pragma solidity <=0.8.19;

import "./P2P.sol";

contract Main {
    P2P private p2pContract;

    modifier onlyRegistered() {
        require(isRegistered(msg.sender));
        _;
    }

    modifier onlyOnce() {
        require(!isRegistered(msg.sender));
        _;
    }

    modifier hasSufficientBalanceModifier(uint amount) {
        require(hasSufficientBalance(msg.sender, amount));
        _;
    }

    constructor(address _p2pContractAddress) {
        p2pContract = P2P(_p2pContractAddress);
    }

    function registerProsumer(string memory _name, uint _energyStatus) public onlyOnce {
        p2pContract.registerProsumer(_name, _energyStatus);
    }
    
    function isRegistered(address prosumer) public view returns (bool) {
        return p2pContract.isProsumerRegistered(prosumer);
    }

    function hasSufficientBalance(
        address prosumer,
        uint amount
    ) public view returns (bool) {
        return p2pContract.getBalance(prosumer) >= amount;
    }

    function depositEthers() public payable onlyRegistered {
        p2pContract.deposit{value: msg.value}();
    }

    function getBalance(address prosumer) public view returns (uint) {
        return p2pContract.getBalance(prosumer);
    } 

    function withdrawEthers() public payable onlyRegistered {
        require(getEnergyStatus(msg.sender) >= 0);
        p2pContract.withdraw();
    }

    function sendEnergyRequest(
        uint amount,
        bool isBuyer
    ) public payable onlyRegistered hasSufficientBalanceModifier(amount) {
        if (isBuyer) {
            p2pContract.buyEnergy{value: msg.value}(amount);
        } else {
            p2pContract.sellEnergy(amount);
        }
    }

    function getEnergyStatus(address prosumer) public view returns (uint) {
        return p2pContract.getEnergyStatus(prosumer);
    }

    function setEnergyPrice(uint256 price) public onlyRegistered {
        p2pContract.setPrice(price);
    }
}
