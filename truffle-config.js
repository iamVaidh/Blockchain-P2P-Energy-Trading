module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      gas: 4712388,
      gasPrice: 20000000000,
      from: "0xACCOUNT_ADDRESS",
      mnemonic: "MNEMONIC_PHRASE",
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

