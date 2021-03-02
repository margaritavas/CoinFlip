var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var coinSelection;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0x1772AF08884b6Ad9AcdA83F288D75f0d2Cc418a6", {from: accounts[0]});
      console.log(contractInstance);
    });

$("#head_button").click(heads);

$("#tails_button").click(tails);

$("#confirm_button").click(flipCoin);

});

function heads(){
  coinSelection=1;
  $("#selection").text("Your selection is: Heads");
}

function tails(){
  coinSelection=0;
  $("#selection").text("Your selection is: Tails");
}

function flipCoin(){
  var bet = $("#bet_input").val();
  var config = {
    value:web3.utils.toWei(bet, "Ether"),
  }

contractInstance.methods.flipCoin(coinSelection).send(config)
.on("transactionHash", function(hash){
  console.log(hash);
})
.on("confirmation", function(confirmationNr){
  console.log(confirmationNr);
})
.on("receipt", function(receipt){
  console.log(receipt);
          if (receipt.events.result.returnValues.betResult == true){
            console.log("The bet result is:" +receipt.events.result.returnValues.betResult);
              alert("You won! You doubled your bet!");
        }
          else {
            console.log("The bet result is:" +receipt.events.result.returnValues.betResult);
              alert("You lost! Better luck next time!");
          }
      });
    };
