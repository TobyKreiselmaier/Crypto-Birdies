pragma solidity ^0.5.12;

import "./CryptoBirdies.sol";

contract Test is CryptoBirdies {

    constructor(string memory name, string memory symbol) CryptoBirdies(name, symbol) public{}

    function testCreateBird(uint256 genes, address owner) public returns (uint256) {
        return _createBird(0, 0, 0, genes, owner);
    }

    function _testMixDna(
        uint256 _dadDna, 
        uint256 _mumDna, 
        uint8 _random, 
        uint8 _randomSeventeenthDigit, 
        uint8 _randomPair, 
        uint8 _randomNumberForRandomPair) 
        public pure returns (uint256){
    
    uint256[9] memory geneArray;
    uint256 i;
    uint256 counter = 7;

    if(_randomSeventeenthDigit == 0){
        geneArray[8] = uint8(_mumDna % 10);
    } else {
        geneArray[8] = uint8(_dadDna % 10);
    }

    _mumDna = _mumDna / 10;
    _dadDna = _dadDna / 10;

    for (i = 1; i <= 128; i=i*2) {
        if(_random & i == 0){
            geneArray[counter] = uint8(_mumDna % 100);
        } else {
            geneArray[counter] = uint8(_dadDna % 100);
        }
        _mumDna = _mumDna / 100;
        _dadDna = _dadDna / 100;
        counter = counter - 1;
    }

    geneArray[_randomPair] = _randomNumberForRandomPair;

    uint256 newGene = 0;

    for (i = 0; i < 8; i++) {
        newGene = newGene * 100;
        newGene = newGene + geneArray[i];
    }
    newGene = newGene * 10;
    newGene = newGene + geneArray[8];
    return newGene;
    }
}