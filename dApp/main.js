var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var selection;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi,"0x73A70c912538c614978Fa0cF6929890B622C9bD9", {from: accounts[0]});
      console.log(contractInstance);
    });

$("#head_button").click(heads);

$("#tails_button").click(tails);

$("#confirm_button").click(flipCoin);

});

function heads(){
  selection=1;
  alert("You have selected Head!")
}

function tails(){
  selection=0;
  alert("You have selected Tails!")
}

function flipCoin(){
  var bet = $("#bet_input").val();
      bet= web3.utils.toWei(bet, "Ether")

contractInstance.methods.flipCoin(selection).send({value:bet})
.on("transactionHash", function(hash){
  console.log(hash);
})
.on("confirmationNr", function(confirmationNr){
  console.log(confirmationNr);
})
.on("receipt", function(receipt){
          if(receipt.events.Result.returnValues.result == false){
            alert("You lost!");
          }
          else if(receipt.events.Result.returnValues.result == true){
            alert("You won!");
          }
      });
    };
