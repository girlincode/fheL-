import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-ethers'
import '@cofhe/hardhat-plugin'
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.25',
    settings: {
      evmVersion: 'cancun',
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    'eth-sepolia': {
      url: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia.publicnode.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasMultiplier: 1.2,
      timeout: 120000,
    },
  },
  etherscan: {
    apiKey: {
      'eth-sepolia': process.env.ETHERSCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'eth-sepolia',
        chainId: 11155111,
        urls: {
          apiURL: 'https://api-sepolia.etherscan.io/api',
          browserURL: 'https://sepolia.etherscan.io',
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  cofhe: {
    gasWarning: false,
  },
}

export default config
