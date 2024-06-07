import { FromWei, ToWei } from "../util/decode"

export default class TokenFactory {
    constructor(contract) {
        this.contract = contract
    }

    async _approve(spender, amount, from, decimals) {
        return await this.contract.approve(spender, ToWei(amount, decimals)).send({ from })
    }

    async _allowance(owner, spender, decimals) {
        return FromWei((await this.contract.allowance(owner, spender)
            .call({ from: owner })), decimals)
    }
}