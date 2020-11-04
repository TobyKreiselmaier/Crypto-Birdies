pragma solidity ^0.5.12;

import "./CryptoBirdies.sol";

contract TestBirdies is CryptoBirdies {

    constructor(string memory name, string memory symbol) CryptoBirdies(name, symbol) public{}

    function testCreateBird(uint256 genes, address owner) public returns (uint256) {
        return _createBird(0, 0, 0, genes, owner);
    }

    function testCreateGenXBird(uint256 generation, uint256 genes, address owner) public returns (uint256) {
        return _createBird(0, 0, generation, genes, owner);
    }

    function testMixDna(
    uint256 _dadDna, 
    uint256 _mumDna,
    uint8 random,
    uint8 randomSeventeenthDigit,
    uint8 randomPair,
    uint8 randomNumberForRandomPair
    ) public pure returns (uint256){
        return _mixDna(
            _dadDna, 
            _mumDna, 
            random, 
            randomSeventeenthDigit, 
            randomPair, 
            randomNumberForRandomPair);
    }
}