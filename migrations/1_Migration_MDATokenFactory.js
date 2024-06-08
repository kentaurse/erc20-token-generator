const MDATokenFactory = artifacts.require('MDATokenFactory')

module.exports = (deployer) => {
    deployer.deploy(MDATokenFactory, '0x296083FE438d8dF9df8A55F76AA6354dD90c10D1')
}