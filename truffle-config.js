module.exports = {

 // Configure your networks
  networks: {

   // development network is default for truffle
    development: {
     host: "172.16.1.38",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.0",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}