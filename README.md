# Crypto Birdies

This project is a clone of the famous Crypto Kitties.
It demonstrates use of the following technologies:

* HTML5
* CSS3
* JavaScript
* Bootstrap
* jQuery
* Solidity
* web3.js
* Truffle
* Ganache
* Mocha.js
* Chai.js
* MetaMask

UI Functionality:

* creation of bird with a 17-digit DNA sequence
* 7 exciting animations for the birds
* millions of color combinations for each bird
* breeding of baby birds
* buying and selling of birds for test ETH
* catalog to display all birds of the user
* market place displaying all active offers of birds both of the current user and other users

Technical Functionality:

* Creation and management of ERC721 tokens
* Payments with ERC20 tokens (testnet)
* Compliance with IERC721 and IERC165 (Open Zeppelin)
* 95 unit tests for the smart contract code utilizing three additional test contracts
* Implementation of pause functionality to allow for maintenance by the contract owner
* Full SafeMath implementation for full protection against Over- and Underflow
* Checks / Effects / Interactions logic to prevent re-entrency attacks
* No external library calls to prevent Parity Freeze szenario
* Independent Market Contract handling the trading of the NFT tokens
* Truffle migrations
-------------------------------------------------------------------------------------------------
* Live demonstration: https://cryptobirdies.netlify.app
* Birdcontract: https://ropsten.etherscan.io/address/0x70e2324ccf7a76e201dff26d4749ed1bb821c305
* Marketcontract: https://ropsten.etherscan.io/address/0x78ad2f9c3924278692125a23ed05d4e5facfd97c
