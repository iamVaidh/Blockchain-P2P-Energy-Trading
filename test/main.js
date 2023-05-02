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


