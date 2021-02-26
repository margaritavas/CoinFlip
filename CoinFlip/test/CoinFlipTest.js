const CoinFlip = artifacts.require("CoinFlip");
const TruffleAssert = require("truffle-assertions");

contract ("CoinFlip", async function(accounts){

let instance;

before(async function(){
  instance = await CoinFlip.deployed()
});

it("should allow bets with a minimum of 0.1 Ether or higher", async function(){
  await TruffleAssert.passes(instance.flipCoin({value: web3.utils.toWei("0.5", "Ether")}))
});

it("should not allow bets less than 0.1 Ether", async function(){
  await TruffleAssert.fails(instance.flipCoin({value: web3.utils.toWei("0.001", "Ether")}))
});

it("should not allow bets higher than the contract balance", async function(){
  await TruffleAssert.fails(instance.flipCoin({value: web3.utils.toWei("20", "Ether")}))
});

it("should be able to withdraw all funds", async function(){
      await TruffleAssert.passes(instance.withdrawAll({from:accounts[0]}));
});

it("should not be able to withdraw all funds", async function(){
      await TruffleAssert.fails(instance.withdrawAll({from:accounts[1]}));
});
});
