var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var coinSelection;
var playerAddress;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(window.abi,"0x29337fb1FE9cB5499BC50ef7B80431f10ed0db2d", {from: accounts[0]});
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
  console.log("This is the players address: " + receipt.from);
})

contractInstance.once('generatedRandomNumber', {
            filter: {address: playerAddress},
            fromBlock:'latest'
          }, function(error, event){
            console.log(event);
            console.log("The random number generated for the player "+playerAddress+" is : "+event.returnValues.randomNumber);
          });

contractInstance.once('result', {
            filter: {address: playerAddress},
            fromBlock:'latest'
          }, function(error, event){
           console.log(event);

           if (event.returnValues.betResult == true) {
             console.log("Bet result is: "+event.returnValues.betResult)
             alert("Congratulations! You won!");
           }else {
             console.log("Bet result is: "+event.returnValues.betResult)
                   alert("You lost! More luck next time!");
             };
           });

};
