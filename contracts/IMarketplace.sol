pragma solidity ^0.5.12;

import "./CryptoBirdies.sol";
import "./Ownable.sol";

/*
 * Market place to trade birds (should **in theory** be used for any ERC721 token)
 * It needs an existing bird contract to interact with
 * Note: it does not inherit from the contract
 * Note: It takes ownership of the bird for the duration that is is on the marketplace.
 */
interface IMarketPlace {

    event MarketTransaction(string TxType, address owner, uint256 tokenId);
    event MonetaryTransaction(string message, address recipient, uint256 amount);

    /**
    * Set the current contract address and initialize the instance of the contract.
    * Requirement: Only the contract owner can call.
     */
    function setContract(address _contractAddress) external;

    /**
    * Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
     */
    function getOffer(uint256 _tokenId) external view returns (address seller, uint256 price, uint256 index, uint256 tokenId, bool active);

    /**
    * Get all tokenId's that are currently for sale. Returns an empty array if no offer exists.
     */
    function getAllTokensOnSale() external view returns (uint256[] memory listOfOffers);

    /**
    * Creates a new offer for _tokenId for the price _price.
    * Emits the MarketTransaction event with txType "Create offer"
    * Requirement: Only the owner of _tokenId can create an offer.
    * Requirement: There can only be one active offer for a token at a time.
    * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
     */
    function setOffer(uint256 _price, uint256 _tokenId) external;

    /**
    * Removes an existing offer.
    * Emits the MarketTransaction event with txType "Remove offer"
    * Requirement: Only the seller of _tokenId can remove an offer.
     */
    function removeOffer(uint256 _tokenId) external;

    /**
    * Executes the purchase of _tokenId.
    * Transfers the token using transferFrom in CryptoBirdies.
    * Transfers funds to the _fundsToBeCollected mapping.
    * Removes the offer from the mapping.
    * Sets the offer in the array to inactive.
    * Emits the MarketTransaction event with txType "Buy".
    * Requirement: The msg.value needs to equal the price of _tokenId
    * Requirement: There must be an active offer for _tokenId
     */
    function buyBird(uint256 _tokenId) external payable;

    /**
    * Send funds to msg.sender.
    * Emits a MonetaryTransaction event "Successful Transfer".
    * Requirement: msg.sender must have funds in the mapping.
     */
    function withdrawFunds() external payable;
}