import "./AngryBirds.sol";

pragma solidity ^0.5.12;

contract Test is AngryBirds {

    constructor(string memory name, string memory symbol) AngryBirds(name, symbol) public{}

     function createTestBird(uint256 genes, address owner) public returns (uint256) {
        return _createBird(0, 0, 0, genes, owner);
    }
}