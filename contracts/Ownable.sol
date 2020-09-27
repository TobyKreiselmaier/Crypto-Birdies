pragma solidity 0.5.12;

contract Ownable{
   
    address payable internal owner;
      
    modifier onlyOwner(){
      require(msg.sender == owner, "You need to be owner of the contract in order to access this functionality!");
      _;
    }
    
    constructor() public{ 
      owner = msg.sender;
    }
}      