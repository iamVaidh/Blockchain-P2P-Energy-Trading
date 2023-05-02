/**
 * DRAFT 1
 * describe("P2P smart contract", () => {
    let contract;

    beforeEach(async () => {
        contract = await new P2P(web3.currentProvider);
    });

    it("should be able to register a prosumer", async () => {
        const name = "Alice";
        const energyStatus = 100;
        await contract.registerProsumer(name, energyStatus);

        const prosumer = await contract.getProsumer(msg.sender);
        expect(prosumer.name).toEqual(name);
        expect(prosumer.energyStatus).toEqual(energyStatus);
    });

    it("should be able to buy energy", async () => {
        const amount = 10;
        await contract.buyEnergy(amount);

        const buyer = await contract.getProsumer(msg.sender);
        expect(buyer.energyStatus).toEqual(energyStatus - amount);
        expect(buyer.balance).toEqual(balance - price * amount);
    });

    it("should be able to sell energy", async () => {
        const amount = 10;
        await contract.sellEnergy(amount);

        const seller = await contract.getProsumer(msg.sender);
        expect(seller.energyStatus).toEqual(energyStatus + amount);
        expect(seller.balance).toEqual(balance + price * amount);
    });

    it("should be able to get the energy status of a prosumer", async () => {
        const energyStatus = 100;
        await contract.registerProsumer("Alice", energyStatus);

        const prosumer = await contract.getProsumer(msg.sender);
        expect(prosumer.energyStatus).toEqual(energyStatus);
    });

    it("should be able to get the balance of a prosumer", async () => {
        const balance = 100;
        await contract.deposit(balance);

        const prosumer = await contract.getProsumer(msg.sender);
        expect(prosumer.balance).toEqual(balance);
    });

    it("should be able to get the reward of a prosumer", async () => {
        const reward = 100;
        await contract.buyEnergy(10);

        const prosumer = await contract.getProsumer(msg.sender);
        expect(prosumer.reward).toEqual(reward);
    });

    it("should be able to check if a prosumer is registered", async () => {
        const isRegistered = await contract.isProsumerRegistered(msg.sender);
        expect(isRegistered).toEqual(true);
    });

    it("should be able to deposit energy", async () => {
        const amount = 10;
        await contract.deposit(amount);

        const contractBalance = await contract.getBalance();
        expect(contractBalance).toEqual(balance + amount);
    });

    it("should be able to withdraw energy", async () => {
        const amount = 10;
        await contract.deposit(amount);

        await contract.withdraw(amount);

        const contractBalance = await contract.getBalance();
        expect(contractBalance).toEqual(balance - amount);
    });
});
 */

/**
 * DRAFT 2
 * describe("P2P", () => {

  // Arrange
  const contract = new P2P();
  const buyer = web3.eth.accounts[0];
  const seller = web3.eth.accounts[1];
  const amount = 100;

  // Act
  contract.registerProsumer("Buyer", amount, { from: buyer });
  contract.registerProsumer("Seller", amount, { from: seller });
  contract.buyEnergy(amount, { from: buyer, value: amount * contract.price });
  contract.sellEnergy(amount, { from: seller });

  // Assert
  expect(contract.getEnergyStatus(buyer)).toEqual(0);
  expect(contract.getEnergyStatus(seller)).toEqual(amount * 2);
  expect(contract.getBalance(buyer)).toEqual(0);
  expect(contract.getBalance(seller)).toEqual(amount * contract.price * 2);
  expect(contract.getReward(buyer)).toEqual(amount * contract.price / 1000);
  expect(contract.getReward(seller)).toEqual(amount * contract.price / 200);
});
 */

