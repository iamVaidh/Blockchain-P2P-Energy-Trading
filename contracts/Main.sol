// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

    function isRegistered(address prosumer) public view returns (bool) {
        return p2pContract.isProsumerRegistered(prosumer);
    }

    function hasSufficientBalance(
        address prosumer,
        uint amount
    ) public view returns (bool) {
        return p2pContract.getBalance(prosumer) >= amount;
    }

    function registerProsumer() public onlyOnce {
        p2pContract.registerProsumer("Test Name", 0);
    }

    function depositEthers() public payable onlyRegistered {
        p2pContract.deposit{value: msg.value}();
    }

    function sendEnergyRequest(
        uint amount,
        bool isBuyer
    ) public onlyRegistered hasSufficientBalanceModifier(amount) {
        if (isBuyer) {
            p2pContract.buyEnergy(amount);
        } else {
            p2pContract.sellEnergy(amount);
        }
    }

    function getEnergyStatus(address prosumer) public view returns (uint) {
        return p2pContract.getEnergyStatus(prosumer);
    }

    function getBalance(address prosumer) public view returns (uint) {
        return p2pContract.getBalance(prosumer);
    }

    function withdrawEthers() public onlyRegistered {
        require(getEnergyStatus(msg.sender) >= 0);
        p2pContract.withdraw();
    }

    function setEnergyPrice(uint256 price) public onlyRegistered {
        p2pContract.setPrice(price);
    }
}


// Updated version

/** 
 
pragma solidity ^0.8.19;

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

    function isRegistered(address prosumer) public view returns (bool) {
        return p2pContract.isProsumerRegistered(prosumer);
    }

    function hasSufficientBalance(address prosumer, uint amount) public view returns (bool) {
        return p2pContract.getBalance(prosumer) >= amount;
    }

    function registerProsumer() public onlyOnce {
        p2pContract.registerProsumer("Test Name", 0);
    }

    function depositEthers() public payable onlyRegistered {
        p2pContract.deposit{value: msg.value}();
    }

    function sendEnergyRequest(
        uint amount,
        bool isBuyer
    ) public onlyRegistered hasSufficientBalanceModifier(amount) {
        if (isBuyer) {
            p2pContract.buyEnergy(amount);
        } else {
            p2pContract.sellEnergy(amount);
        }
    }

    function getEnergyStatus(address prosumer) public view returns (uint) {
        return p2pContract.getEnergyStatus(prosumer);
    }

    function getBalance(address prosumer) public view returns (uint) {
        return p2pContract.getBalance(prosumer);
    }

    function withdrawEthers() public onlyRegistered {
        require(getEnergyStatus(msg.sender) >= 0);
        p2pContract.withdraw();
    }

    function setEnergyPrice(uint256 price) public onlyRegistered {
        p2pContract.setPrice(price);
    }
}

*/