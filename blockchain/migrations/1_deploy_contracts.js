const TrustLens = artifacts.require("TrustLens");

module.exports = function (deployer) {
  deployer.deploy(TrustLens);
};