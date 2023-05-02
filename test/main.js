// const Main = artifacts.require("Main");

// /*
//  * uncomment accounts to access the test accounts made available by the
//  * Ethereum client
//  * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
//  */
// contract("Main", async (/* accounts */) => {
//   describe("Main", () => {
//     let mainContract;

//     beforeEach(async () => {
//       mainContract = await web3.eth.contract(Main.info.abiDefinition).at(mainContractAddress);
//     });

//     it("should be able to register a prosumer", async () => {
//       const name = "Test Name";
//       const energyStatus = 0;

//       const result = await mainContract.registerProsumer(name, energyStatus);
//       expect(result).toEqual(true);
//     });

//     it("should be able to deposit ethers", async () => {
//       const amount = web3.toWei(1, "ether");

//       const result = await mainContract.depositEthers({ value: amount });
//       expect(result).toEqual(amount);
//     });

//     it("should be able to send an energy request", async () => {
//       const amount = 10;
//       const isBuyer = true;

//       const result = await mainContract.sendEnergyRequest(amount, isBuyer);
//       expect(result).toEqual(true);
//     });

//     it("should be able to get the energy status of a prosumer", async () => {
//       const expectedEnergyStatus = 100;

//       const result = await mainContract.getEnergyStatus(msg.sender);
//       expect(result).toEqual(expectedEnergyStatus);
//     });

//     it("should be able to get the balance of a prosumer", async () => {
//       const expectedBalance = 1000000000000000000;

//       const result = await mainContract.getBalance(msg.sender);
//       expect(result).toEqual(expectedBalance);
//     });

//     it("should be able to withdraw ethers", async () => {
//       const amount = web3.toWei(1, "ether");

//       const result = await mainContract.withdrawEthers();
//       expect(result).toEqual(amount);
//     });

//     it("should be able to set the energy price", async () => {
//       const price = 100;

//       const result = await mainContract.setEnergyPrice(price);
//       expect(result).toEqual(true);
//     });
//   });
// });

// SPDX-License-Identifier: MIT
const P2P = artifacts.require("P2P");
const Main = artifacts.require("Main");

contract("Main", accounts => {
  let p2p;
  let main;

  beforeEach(async () => {
    p2p = await P2P.new();
    main = await Main.new(p2p.address);
  });

  it("should register a prosumer", async () => {
    await main.registerProsumer({ from: accounts[1] });
    const isRegistered = await p2p.isProsumerRegistered(accounts[1]);
    assert.isTrue(isRegistered, "Prosumer should be registered after calling registerProsumer");
  });

  it("should deposit ethers", async () => {
    await main.registerProsumer({ from: accounts[1] });
    const initialBalance = await web3.eth.getBalance(main.address);
    await main.depositEthers({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
    const finalBalance = await web3.eth.getBalance(main.address);
    assert.equal(finalBalance - initialBalance, web3.utils.toWei("1", "ether"), "Main contract should receive ethers deposited by prosumer");
  });

  it("should send energy request as buyer", async () => {
    await main.registerProsumer({ from: accounts[1] });
    await main.setEnergyPrice(web3.utils.toWei("0.01", "ether"));
    await p2p.setBalance(accounts[1], web3.utils.toWei("0.5", "ether")); // set prosumer balance to 0.5 ETH
    const initialBuyerBalance = await p2p.getBalance(accounts[0]);
    await main.sendEnergyRequest(web3.utils.toWei("100", "kWh"), true, { from: accounts[0] });
    const finalBuyerBalance = await p2p.getBalance(accounts[0]);
    const finalSellerBalance = await p2p.getBalance(accounts[1]);
    assert.equal(finalBuyerBalance - initialBuyerBalance, web3.utils.toWei("1", "ether"), "Buyer should receive requested amount of energy");
    assert.equal(finalSellerBalance, web3.utils.toWei("0.4", "ether"), "Seller should receive payment for sold energy");
  });

  it("should send energy request as seller", async () => {
    await main.registerProsumer({ from: accounts[1] });
    await main.setEnergyPrice(web3.utils.toWei("0.01", "ether"));
    await p2p.setBalance(accounts[0], web3.utils.toWei("0.5", "ether")); // set buyer balance to 0.5 ETH
    const initialBuyerBalance = await p2p.getBalance(accounts[0]);
    await main.sendEnergyRequest(web3.utils.toWei("100", "kWh"), false, { from: accounts[1] });
    const finalBuyerBalance = await p2p.getBalance(accounts[0]);
    const finalSellerBalance = await p2p.getBalance(accounts[1]);
    assert.equal(finalBuyerBalance - initialBuyerBalance, web3.utils.toWei("1", "ether"), "Buyer should pay requested amount of energy");
    assert.equal(finalSellerBalance, web3.utils.toWei("0.6", "ether"), "Seller should have received payment for sold energy");
  });

  it("should withdraw ethers", async () => {
    await main.registerProsumer({ from: accounts[1] });
    await main.setEnergyPrice(web3.utils.toWei("0.01", "ether"));
    await p2p.buyEnergy(web3.utils.toWei("0.5", "ether"), web3.utils.toWei("100", "kWh"), { from: accounts[0] }); // buy 100 kWh of energy for 0.5 ETH
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await main.withdrawEthers({ from: accounts[1] });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    assert.equal(finalBalance - initialBalance, web3.utils.toWei("0.5", "ether"), "Main contract should transfer ethers to prosumer upon withdrawal");
  });

  it("should set energy price", async () => {
    await main.registerProsumer({ from: accounts[1] });
    await main.setEnergyPrice(web3.utils.toWei("0.02", "ether"));
    const price = await p2p.getPrice();
    assert.equal(price, web3.utils.toWei("0.02", "ether"), "Price should be set correctly");
  });

});



