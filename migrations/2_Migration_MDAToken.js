const MDAToken = artifacts.require('MDAToken')

module.exports = (deployer) => {
    deployer.deploy(MDAToken)
}