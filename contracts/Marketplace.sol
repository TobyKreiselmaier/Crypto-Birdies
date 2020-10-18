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
        uint256 allOffers = offers.length;

        if (allOffers == 0) {
            return new uint256[](0);//retuns empty array
        } else {
            uint256[] memory allTokensOnSale = new uint256[](allOffers);//initialize new array of exact length of number of offers
            uint256 offerId;
            for (offerId = 0; offerId < allOffers; offerId++) {
                if (offers[offerId].active == true) {
                    allTokensOnSale[offerId] = offers[offerId].tokenId;                    
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

        Offer memory _offer = Offer({//set offer
            seller: msg.sender,
            price: _price,
            index: offers.length,
            tokenId: _tokenId,
            active: true
        });

        tokenIdToOffer[_tokenId] = _offer;//update mapping
        offers.push(_offer);//update array

        emit MarketTransaction("Offer created", msg.sender, _tokenId);
    }

    function removeOffer(uint256 _tokenId) public {
        require(tokenIdToOffer[_tokenId].seller == msg.sender, "Only the owner of the bird can withdraw the offer from the market place.");

        delete tokenIdToOffer[_tokenId];//delete entry in mapping
        offers[tokenIdToOffer[_tokenId].index].active == false;//don't iterate through array, but simply set active to false.

        emit MarketTransaction("Offer removed", msg.sender, _tokenId);
    }

    function buyKitty(uint256 _tokenId) public payable {
        require(tokenIdToOffer[_tokenId].active, "There is currently no active offer for this bird");
        require(msg.value == tokenIdToOffer[_tokenId].price, "The amount offered is not equal to the amount requested");

        delete tokenIdToOffer[_tokenId];//delete entry in mapping
        offers[tokenIdToOffer[_tokenId].index].active == false;//don't iterate through array, but simply set active to false.

        if (tokenIdToOffer[_tokenId].price > 0) {//project: change push into pull logic
            tokenIdToOffer[_tokenId].seller.transfer(tokenIdToOffer[_tokenId].price);//send money to seller
        }

        _angryBirds.transferFrom(tokenIdToOffer[_tokenId].seller, msg.sender, _tokenId);//ERC721 ownership transferred

        emit MarketTransaction("Bird successfully purchased", msg.sender, _tokenId);
    }
}