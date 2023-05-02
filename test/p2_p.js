// const P2P = artifacts.require("P2P");

// /*
//  * uncomment accounts to access the test accounts made available by the
//  * Ethereum client
//  * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
//  */
// contract("P2P", async (/* accounts */) => {
//   // P2P contract tests
//   describe("P2P contract", async () => {
//     // Arrange
//     const p2pContract = await web3.eth.contract(P2P.info.abiDefinition).at("0x...");

//     it("should be able to register a prosumer", async () => {
//       // Act
//       await p2pContract.registerProsumer("Test Name", 0);

//       // Assert
//       const prosumer = await p2pContract.getProsumer(msg.sender);
//       expect(prosumer.name).toEqual("Test Name");
//       expect(prosumer.energyStatus).toEqual(0);
//     });

//     it("should be able to buy energy", async () => {
//       // Arrange
//       const buyer = await web3.eth.accounts.at("0x...");
//       const seller = await web3.eth.accounts.at("0x...");
//       const amount = 10;
//       const price = 100;

//       // Act
//       await p2pContract.buyEnergy(amount, { from: buyer, value: amount * price });

//       // Assert
//       const buyerProsumer = await p2pContract.getProsumer(buyer);
//       const sellerProsumer = await p2pContract.getProsumer(seller);
//       expect(buyerProsumer.energyStatus).toEqual(energyStatus - amount);
//       expect(sellerProsumer.energyStatus).toEqual(energyStatus + amount);
//       expect(buyerProsumer.balance).toEqual(balance - amount * price);
//       expect(sellerProsumer.balance).toEqual(balance + amount * price);
//     });

//     it("should be able to sell energy", async () => {
//       // Arrange
//       const buyer = await web3.eth.accounts.at("0x...");
//       const seller = await web3.eth.accounts.at("0x...");
//       const amount = 10;
//       const price = 100;

//       // Act
//       await p2pContract.sellEnergy(amount, { from: seller, value: amount * price });

//       // Assert
//       const buyerProsumer = await p2pContract.getProsumer(buyer);
//       const sellerProsumer = await p2pContract.getProsumer(seller);
//       expect(buyerProsumer.energyStatus).toEqual(energyStatus + amount);
//       expect(sellerProsumer.energyStatus).toEqual(energyStatus - amount);
//       expect(buyerProsumer.balance).toEqual(balance + amount * price);
//       expect(sellerProsumer.balance).toEqual(balance - amount * price);
//     });

//     it("should not be able to buy energy if the buyer does not have enough ether", async () => {
//       // Arrange
//       const buyer = await web3.eth.accounts.at("0x...");
//       const seller = await web3.eth.accounts.at("0x...");
//       const amount = 10;
//       const price = 100;

//       // Act
//       try {
//         await p2pContract.buyEnergy(amount, { from: buyer });
//         fail("Should have failed");
//       } catch (error) {
//         expect(error.message).toEqual("Insufficient funds");
//       }
//     });

//     it("should not be able to sell energy if the seller does not have enough energy", async () => {
//       // Arrange
//       const buyer = await web3.eth.accounts.at("0x...");
//       const seller = await web3.eth.accounts.at("0x...");
//       const amount = 10;
//       const price = 100;

//       // Act
//       try {
//         await p2pContract.sellEnergy(amount, { from: seller });
//         fail("Should have failed");
//       } catch (error) {
//         expect(error.message).toEqual("Insufficient energy");
//       }
//     });
//   });
// });

// const { assert } = require('chai');

// const P2P = artifacts.require('P2P');

// contract('P2P', (accounts) => {
//   const [alice, bob] = accounts;
//   const name = 'Alice';
//   const energyStatus = 1000;
//   const amount = 500;

//   beforeEach(async () => {
//     p2p = await P2P.new();
//   });

//   it('should register a prosumer', async () => {
//     const result = await p2p.registerProsumer(name, energyStatus, {
//       from: alice,
//     });
//     assert.equal(result.logs[0].args.name, name);
//     assert.equal(result.logs[0].args.energyStatus, energyStatus);
//   });

//   it('should buy energy', async () => {
//     await p2p.registerProsumer(name, energyStatus, { from: alice });
//     await p2p.registerProsumer(name, energyStatus, { from: bob });
//     await p2p.setPrice(1, { from: alice });
//     const result = await p2p.buyEnergy(amount, { from: alice, value: amount });
//     assert.equal(result.logs[0].args.buyer, alice);
//     assert.equal(result.logs[0].args.seller, bob);
//     assert.equal(result.logs[0].args.amount, amount);
//     assert.equal(result.logs[0].args.price, 1);
//   });

//   it('should sell energy', async () => {
//     await p2p.registerProsumer(name, energyStatus, { from: alice });
//     await p2p.setPrice(1, { from: alice });
//     const result = await p2p.sellEnergy(amount, { from: alice });
//     assert.equal(result.logs[0].args.buyer, bob);
//     assert.equal(result.logs[0].args.seller, alice);
//     assert.equal(result.logs[0].args.amount, amount);
//     assert.equal(result.logs[0].args.price, 0);
//   });

//   it('should deposit', async () => {
//     const value = 100;
//     const result = await p2p.deposit({ from: alice, value });
//     assert.equal(result.logs[0].args.sender, alice);
//     assert.equal(result.logs[0].args.amount, value);
//     const balance = await p2p.contractBalance();
//     assert.equal(balance, value);
//   });

//   it('should withdraw', async () => {
//     await p2p.registerProsumer(name, energyStatus, { from: alice });
//     const value = 500;
//     await p2p.setPrice(1, { from: alice });
//     await p2p.buyEnergy(amount, { from: alice, value: amount });
//     const initialBalance = await web3.eth.getBalance(alice);
//     await p2p.withdraw({ from: alice });
//     const finalBalance = await web3.eth.getBalance(alice);
//     assert.isAbove(finalBalance, initialBalance);
//   });
// });