/**
 * DRAFT 3
 * describe("P2P smart contract", () => {
  let contract;

  beforeEach(async () => {
    contract = await new P2P(web3.eth.accounts[0]);
  });

  it("should be able to register a prosumer", async () => {
    const name = "Alice";
    const energyStatus = 100;

    await contract.registerProsumer(name, energyStatus);

    const prosumer = await contract.getProsumer(contract.address);

    expect(prosumer.name).toEqual(name);
    expect(prosumer.energyStatus).toEqual(energyStatus);
  });

  it("should be able to buy energy", async () => {
    const buyer = contract.address;
    const seller = web3.eth.accounts[1];
    const amount = 10;

    await contract.buyEnergy(amount);

    const buyerProsumer = await contract.getProsumer(buyer);
    const sellerProsumer = await contract.getProsumer(seller);

    expect(buyerProsumer.energyStatus).toEqual(90);
    expect(sellerProsumer.energyStatus).toEqual(110);
    expect(buyerProsumer.balance).toEqual(90);
    expect(sellerProsumer.balance).toEqual(90);
  });

  it("should be able to sell energy", async () => {
    const buyer = web3.eth.accounts[1];
    const seller = contract.address;
    const amount = 10;

    await contract.sellEnergy(amount);

    const buyerProsumer = await contract.getProsumer(buyer);
    const sellerProsumer = await contract.getProsumer(seller);

    expect(buyerProsumer.energyStatus).toEqual(110);
    expect(sellerProsumer.energyStatus).toEqual(90);
    expect(buyerProsumer.balance).toEqual(110);
    expect(sellerProsumer.balance).toEqual(110);
  });

  it("should be able to get the energy status of a prosumer", async () => {
    const prosumer = contract.address;
    const expectedEnergyStatus = 100;

    const actualEnergyStatus = await contract.getEnergyStatus(prosumer);

    expect(actualEnergyStatus).toEqual(expectedEnergyStatus);
  });

  it("should be able to get the balance of a prosumer", async () => {
    const prosumer = contract.address;
    const expectedBalance = 100;

    const actualBalance = await contract.getBalance(prosumer);

    expect(actualBalance).toEqual(expectedBalance);
  });

  it("should be able to get the reward of a prosumer", async () => {
    const prosumer = contract.address;
    const expectedReward = 100;

    const actualReward = await contract.getReward(prosumer);

    expect(actualReward).toEqual(expectedReward);
  });

  it("should be able to check if a prosumer is registered", async () => {
    const prosumer = contract.address;
    const expectedIsRegistered = true;

    const actualIsRegistered = await contract.isProsumerRegistered(prosumer);

    expect(actualIsRegistered).toEqual(expectedIsRegistered);
  });

  it("should be able to deposit energy", async () => {
    const amount = 10;

    await contract.deposit(amount);

    const contractBalance = await contract.getBalance();

    expect(contractBalance).toEqual(amount);
  });

  it("should be able to withdraw energy", async () => {
    const amount = 10;

    await contract.withdraw(amount);

    const contractBalance = await contract.getBalance();

    expect(contractBalance).toEqual(-amount);
  });
});

 */


/**
 * Improvised draft 1
 * describe("P2P smart contract", () => {
  const P2P = artifacts.require("P2P");
contract("P2P", accounts => {
  it("should assert true", async function () {
    await P2P.deployed();
    return assert.isTrue(true);
  });

  let contract;

  beforeEach(async () => {
    contract = await new P2P(web3.currentProvider);
  });

  it("should be able to register a prosumer", async () => {
    const name = "Alice";
    const energyStatus = 100;
    await contract.registerProsumer(name, energyStatus);

    const prosumer = await contract.getProsumer(msg.sender);
    expect(prosumer.name).toEqual(name);
    expect(prosumer.energyStatus).toEqual(energyStatus);
  });

  it("should be able to buy energy", async () => {
    const amount = 10;
    await contract.buyEnergy(amount);

    const buyer = await contract.getProsumer(msg.sender);
    expect(buyer.energyStatus).toEqual(energyStatus - amount);
    expect(buyer.balance).toEqual(balance - price * amount);
  });

  it("should be able to sell energy", async () => {
    const amount = 10;
    await contract.sellEnergy(amount);

    const seller = await contract.getProsumer(msg.sender);
    expect(seller.energyStatus).toEqual(energyStatus + amount);
    expect(seller.balance).toEqual(balance + price * amount);
  });

  it("should be able to get the energy status of a prosumer", async () => {
    const energyStatus = 100;
    await contract.registerProsumer("Alice", energyStatus);

    const prosumer = await contract.getProsumer(msg.sender);
    expect(prosumer.energyStatus).toEqual(energyStatus);
  });

  it("should be able to get the balance of a prosumer", async () => {
    const balance = 100;
    await contract.deposit(balance);

    const prosumer = await contract.getProsumer(msg.sender);
    expect(prosumer.balance).toEqual(balance);
  });

  it("should be able to get the reward of a prosumer", async () => {
    const reward = 100;
    await contract.buyEnergy(10);

    const prosumer = await contract.getProsumer(msg.sender);
    expect(prosumer.reward).toEqual(reward);
  });

  it("should be able to check if a prosumer is registered", async () => {
    const isRegistered = await contract.isProsumerRegistered(msg.sender);
    expect(isRegistered).toEqual(true);
  });

  it("should be able to deposit energy", async () => {
    const amount = 10;
    await contract.deposit(amount);

    const contractBalance = await contract.getBalance();
    expect(contractBalance).toEqual(balance + amount);
  });

  it("should be able to withdraw energy", async () => {
    const amount = 10;
    await contract.deposit(amount);

    await contract.withdraw(amount);

    const contractBalance = await contract.getBalance();
    expect(contractBalance).toEqual(balance - amount);
  });
});
});
 * 
 */


