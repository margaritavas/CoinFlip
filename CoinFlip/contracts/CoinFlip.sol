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

    event betPlaced(address player, uint bet, bool);

    function addBalance() public payable {
      require(msg.value>0);
    }

    function flipCoin() public payable costs(0.01 ether) returns (bool){
        require(address(this).balance >= msg.value, "The contract does not have enough funds");

        bool success;
        if(now % 2 == 0){
            balance += msg.value;
            success = false;
        }

        else if (now % 2 == 1){
            balance -= msg.value;
            msg.sender.transfer(msg.value*2);
            success = true;
        }

        emit betPlaced(msg.sender, msg.value, success);
                return success;
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
