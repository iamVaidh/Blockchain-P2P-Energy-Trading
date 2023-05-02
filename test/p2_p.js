const P2P = artifacts.require("P2P");

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


