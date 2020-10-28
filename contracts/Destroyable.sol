pragma solidity ^0.5.12;

import "./Ownable.sol";

contract Destroyable is Ownable{

    function close() public onlyOwner {
        selfdestruct(_owner);
    }
}