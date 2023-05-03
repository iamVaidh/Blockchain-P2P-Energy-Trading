// const { expect } = require('chai');
// const mainContract = require('Main.sol').Main;

// describe('Main contract', () => {
//   it('should deploy successfully', async () => {
//     const main = new mainContract(web3.eth.accounts[0]);
//     await main.deployed();
//     expect(main.address).to.not.be.null;
//   });

//   it('should only allow registered users to access its methods', async () => {
//     const main = new mainContract(web3.eth.accounts[0]);
//     await main.deployed();

//     // Try to call a method without registering first
//     await expect(main.sendEnergyRequest(1, true)).to.be.rejectedWith(
//       'The user is not registered'
//     );

//     // Register the user
//     await main.registerProsumer('Test User', 100);

//     // Now the method should be callable
//     await main.sendEnergyRequest(1, true);
//   });

//   it('should only allow users with sufficient balance to call its methods', async () => {
//     const main = new mainContract(web3.eth.accounts[0]);
//     await main.deployed();

//     // Try to call a method with insufficient balance
//     await expect(main.depositEthers(1)).to.be.rejectedWith(
//       'Insufficient balance'
//     );

//     // Deposit some ethers
//     await main.depositEthers(10);

//     // Now the method should be callable
//     await main.depositEthers(1);
//   });

//   it('should correctly update the energy status of the user', async () => {
//     const main = new mainContract(web3.eth.accounts[0]);
//     await main.deployed();

//     // Register the user with an initial energy status of 100
//     await main.registerProsumer('Test User', 100);

//     // Send a request to buy 10 units of energy
//     await main.sendEnergyRequest(10, true);

//     // Check that the user's energy status has been updated
//     expect(main.getEnergyStatus(main.address)).to.equal(90);
//   });

//   it('should correctly update the balance of the user', async () => {
//     const main = new mainContract(web3.eth.accounts[0]);
//     await main.deployed();

//     // Register the user with an initial balance of 100 ETH
//     await main.registerProsumer('Test User', 100);

//     // Send a request to buy 10 units of energy
//     await main.sendEnergyRequest(10, true);

//     // Check that the user's balance has been updated
//     expect(main.getBalance(main.address)).to.equal(90);
//   });
// });
