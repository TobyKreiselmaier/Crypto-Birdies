const Birdcontract = artifacts.require("CryptoBirdies");
const Testcontract = artifacts.require("Test");
const Marketcontract = artifacts.require("MarketPlace");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);
var testInstance;
var marketInstance;
var testInstance;

contract("Testcontract", (accounts) => {
  
  beforeEach(async () => {
    testInstance = await Testcontract.new("CryptoBird", "CBX");
  });

  describe("getAllBirdsOfOwner()", () =>{
    it("should return all birds owned by an address", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[1]);
      var testAllBirdsOfOwner = await testInstance.getAllBirdsOfOwner(accounts[1]);
      assert.equal(testAllBirdsOfOwner[0], 2, "Something went wrong");
    });
  });

  describe("_mixDna()", () =>{
    it("should create a new 17-digit DNA string", async () => {
      var newDna = await testInstance._testMixDna("11223344556677889", "98877665544332211", "100", "0", "0", "63");
      assert.equal(newDna.toString().length, 17, "DNA string length is wrong");
      });

    it("should create a deterministic DNA string", async () => {
      var newDna = await testInstance._testMixDna("11223344556677889", "98877665544332211", "100", "0", "0", "63");
      assert.equal(newDna, "63223365546632211", "DNA string was created incorrectly");
    });
  });
})

