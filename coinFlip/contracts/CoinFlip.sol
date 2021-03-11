pragma solidity 0.5.12;

import "./provableAPI.sol";

contract CoinFlip is usingProvable{

    address public owner;
    uint constant NUM_RANDOM_BYTES_REQUESTED=1;

    constructor() public {
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
      address payable playerAddress;
      uint coinSelection;
      uint betInput;
      uint Result;
      bool callbackStatus;
    }

    mapping (bytes32=>Player) playerIDs;

    event LogNewProvableQuery(string description);
    event result (address indexed player, bool betResult, uint valueBack);
    event generatedRandomNumber(uint randomNumber);


    function coinFlip(uint coinGuess) public payable costs(1 wei){

      Player memory newPlayer;
      bytes32 playerQueryID;
      newPlayer.playerAddress = msg.sender;
      newPlayer.coinSelection = coinGuess;
      newPlayer.betInput = msg.value;
      playerQueryID = getRandomNumber();
      newPlayer.callbackStatus=true;
      playerIDs[playerQueryID] = newPlayer;
}

function getRandomNumber() public payable returns(bytes32){
  uint QUERY_EXECUTION_DELAY = 0;
  uint GAS_FOR_CALLBACK = 200000;
  bytes32 queryID = provable_newRandomDSQuery(
    QUERY_EXECUTION_DELAY,
    NUM_RANDOM_BYTES_REQUESTED,
    GAS_FOR_CALLBACK
    );

    emit LogNewProvableQuery("Provable query was sent. Waiting for the answer..");
    return queryID
}

    function __callback(bytes32 _queryID, string memory _result) public {
      require(msg.sender == provable_cbAddress());
      uint randomNumber = uint(keccak256(abi.encodePacked(_result))) % 2;
      uint toTransfer;
      playerIDs[_queryID].Result=randomNumber;

      emit generatedRandomNumber(randomNumber);

      if(playerIDs[_queryID].Result == playerIDs[_queryID].coinSelection){
        toTransfer = playerIDs[_queryID].betInput*2;
        playerIDs[_queryID].playerAddress.transfer(toTransfer);
        emit result (playerIDs[_queryID].playerAddress, true, toTransfer);
      }

      else {
        emit result(playerIDs[_queryID].playerAddress, false, 0);
      }
      }

/*
    function testRandom() public returns(bytes32){
      bytes32 queryID = bytes32(keccak256(abi.encodePacked(msg.sender)));
      _callback(queryID, "1", bytes("test"));
      return queryID;
    }*/


    function addBalance() public payable onlyOwner {
      require(msg.value>0);
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
