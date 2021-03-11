var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var coinSelection;
var playerAddress;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0x29337fb1FE9cB5499BC50ef7B80431f10ed0db2d", {from: accounts[0]});
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

contractInstance.methods.coinFlip(coinSelection).send(config)
.on("transactionHash", function(hash){
  console.log(hash);
})
.on("confirmation", function(confirmationNr){
  if(confirmationNr < 4){
  console.log(confirmationNr);
}
})
.on("receipt", function(receipt){
  console.log(receipt);
  playerAddress = receipt.from;
  console.log("Player address is" + receipt.from);
})

contractInstance.events.generatedRandomNumber(function(error, event){
          console.log(event.returnValues);
          console.log("Generated random number for player "+ playerAddress + " is : " + event.returnValues.randomNumber);
        })

contractInstance.events.result(function(error, event){
                    console.log(event.returnValues);

          if(event.returnValues.betResult == true) {
            console.log("The bet result is:" + event.returnValues.betResult);
             alert("You won! You doubled your bet!");
      }
          else {
            console.log("The bet result is:" + event.returnValues.betResult);
              alert("You lost! Better luck next time!");
          }

      })

    };
