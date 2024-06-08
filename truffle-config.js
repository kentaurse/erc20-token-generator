const path = require('path')
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
    plugins: [
        'truffle-plugin-verify',
        'truffle-contract-size'
    ],
    api_keys: {
        bscscan: 'tu apikey de bscsacn'
    },
    contracts_build_directory: path.join(__dirname, "app/src/contracts"),
    networks: {
        bsc_testnet: {
            provider: () => new HDWalletProvider(
                'tu frase secreta',
                `https://data-seed-prebsc-1-s1.binance.org:8545`, 0),
            from: "tu wallet",
            gas: 6000000,
            network_id: 97,
            confirmations: 4,
            timeoutBlocks: 10000
        }
    },
    compilers: {
        solc: {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
}