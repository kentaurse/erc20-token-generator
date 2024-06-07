const { toBn } = require("evm-bn")
const ethers = require('ethers')

const FromWei = (amount, decimals) => {
    return amount / (10 ** decimals)
}

const ToWei = (amount, decimals) => {
    return ethers.BigNumber
        .from(toBn(amount.toString(), decimals)._hex).toString()
}

const Random = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}

module.exports = {
    FromWei,
    ToWei,
    Random
}