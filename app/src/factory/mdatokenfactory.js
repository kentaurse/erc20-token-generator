import { FromWei, ToWei } from "../util/decode"

export default class MDATokenFactory {
    constructor(contract) {
        this.contract = contract
        this.mdaDecimals = 18
    }

    _address() {
        return this.contract.address
    }

    async getDeployPriceMDA(from) {
        return parseFloat(FromWei((await this.contract.getDeployPriceMDA({ from })),
            this.mdaDecimals)).toFixed(0)
    }

    async getPaidTokenAddress(from) {
        return (await this.contract.getPaidTokenAddress({ from }))
    }

    async getPaidTokenDecimals(from) {
        return (await this.contract.getPaidTokenDecimals({ from })).toNumber()
    }

    async getDeployPriceBNB(from) {
        return parseFloat(FromWei((await this.contract.getDeployPriceBNB({ from })), 18)).toFixed(2)
    }

    async deployFree(name, symbol, supply, from) {
        return (await this.contract.deployFree(name, symbol, supply, { from }))
            .receipt.logs[0].address
    }

    async deployPaidBNB(name, symbol, decimals, supply, tokenType, from) {
        const price = await this.getDeployPriceBNB(from)
        return (await this.contract.deployPaidBNB(
            name,
            symbol,
            decimals,
            supply,
            tokenType,
            { from, value: ToWei(price, 18) }
        )).receipt.logs[0].address
    }

    async deployPaidMDA(name, symbol, decimals, supply, tokenType, from) {
        return (await this.contract.deployPaidMDA(
            name,
            symbol,
            decimals,
            supply,
            tokenType,
            { from }
        )).receipt.logs[0].address
    }
}