/**
 * Improvised Draft 2
 * const P2P = artifacts.require("P2P");

contract("P2P", function (accounts) {
  beforeEach(async function () {
    this.contract = await P2P.deployed();
  });

  it("should assert true", async function () {
    return assert.isTrue(true);
  });

  it("should be able to register a prosumer", async function () {
    const name = "Alice";
    const energyStatus = 100;
    await this.contract.registerProsumer(name, energyStatus);

    const prosumer = await this.contract.getProsumer(msg.sender);
    expect(prosumer.name).toEqual(name);
    expect(prosumer.energyStatus).toEqual(energyStatus);
  });

  it("should be able to buy energy", async function () {
    const amount = 10;
    await this.contract.buyEnergy(amount);

    const buyer = await this.contract.getProsumer(msg.sender);
    expect(buyer.energyStatus).toEqual(energyStatus - amount);
    expect(buyer.balance).toEqual(balance - price * amount);
  });

  it("should be able to sell energy", async function () {
    const amount = 10;
    await this.contract.sellEnergy(amount);

    const seller = await this.contract.getProsumer(msg.sender);
    expect(seller.energyStatus).toEqual(energyStatus + amount);
    expect(seller.balance).toEqual(balance + price * amount);
  });

  it("should be able to get the energy status of a prosumer", async function () {
    const energyStatus = 100;
    await this.contract.registerProsumer("Alice", energyStatus);

    const prosumer = await this.contract.getProsumer(msg.sender);
    expect(prosumer.energyStatus).toEqual(energyStatus);
  });

  it("should be able to get the balance of a prosumer", async function () {
    const balance = 100;
    await this.contract.deposit(balance);

    const prosumer = await this.contract.getProsumer(msg.sender);
    expect(prosumer.balance).toEqual(balance);
  });

  it("should be able to get the reward of a prosumer", async function () {
    const reward = 100;
    await this.contract.buyEnergy(10);

    const prosumer = await this.contract.getProsumer(msg.sender);
    expect(prosumer.reward).toEqual(reward);
  });

  it("should be able to check if a prosumer is registered", async function () {
    const isRegistered = await this.contract.isProsumerRegistered(msg.sender);
    expect(isRegistered).toEqual(true);
  });

  it("should be able to deposit energy", async function () {
    const amount = 10;
    await this.contract.deposit(amount);

    const contractBalance = await this.contract.getBalance();
    expect(contractBalance).toEqual(balance + amount);
  });

  it("should be able to withdraw energy", async function () {
    const amount = 10;
    await this.contract.deposit(amount);

    await this.contract.withdraw(amount);

    const contractBalance = await this.contract.getBalance();
    expect(contractBalance).toEqual(balance - amount);
  });
});
 */

/**
 * Improved draft 3
 * 
 * const P2P = artifacts.require("P2P");

contract("P2P", function (accounts) {
  it("should assert true", async function () {
    await P2P.deployed();
    return assert.isTrue(true);
  });

  describe("P2P smart contract", () => {
    let contract;

    beforeEach(async () => {
      contract = await new P2P(web3.currentProvider);
    });

    it("should be able to register a prosumer", async () => {
      const name = "Alice";
      const energyStatus = 100;
      await contract.registerProsumer(name, energyStatus);

      const prosumer = await contract.getProsumer(msg.sender);
      expect(prosumer.name).toEqual(name);
      expect(prosumer.energyStatus).toEqual(energyStatus);
    });

    it("should be able to buy energy", async () => {
      const amount = 10;
      await contract.buyEnergy(amount);

      const buyer = await contract.getProsumer(msg.sender);
      expect(buyer.energyStatus).toEqual(energyStatus - amount);
      expect(buyer.balance).toEqual(balance - price * amount);
    });

    it("should be able to sell energy", async () => {
      const amount = 10;
      await contract.sellEnergy(amount);

      const seller = await contract.getProsumer(msg.sender);
      expect(seller.energyStatus).toEqual(energyStatus + amount);
      expect(seller.balance).toEqual(balance + price * amount);
    });

    it("should be able to get the energy status of a prosumer", async () => {
      const energyStatus = 100;
      await contract.registerProsumer("Alice", energyStatus);

      const prosumer = await contract.getProsumer(msg.sender);
      expect(prosumer.energyStatus).toEqual(energyStatus);
    });

    it("should be able to get the balance of a prosumer", async () => {
      const balance = 100;
      await contract.deposit(balance);

      const prosumer = await contract.getProsumer(msg.sender);
      expect(prosumer.balance).toEqual(balance);
    });

    it("should be able to get the reward of a prosumer", async () => {
      const reward = 100;
      await contract.buyEnergy(10);

      const prosumer = await contract.getProsumer(msg.sender);
      expect(prosumer.reward).toEqual(reward);
    });

    it("should be able to check if a prosumer is registered", async () => {
      const isRegistered = await contract.isProsumerRegistered(msg.sender);
      expect(isRegistered).toEqual(true);
    });

    it("should be able to deposit energy", async () => {
      const amount = 10;
      await contract.deposit(amount);

      const contractBalance = await contract.getBalance();
      expect(contractBalance).toEqual(balance + amount);
    });

    it("should be able to withdraw energy", async () => {
      const amount = 10;
      await contract.deposit(amount);

      await contract.withdraw(amount);

      const contractBalance = await contract.getBalance();
      expect(contractBalance).toEqual(balance - amount);
    });
  });
});
 */

/**
 * 
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