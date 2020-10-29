pragma solidity ^0.5.12;

import "./CryptoBirdies.sol";

contract Test is CryptoBirdies {

    constructor(string memory name, string memory symbol) CryptoBirdies(name, symbol) public{}

    function createTestBird(uint256 genes, address owner) public returns (uint256) {
        return _createBird(0, 0, 0, genes, owner);
    }
}