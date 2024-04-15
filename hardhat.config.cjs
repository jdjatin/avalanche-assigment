// hardhat.config.js

require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
 
module.exports = {
  solidity: "0.8.6",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    fuji: {
      url: "",
      accounts: [''],
      chainId: 43113,
    },
  },
}