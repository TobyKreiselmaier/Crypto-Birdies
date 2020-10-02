import "./Birdcontract.sol";

pragma solidity 0.5.12;

contract Testcontract is Birdcontract {

    constructor(string memory name, string memory symbol) Birdcontract(name, symbol) public{}

    function createTestBird(uint256 genes, address owner) public returns (uint256) {
        return _createBird(0, 0, 0, genes, owner);
    }
}