contract("Marketcontract", (accounts) => {

  beforeEach(async () => {
    testInstance = await Testcontract.new("CryptoBird", "CBX");
    marketInstance = await Marketcontract.new(testInstance.address);
  });

  describe("setContract()", () =>{
    it("should set the Birdcontract by address", async () => {
      await truffleAssert.passes(marketInstance.setContract(testInstance.address));
    });

    it("should revert, if not called by owner", async () => {
      await truffleAssert.reverts(marketInstance.setContract(testInstance.address, { from: accounts[1] }));
    });
  });

  describe("getOffer()", () =>{
    it("should revert, if there is no active offer", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await truffleAssert.reverts(marketInstance.getOffer(1));
    });

    it("should return seller, price, index, tokenId, and status of an offer correcly", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      var offer = await marketInstance.getOffer(1);
      assert.equal(offer.seller, accounts[1], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.equal(offer.active, true, "Offer status is wrong");
    });
  });

  describe("getAllTokensOnSale()", () =>{
    it("should return an array with the correct length and ids of offers", async () => {
      await testInstance.testCreateBird(706, accounts[0]); //Bird 1
      await testInstance.testCreateBird(707, accounts[0]); //Bird 2
      await testInstance.testCreateBird(101, accounts[1]); //Bird 3
      await testInstance.testCreateBird(202, accounts[2]); //Bird 4
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[0] });
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[2] });
      await marketInstance.setOffer(10, 1);//10 ETH for Bird 1
      await marketInstance.setOffer(100, 2);//100 ETH for Bird 1
      await marketInstance.setOffer(1, 3, { from: accounts[1] });//1 ETH for Bird3
      await marketInstance.setOffer(2, 4, { from: accounts[2] });//2 ETH for Bird4
      await marketInstance.removeOffer(1);
      var arrayOffers = await marketInstance.getAllTokensOnSale();
      assert.equal(arrayOffers.length, 3, "The offer array does NOT have the correct length");
      assert.equal(arrayOffers[0], 2, "Bird2 offer status is wrong");
      assert.equal(arrayOffers[1], 3, "Bird3 offer status is wrong");
      assert.equal(arrayOffers[2], 4, "Bird4 offer status is wrong");
    });
  });

  describe("setOffer()", () =>{
    it("should set an offer with a price and tokenId correctly and emit the correct event", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      var offer = await marketInstance.setOffer(7, 1);//7 ETH for Bird1
      await truffleAssert.eventEmitted(offer, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
      var offer = await marketInstance.getOffer(1);
      assert.equal(offer.seller, accounts[0], "Seller is wrong");
      assert.equal(offer.price, 7, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.equal(offer.active, true, "Offer status is wrong");
    });

    it("should only allow the owner to set an offer", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      await truffleAssert.reverts(marketInstance.setOffer(1, 1, { from: accounts[1] }));//1 ETH for Bird1
    });

    it("should not allow to set a new offer when another already exists", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      await marketInstance.setOffer(1, 1);//1 ETH for Bird1
      await truffleAssert.reverts(marketInstance.setOffer(5, 1));//5 ETH for Bird1
    });

    it("should not allow to set an offer, if the Marketcontract is not an approved operator", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, false);
      await truffleAssert.reverts(marketInstance.setOffer(5, 1));//5 ETH for Bird1
    });

    it("should emit a transaction event with correct parameters", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      var creation = await marketInstance.setOffer(5, 1);
      truffleAssert.eventEmitted(creation, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("removeOffer()", () =>{
    it("should only allow the owner to remove an offer", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      await truffleAssert.reverts(marketInstance.removeOffer(1, { from: accounts[0] }));
    });

    it("should set status in the offers array to false", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      await marketInstance.removeOffer(1, { from: accounts[1] });
      var status = await marketInstance.getAllTokensOnSale();
      assert.equal(status.length, 0, "The offers array was not updated correctly");
    });

    it("should delete the entry in the tokenIdToOffer mapping", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      await marketInstance.removeOffer(1, { from: accounts[1] });
      await truffleAssert.reverts(marketInstance.getOffer(1));
    });

    it("should emit a MarketTransaction with correct parameters", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      var removal = await marketInstance.removeOffer(1, { from: accounts[1] });
      truffleAssert.eventEmitted(removal, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer removed" && ev.owner == accounts[1] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("buyBird()", () =>{
    it("should only work, if there is an active offer", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await truffleAssert.reverts(marketInstance.buyBird(1, { from: accounts[2], value: 1 }));
    });

    it("should only work, if the value offered is equal to the asking price of the offer", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(2, 1, { from: accounts[1] });//2 ETH for Bird1
      await truffleAssert.reverts(marketInstance.buyBird(1, { from: accounts[2], value: 1 }));
    });

    it("should transfer ownership correctly", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[0] });
      await marketInstance.setOffer(1, 1, { from: accounts[0] });//1 ETH for Bird1
      await marketInstance.buyBird(1, { from: accounts[1], value: 1 });
      var owner = await testInstance.ownerOf(1);
      assert.equal(owner, accounts[1], "Ownership was not updated correctly");
    });

    it("should transfer funds correctly", async () => {
      var BN = web3.utils.BN;
      var seller = accounts[0];
      var buyer = accounts[1];
      await testInstance.testCreateBird(101, seller);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      var price = web3.utils.toBN(1);
      var inWei = web3.utils.toWei(price, "ether");
      await marketInstance.setOffer(inWei, 1);//1 ETH for Bird1
      var weiBalanceSellerBefore = await web3.eth.getBalance(seller);
      var weiBalanceBuyerBefore = await web3.eth.getBalance(buyer);
      await marketInstance.buyBird(1, { from: buyer, value: inWei });
      var weiBalanceSellerAfter = await web3.eth.getBalance(seller);
      var weiBalanceBuyerAfter = await web3.eth.getBalance(buyer);
      assert.equal(parseInt(weiBalanceSellerBefore) + parseInt(inWei), parseInt(weiBalanceSellerAfter), 
        "Funds were not correctly added to the seller account");
      assert.isAtMost(parseInt(weiBalanceBuyerAfter), parseInt(weiBalanceBuyerBefore) - parseInt(inWei), 
        "Funds were not correctly subtracted from the buyer account");
      assert.isAtLeast(parseInt(weiBalanceBuyerAfter), parseInt(weiBalanceBuyerBefore) - (2 * parseInt(inWei)), 
        "Funds were not correctly subtracted from the buyer account");
    });

    it("should set the status in the offers array to false", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      var status = await marketInstance.getAllTokensOnSale();
      assert.equal(status.length, 0, "The offers array was not updated correctly");
    });

    it("should delete the entry in the tokenIdToOffer mapping", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      await truffleAssert.reverts(marketInstance.getOffer(1));
    });

    it("should emit a MarketTransaction event with correct parameters", async () => {
      await testInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for Bird1
      var purchase = await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      truffleAssert.eventEmitted(purchase, 'MarketTransaction', (ev) => {
        return ev.TxType == "Bird successfully purchased" && ev.owner == accounts[2] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });
})

