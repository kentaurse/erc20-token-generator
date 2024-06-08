import MDATokenFactory from './MDATokenFactory.json'
import contract from 'truffle-contract'

export default async (provider) => {
    const tokenFactory = contract(MDATokenFactory)
    tokenFactory.setProvider(provider)
    var instance = await tokenFactory.deployed()
    return instance
}