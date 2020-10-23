pragma solidity ^0.5.12;

import "./AngryBirds.sol";
import "./Ownable.sol";
import "./IMarketplace.sol";
import "./SafeMath.sol";

/*
 * Market place to trade birds (should **in theory** be used for any ERC721 token)
 * It needs an existing bird contract to interact with
 * Note: it does not inherit from the contract
 * Note: It takes ownership of the bird for the duration that is is on the marketplace.
 */

contract MarketPlace is Ownable, IMarketPlace {
    AngryBirds private _angryBirds;

    using SafeMath for uint256;

    struct Offer {
        address payable seller;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }

    Offer[] offers;

    mapping(uint256 => Offer) tokenIdToOffer;

    event MarketTransaction(string TxType, address owner, uint256 tokenId);

    function setContract(address _contractAddress) onlyOwner public {
        _angryBirds = AngryBirds(_contractAddress);
    }

    constructor(address _contractAddress) public {
        setContract(_contractAddress);
    }

    function getOffer(uint256 _tokenId) public view returns (address seller, uint256 price, uint256 index, uint256 tokenId, bool active) {
        require(tokenIdToOffer[_tokenId].active == true, "No active offer at this time");
        return (tokenIdToOffer[_tokenId].seller,
                tokenIdToOffer[_tokenId].price,
                tokenIdToOffer[_tokenId].index,
                tokenIdToOffer[_tokenId].tokenId,
                tokenIdToOffer[_tokenId].active);
    }

    function getAllTokensOnSale() public view returns (uint256[] memory listOfOffers) {
        uint256 resultId = 0;//index for all birds with active offer status (true)
        
        for (uint256 index = 0; index < offers.length; index++) {
            if (offers[index].active == true) {
                resultId = resultId.add(1);//determine length of array to return
            }
        }
        
        if (offers.length == 0) {
            return new uint256[](0);//returns empty array
        } else {
            uint256[] memory allTokensOnSale = new uint256[](resultId);//initialize new array with correct length
            resultId = 0;//reset index of new array
            for (uint256 index = 0; index < offers.length; index++) {//iterate through entire offers array
                if (offers[index].active == true) {
                    allTokensOnSale[resultId] = offers[index].tokenId;
                    resultId = resultId.add(1);
                }
            }
        return allTokensOnSale;
        }
    }

    function _ownsBird(address _address, uint256 _tokenId) internal view returns (bool) {
        return (_angryBirds.ownerOf(_tokenId) == _address);
    }

    function setOffer(uint256 _price, uint256 _tokenId) public {
        require(_ownsBird(msg.sender, _tokenId), "Only the owner of the bird can initialize an offer");
        require(tokenIdToOffer[_tokenId].active == false, "You already created an offer for this bird. Please remove it first before creating a new one.");
        require(_angryBirds.isApprovedForAll(msg.sender, address(this)), "MarketPlace contract must first be an approved operate for your birds");

        Offer memory _currentOffer = Offer({//set offer
            seller: msg.sender,
            price: _price,
            index: offers.length,
            tokenId: _tokenId,
            active: true
        });

        tokenIdToOffer[_tokenId] = _currentOffer;//update mapping
        offers.push(_currentOffer);//update array

        emit MarketTransaction("Offer created", msg.sender, _tokenId);
    }

    function removeOffer(uint256 _tokenId) public {
        require(tokenIdToOffer[_tokenId].seller == msg.sender, "Only the owner of the bird can withdraw the offer.");

        offers[tokenIdToOffer[_tokenId].index].active = false;//don't iterate through array, but simply set active to false.
        delete tokenIdToOffer[_tokenId];//delete entry in mapping

        emit MarketTransaction("Offer removed", msg.sender, _tokenId);
    }

    function buyBird(uint256 _tokenId) public payable {
        Offer memory _currentOffer = tokenIdToOffer[_tokenId];

        require(_currentOffer.active, "There is no active offer for this bird");
        require(msg.value == _currentOffer.price, "The amount offered is not equal to the amount requested");

        delete tokenIdToOffer[_tokenId];//delete entry in mapping
        offers[_currentOffer.index].active = false;//don't iterate through array, but simply set active to false.

        if (_currentOffer.price > 0) {//project: change push into pull logic
            _currentOffer.seller.transfer(_currentOffer.price);//send money to seller
        }

        _angryBirds.transferFrom(_currentOffer.seller, msg.sender, _tokenId);//ERC721 ownership transferred

        emit MarketTransaction("Bird successfully purchased", msg.sender, _tokenId);
    }
}