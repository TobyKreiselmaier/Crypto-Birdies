# Crypto Birdies

This is a clone of the famous Crypto Kitties.
Birds can be collected, traded and bred on the Ropsten Testnet.

A live version is available here: https://cryptobirdies.netlify.app

This project demonstrates:

* Frontend design using HTML/CSS/JavaScript
* Smart Contract design using Solidity
* Interaction between the two with web3.js
* Compliance with ERC721 and ERC165 standards for non-fungible tokens
* Unit Testing for the solidity code using Node.js, Chai.js, Mocha.js, and Truffle-Assertions
* The use of safety measures such as:
    - SafeMath to prevent Over- and Underflow in solidity
    - Checks / Effects / Interactions for external transactions
    - Pause function so the admin can pause essential functions such as buyBird() and withdrawFunds()
