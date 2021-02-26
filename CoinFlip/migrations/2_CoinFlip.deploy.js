const CoinFlip = artifacts.require("CoinFlip");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CoinFlip).then(function(instance){
  instance.addBalance({value: web3.utils.toWei("3", "Ether"), from: accounts[0]})
  });
};
