pragma solidity 0.5.12;

contract CoinFlip{

    uint public balance;
    address public owner;

    constructor() public payable {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    modifier costs(uint cost){
        require(msg.value >= cost, "The minimum bet is 0.1 Ether");
        _;
    }

    struct Player {
      uint coinSelection;
      uint betInput;
      uint result;
    }

    mapping (address=>Player) bets;

    event result(address player, bool betResult, uint valueBack);

    function addBalance() public payable {
      require(msg.value>0);
    }

    function random() public view returns(uint){
      return now % 2;
    }


    function flipCoin(uint coinGuess) public payable costs(0.01 ether) returns(bool betResult){
        require(address(this).balance >= msg.value, "The contract does not have enough funds");

    Player memory newPlayer;
    address payable player = msg.sender;
    uint toTransfer;
    newPlayer.coinSelection = coinGuess;
    newPlayer.betInput = msg.value;
    newPlayer.result = random();
    bets[player] = newPlayer;

    if(bets[player].result == bets[player].coinSelection){
      toTransfer = bets[player].betInput*2;
      player.transfer(toTransfer);
      emit result (msg.sender, true, toTransfer);
      return true;
    }

    else {
      emit result(msg.sender, false, 0);
      return false;
    }
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

        function withdrawAll() public onlyOwner returns(uint) {
            msg.sender.transfer(address(this).balance);
            assert(address(this).balance == 0);
            return address(this).balance;
    }

}
