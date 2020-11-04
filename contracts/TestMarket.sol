pragma solidity ^0.5.12;

import "./Marketplace.sol";

contract TestMarket is MarketPlace {

    constructor(address _contractAddress) MarketPlace(_contractAddress) public{}

    function getOfferFromMapping(uint256 token) public returns (
    address seller, 
    uint256 price, 
    uint256 index, 
    uint256 tokenId, 
    bool active) {
    
    return (tokenIdToOffer[token].seller,
            tokenIdToOffer[token].price,
            tokenIdToOffer[token].index,
            tokenIdToOffer[token].tokenId,
            tokenIdToOffer[token].active);
    }

    function getOfferFromArray(uint256 id) public returns(
        address seller,
        uint256 price,
        uint256 index,
        uint256 tokenId,
        bool active) {
            
        return (offers[id].seller,
                offers[id].price,
                offers[id].index,
                offers[id].tokenId,
                offers[id].active);
    }
}