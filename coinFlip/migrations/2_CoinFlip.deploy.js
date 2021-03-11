const CoinFlip = artifacts.require("CoinFlip");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CoinFlip).then(function(instance){
    instance.addBalance({value: web3.utils.toWei("2","ether"), from: accounts[0]}).then(function(){
      console.log("The contract successfully got funded with 2 ether by the contract owner " + accounts[0]);
      console.log("The contract address is " + CoinFlip.address);
    }).catch(function(err){
      console.log("error: " + err);
    });
  }).catch(function(err){
    console.log("Fail to deploy " + err);
  });
};
