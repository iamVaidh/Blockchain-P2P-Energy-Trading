const P2P = artifacts.require("P2P");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("P2P", (/* accounts */) => {
  // P2P contract tests
  describe("P2P contract", async () => {
    // Arrange
    const p2pContract = await web3.eth.contract(P2P.info.abiDefinition).at("0x...");

    it("should be able to register a prosumer", async () => {
      // Act
      await p2pContract.registerProsumer("Test Name", 0);

      // Assert
      const prosumer = await p2pContract.getProsumer(msg.sender);
      expect(prosumer.name).toEqual("Test Name");
      expect(prosumer.energyStatus).toEqual(0);
    });

    it("should be able to buy energy", async () => {
      // Arrange
      const buyer = await web3.eth.accounts.at("0x...");
      const seller = await web3.eth.accounts.at("0x...");
      const amount = 10;
      const price = 100;

      // Act
      await p2pContract.buyEnergy(amount, { from: buyer, value: amount * price });

      // Assert
      const buyerProsumer = await p2pContract.getProsumer(buyer);
      const sellerProsumer = await p2pContract.getProsumer(seller);
      expect(buyerProsumer.energyStatus).toEqual(energyStatus - amount);
      expect(sellerProsumer.energyStatus).toEqual(energyStatus + amount);
      expect(buyerProsumer.balance).toEqual(balance - amount * price);
      expect(sellerProsumer.balance).toEqual(balance + amount * price);
    });

    it("should be able to sell energy", async () => {
      // Arrange
      const buyer = await web3.eth.accounts.at("0x...");
      const seller = await web3.eth.accounts.at("0x...");
      const amount = 10;
      const price = 100;

      // Act
      await p2pContract.sellEnergy(amount, { from: seller, value: amount * price });

      // Assert
      const buyerProsumer = await p2pContract.getProsumer(buyer);
      const sellerProsumer = await p2pContract.getProsumer(seller);
      expect(buyerProsumer.energyStatus).toEqual(energyStatus + amount);
      expect(sellerProsumer.energyStatus).toEqual(energyStatus - amount);
      expect(buyerProsumer.balance).toEqual(balance + amount * price);
      expect(sellerProsumer.balance).toEqual(balance - amount * price);
    });

    it("should not be able to buy energy if the buyer does not have enough ether", async () => {
      // Arrange
      const buyer = await web3.eth.accounts.at("0x...");
      const seller = await web3.eth.accounts.at("0x...");
      const amount = 10;
      const price = 100;

      // Act
      try {
        await p2pContract.buyEnergy(amount, { from: buyer });
        fail("Should have failed");
      } catch (error) {
        expect(error.message).toEqual("Insufficient funds");
      }
    });

    it("should not be able to sell energy if the seller does not have enough energy", async () => {
      // Arrange
      const buyer = await web3.eth.accounts.at("0x...");
      const seller = await web3.eth.accounts.at("0x...");
      const amount = 10;
      const price = 100;

      // Act
      try {
        await p2pContract.sellEnergy(amount, { from: seller });
        fail("Should have failed");
      } catch (error) {
        expect(error.message).toEqual("Insufficient energy");
      }
    });
  });
});



