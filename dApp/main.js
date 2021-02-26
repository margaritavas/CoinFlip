var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(async function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(window.abi,"0x49F6F2fEa0D3a24415c54e22B44B94AAa26097D7", {from: accounts[0]});
      console.log(contractInstance)
    })
  });

$("#head_button").click(function() {
  selection=1;
});

$("#tails_button").click(function(){
  selection=0;
});

function flipCoin(){
  var bet = $("#bet_input").val().toString();
      bet= web3.utils.toWei(bet, "Ether")}

contractInstance.methods.flipCoin(selection).send({value:bet})
.on("receipt", function(receipt){

          if(receipt.events.betPlaced.returnValues[3] == false){
            alert("You lost!")
          }
          else if(receipt.events.betPlaced.returnValues[3] == true){
            alert("You won!")
          }
      })
