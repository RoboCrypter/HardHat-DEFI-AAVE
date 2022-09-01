require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("hardhat-contract-sizer")
require("dotenv").config()



const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY



module.exports = {

  solidity: {
    compilers:[ {version: "0.8.7"}, {version: "0.6.6"}, {version: "0.6.12"}, {version: "0.4.19"}]
  },

  defaultNetwork: "hardhat",

  networks: {

    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL
      }
    },

    rinkeby: {
      chainId: 4,
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
    }
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },

  namedAccounts: {

    deployer: {
      default: 0
    },

    user: {
      default: 1
    }
  },

  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "aave"
  },

  mocha: {
    timeout: 200000
  }

}