contract("Birdcontract", (accounts) => {

  async function createParents() {
    await testInstance.testCreateBird(101, accounts[0]);
    await testInstance.testCreateBird(202, accounts[0]);
  }

  it("should deploy correctly", async () => {
    await truffleAssert.passes(Birdcontract.deployed("CryptoBird", "CBX"));
  });

  beforeEach(async () => {
    testInstance = await Testcontract.new("CryptoBird", "CBX");
    marketInstance = await Marketcontract.new(testInstance.address);
  });

  describe("initialization", () =>{
    it("should create and emit a correct birth event for bird0", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      var birdZero = await truffleAssert.createTransactionResult(testInstance, testInstance.transactionHash);
      truffleAssert.eventEmitted(birdZero, 'Birth', (ev) => {
        return ev.owner == zeroAddress && ev.birdId == 0 && ev.mumId == 0 && ev.dadId == 0 && 
        ev.genes == 115792089237316195423570985008687907853269984665640564039457584007913129639935;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getContractOwner()", () =>{
    it("should the owner of the smart contract", async () => {
      var owner = await testInstance.getContractOwner();
      assert.equal(owner, accounts[0], "The owner was not returned correctly");
    });
  });

  describe("breed()", () =>{
    
    it("should pass, if both parents are owned by msg.sender", async () => {
      await createParents();
      await truffleAssert.passes(testInstance.breed(1, 2));
    });

    it("should revert, if only the dad is owned by msg.sender", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[1]);
      await truffleAssert.reverts(testInstance.breed(1, 2));
    });

    it("should revert, if only the mum is owned by msg.sender", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[1]);
      await truffleAssert.reverts(testInstance.breed(2, 1));
    });

    it("should set the mum and dad IDs for the new bird correctly", async () => {
      await createParents();
      await testInstance.breed(1, 2); // Bird3 = Baby
      var baby = await testInstance.getBird(3);
      assert.equal(baby.dadId, 1, "IDs were not set correctly");
      assert.equal(baby.mumId, 2, "IDs were not set correctly");
    });

    it("should return the child's generation to be one more than dad's, if he has a lower generation than mum"
    , async () => {
      await createParents();
      await testInstance.breed(1, 2); //Bird3
      await testInstance.breed(1, 3); //Bird4 child of 1 & 3
      var baby = await testInstance.getBird(4);
      assert.equal(baby.generation, 1, "The generation was not set correctly")
    });

    it("should return the child's generation to be one more than mum's, if she has a lower generation than dad"
    , async () => {
      await createParents();
      await testInstance.breed(1, 2); //Bird3
      await testInstance.breed(3, 1); //Bird4 child of 3 & 1
      var baby = await testInstance.getBird(4);
      assert.equal(baby.generation, 1, "The generation was not set correctly")
    });

    it("should return the child's generation to be one more than the parents', if they have the same generation"
    , async () => {
      await createParents();
      await testInstance.breed(1, 2); //Bird3
      var baby = await testInstance.getBird(3);
      assert.equal(baby.generation, 1, "The generation was not set correctly")
    });


    it("should emit a birth event with correct parameters", async () => {
      await createParents();
      var birdy = await testInstance.breed(1, 2);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 3 && ev.mumId == 2 && ev.dadId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("supportsInterface()", () =>{
    it("should check, if the contract supports IERC721", async () => {
      var testIERC721 = await testInstance.supportsInterface("0x80ac58cd");
      assert.equal(testIERC721, true, "The contract does not support IERC721");
    });

    it("should check, if the contract supports IERC165", async () => {
      var testIERC721 = await testInstance.supportsInterface("0x01ffc9a7");
      assert.equal(testIERC721, true, "The contract does not support IERC721");
    });
  });

  describe("createBirdGen0()", () =>{
    it("should only allow the owner of the contract to create a bird", async () => {
      await truffleAssert.reverts(testInstance.createBirdGen0(101, { from: accounts[1] }));
    });

    it("should set the contract owner as owner of the new bird", async () => {
      await testInstance.createBirdGen0(101);
      var owner = await testInstance.ownerOf(1);
      var contractOwner = await testInstance.getContractOwner();
      assert.equal(owner, contractOwner, "The contract owner is not owner of this Gen0 bird");
    });

    it("should have generation 0", async () => {
      await testInstance.createBirdGen0(101);
      var result = await testInstance.getBird(1);
      assert.equal(result.generation, 0, "The generation is incorrect");
    });

    it("should have the DNA that is used when function is called", async () => {
      await testInstance.createBirdGen0(101);
      var result = await testInstance.getBird(1);
      assert.equal(result.genes, 101, "The genes are incorrect");
    });

    it("should add one to the Gen0 counter", async () => {
      await testInstance.createBirdGen0(101);
      var result = await testInstance.gen0Counter();
      assert.equal(result, 1, "The counter is incorrect");
    });

    it("should only allow a maximum of 10 Gen0 birds to be created", async () => {
      await testInstance.createBirdGen0(101);
      await testInstance.createBirdGen0(102);
      await testInstance.createBirdGen0(103);
      await testInstance.createBirdGen0(104);
      await testInstance.createBirdGen0(105);
      await testInstance.createBirdGen0(106);
      await testInstance.createBirdGen0(107);
      await testInstance.createBirdGen0(108);
      await testInstance.createBirdGen0(108);
      await testInstance.createBirdGen0(110);
      await truffleAssert.reverts(testInstance.createBirdGen0(111));
    });

    it("should call _createBird() and _transfer() and emit a birth event with correct parameters", async () => {
      var birdy = await testInstance.createBirdGen0(101);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 1 && ev.mumId == 0 && ev.dadId == 0 && ev.genes == 101;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getBird()", () =>{
    it("should return the correct genes of a bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var result = await testInstance.getBird(1);
      assert.equal(result.genes, 101, "The genes are incorrect");
    });

    it("should return the correct birthTime of a bird", async () => {
      var startTime = Date.now();
      await testInstance.testCreateBird(101, accounts[0]);
      var endTime = Date.now();
      var result = await testInstance.getBird(1);
      assert(startTime/1000 <= result.birthTime <= endTime/1000, "The birthTime is incorrect");
    });

    it("should return the correct mumId of a bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var result = await testInstance.getBird(1);
      assert.equal(result.mumId, 0, "The id for the mum is incorrect");
    });

    it("should return the correct dadId of a bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var result = await testInstance.getBird(1);
      assert.equal(result.dadId, 0, "The id for the dad is incorrect");
    });

    it("should return the correct generation of a bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var result = await testInstance.getBird(1);
      assert.equal(result.generation, 0, "The generation is not zero");
    });

    it("should revert, if the bird does not exist", async () => {
      await truffleAssert.reverts(testInstance.getBird(5));
    });
  });

  describe("balanceOf()", () =>{
    it("should return the correct balance of tokens owned by an address", async () => {
      var numberTokens = await testInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
      await testInstance.testCreateBird(101, accounts[0]);
      numberTokens = await testInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    });
  });

  describe("totalSupply()", () =>{
  it("should record the total supply of tokens", async () => {
    await testInstance.testCreateBird(101, accounts[0]);
  var supply = await testInstance.totalSupply();
    assert.equal(supply, 2, "The record of total supply is flawed and can't be trusted");
  });
});

  describe("name()", () =>{
    it("should return the name of the native token 'CryptoBird'", async () => {
      var testName = await testInstance.name();
      assert.equal(testName, "CryptoBird", "Token wasn't constructed correctly");
    });
  });

  describe("symbol()", () =>{
    it("should return the ticker symbol 'CBX'", async () => {
      var testSymbol = await testInstance.symbol();
      assert.equal(testSymbol, "CBX", "Symbol wasn't constructed correctly");
    });
  });

  describe("ownerOf()", () =>{
    it("should return the correct owner of the token", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var testOwner = await testInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "The owner of the token is incorrect");
    });

    it("should revert, if the ID does not exist", async () => {
      await truffleAssert.reverts(testInstance.ownerOf(5));
    });
  });

  describe("transfer()", () =>{
    it("should not allow transfer to the burn address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await testInstance.testCreateBird(101, accounts[0]);
      var testOwner = await testInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(testInstance.transfer(zeroAddress, 0));
    });
  
    it("should not allow transfer to the contract address", async () => {
      const contractAddress = await testInstance.address;
      await testInstance.testCreateBird(101, accounts[0]);
      var testOwner = await testInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(testInstance.transfer(contractAddress, 0));
    });
  
    it("should emit a transfer event when a transfer was successful", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var testTransfer = await testInstance.transfer(accounts[1], 1);
      truffleAssert.eventEmitted(testTransfer, 'Transfer', (ev) => {
      return ev.from == accounts[0] && ev.to == accounts[1] && ev.tokenId == 1;
      }, "Transfer event should have been emitted with correct parameters");
    });
  
    it("should revert if msg.sender does not own the bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testInstance.transfer(accounts[1], 1, { from: accounts[2] }));
    });
  
    it("should check balances and transfer a token from one account to another", async () => {
      await testInstance.testCreateBird(101, accounts[0]);

      var numberTokensSender = await testInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 1, "Token balance is incorrect");
      var numberTokensRecipient = await testInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 0, "Token balance is incorrect");

      await testInstance.transfer(accounts[1], 1);

      numberTokensSender = await testInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 0, "Token balance is incorrect");
      numberTokensRecipient = await testInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 1, "Token balance is incorrect");
    });
  });

  describe("approve()", () =>{
    it("should set operator approval for one bird and emit the correct event", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      var approval = await testInstance.approve(marketAddress, 1);
      truffleAssert.eventEmitted(approval, 'Approval', (ev) => {
        return ev.owner == accounts[0] && ev.approved == marketAddress && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should revert, if msg.sender is not the owner", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await truffleAssert.reverts(testInstance.approve(marketAddress, 1, { from: accounts[2] }));
    });
  });

  describe("setApprovalForAll()", () =>{
    it("should set operator approval for all birds of an owner and emit the correct event", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await marketInstance.address;
      var approvalForAll = await testInstance.setApprovalForAll(marketAddress, true);
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should remove operator approval for all birds of an owner and emit the correct event", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await marketInstance.address;
      var approvalForAll = await testInstance.setApprovalForAll(marketAddress, false);
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == false;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should allow more than one operator approval for all birds of an owner and emit the correct events", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await marketInstance.address;
      var approvalForMarketContract = await testInstance.setApprovalForAll(marketAddress, true);
      truffleAssert.eventEmitted(approvalForMarketContract, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
      var approvalForAddress = await testInstance.setApprovalForAll(accounts[1], true);
      truffleAssert.eventEmitted(approvalForAddress, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == accounts[1] && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getApproved()", () =>{
    it("should return the approved operator for a bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.approve(marketAddress, 1);
      var approvedOperator = await testInstance.getApproved(1);
      assert.equal(approvedOperator, marketAddress, "The operator was NOT returned correctly");
    });
  });

  describe("isApprovedForAll()", () =>{
    it("should return approved status for an operator", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      var hasApprovalForAll = await testInstance.isApprovedForAll(accounts[0], marketAddress);
      assert.equal(hasApprovalForAll, true, "The status was NOT returned correctly");
    });
  });

  describe("safeTransferFrom()", () =>{
    it("should pass, if msg.sender is owner", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.passes(testInstance.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[0]}));
    });

    it("should pass, if msg.sender has approval for this token", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.approve(accounts[2], 1);
      await truffleAssert.passes(testInstance.safeTransferFrom(accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should pass, if msg.sender has operator approval for this owner", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.setApprovalForAll(accounts[2], true);
      await truffleAssert.passes(testInstance.safeTransferFrom(accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should revert, if msg.sender is not owner or operator for a token", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[2]}));
    });

    it("should revert, if msg.sender is has no approval for this token", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.approve(accounts[1], 1);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[2]}));
    });

    it("should revert, if msg.sender has no operator rights for this owner", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await testInstance.setApprovalForAll(accounts[2], true);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], accounts[1], 1, { from: accounts[1]}));
    });

    it("should revert, if from address is not the owner of the bird", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[2], accounts[1], 1, {from: accounts[0]}));
    });

    it("should not allow a transfer to the zero address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], zeroAddress, 1));
    });

    it("should not allow a transfer of a token that doesn't exist", async () => {
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], accounts[1], 1));
    });

    it("should revert, if the receiving contract does not support ERC721", async () => {
      marketInstance = await Marketcontract.new(testInstance.address);
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], marketInstance.address, 1));
    });

    it("should execute, if the receiving contract supports ERC721", async () => {
      await testInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testInstance.safeTransferFrom(accounts[0], testInstance.address, 1));
    });
  });
})