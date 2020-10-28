const Birdcontract = artifacts.require("CryptoBirdies");
const Testcontract = artifacts.require("Test");
const Marketcontract = artifacts.require("MarketPlace");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");
var testInstance;
var marketInstance;
var birdInstance;

contract("Testcontract", (accounts) => {
  
  beforeEach(async () => {testInstance = await Testcontract.new("CryptoBird", "CBX")});

  describe("getAllBirdsOfOwner()", () =>{
    it("should return all birds owned by an address", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      await testInstance.createTestBird(202, accounts[1]);
      var testAllBirdsOfOwner = await testInstance.getAllBirdsOfOwner(accounts[1]);
      assert.equal(testAllBirdsOfOwner[1], 2, "Something went wrong");
    });
  });
})

contract("Marketcontract", (accounts) => {

  beforeEach(async () => {
    testInstance = await Testcontract.new("CryptoBird", "CBX");
    marketInstance = await Marketcontract.new(testInstance.address);
  });

  describe("setOffer() and getOffer()", () =>{
    it("should set and return seller, price, index, tokenId, and status of an offer", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      var offer = await marketInstance.getOffer(1);
      assert.equal(offer.seller, accounts[1], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.equal(offer.active, true, "Offer status is wrong");
    });
  });

  describe("removeOffer()", () =>{
    it("should remove an offer and emit a correct MarketTransaction", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      var removal = await marketInstance.removeOffer(1, { from: accounts[1] });
      truffleAssert.eventEmitted(removal, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer removed" && ev.owner == accounts[1] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
      });
  });

  describe("getAllTokensOnSale()", () =>{
    it("should return an array with the correct length and ids of offers", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      await testInstance.createTestBird(202, accounts[2]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[2] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.setOffer(2, 2, { from: accounts[2] });//2 ETH for Bird2
      var arrayOffers = await marketInstance.getAllTokensOnSale();
      assert.equal(arrayOffers.length, 2, "The offer array does NOT have the correct length");
      assert.equal(arrayOffers[0], 1, "Bird1 offer status is wrong");
      assert.equal(arrayOffers[1], 2, "Bird2 offer status is wrong");
    });
  });

  describe("buyBird()", () =>{
    it("transfer a bird, remove the offer status, and emit a correct event", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      var purchase = await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      truffleAssert.eventEmitted(purchase, 'MarketTransaction', (ev) => {
        return ev.TxType == "Bird successfully purchased" && ev.owner == accounts[2] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });
})

contract("Birdcontract", (accounts) => {

  beforeEach(async () => {birdInstance = await Birdcontract.new("CryptoBird", "CBX")});

  describe("name()", () =>{
    it("should return the name of the native token 'CryptoBird'", async () => {
      var testName = await birdInstance.name();
      assert.equal(testName, "CryptoBird", "Token wasn't constructed correctly");
    });
  });

  describe("symbol()", () =>{
    it("should return the ticker symbol 'CBX'", async () => {
      var testSymbol = await birdInstance.symbol();
      assert.equal(testSymbol, "CBX", "Symbol wasn't constructed correctly");
    });
  });

  describe("balanceOf()", () =>{
    it("should return the correct balance of tokens owned by an address", async () => {
      var numberTokens = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
      await birdInstance.createBirdGen0(101);
      numberTokens = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    });
  });

  describe("getBird()", () =>{
    it("should return the correct genes of a token", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.genes, 101, "The genes are incorrect");
    });

    it("should return the correct birthTime of a token", async () => {
      var startTime = Date.now();
      await birdInstance.createBirdGen0(101);
      var endTime = Date.now();
      var result = await birdInstance.getBird(1);
      assert(startTime/1000 <= result.birthTime <= endTime/1000, "The birthTime is incorrect");
    });

    it("should return the correct mumId of a token", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.mumId, 0, "The id for the mum is incorrect");
    });

    it("should return the correct dadId of a token", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.dadId, 0, "The id for the dad is incorrect");
    });

    it("should return the correct generation of a token", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.generation, 0, "The generation is not zero");
    });

    it("should revert, if the bird does not exist", async () => {
      await truffleAssert.reverts(birdInstance.getBird(5));
    });
  });

  describe("ownerOf()", () =>{
    it("should return the correct owner of the token", async () => {
      await birdInstance.createBirdGen0(101);
      var testOwner = await birdInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "The owner of the token is incorrect");
    });

    it("should revert, if the ID does not exist", async () => {
      await truffleAssert.reverts(birdInstance.ownerOf(5));
    });
  });

  describe("totalSupply()", () =>{
    it("should record the total supply of tokens", async () => {
      await birdInstance.createBirdGen0(101);
      var supply = await birdInstance.totalSupply();
      assert.equal(supply, 2, "The record of total supply is flawed and can't be trusted");
    });
  });

  describe("breed()", () =>{
    it("should emit a birth event with correct parameters", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var birdy = await birdInstance.breed(2, 1);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 3 && ev.mumId == 1 && ev.dadId == 2;
        }, "Event was NOT emitted with correct parameters");
        //child genes can not be tested bc they are random
    });
  });

  describe("approve()", () =>{
    it("should set operator approval for one bird and emit the correct event", async () => {
      await birdInstance.createBirdGen0(101);
      var marketAddress = await marketInstance.address;
      var approval = await birdInstance.approve(marketAddress, 1);
      truffleAssert.eventEmitted(approval, 'Approval', (ev) => {
        return ev.owner == accounts[0] && ev.approved == marketAddress && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
        //genes can not be tested as they are randomized
    });
  });

  describe("setApprovalForAll()", () =>{
    it("should set operator approval for all birds of an owner and emit the correct event", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var marketAddress = await marketInstance.address;
      var approvalForAll = await birdInstance.setApprovalForAll(marketAddress, true);
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getApproved()", () =>{
    it("should return the approved operator for a bird", async () => {
      await birdInstance.createBirdGen0(101);
      var marketAddress = await marketInstance.address;
      await birdInstance.approve(marketAddress, 1);
      var approvedOperator = await birdInstance.getApproved(1);
      assert.equal(approvedOperator, marketAddress, "The operator was NOT returned correctly");
    });
  });

  describe("isApprovedForAll()", () =>{
    it("should return approved status for an operator", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var marketAddress = await marketInstance.address;
      await birdInstance.setApprovalForAll(marketAddress, true);
      var hasApprovalForAll = await birdInstance.isApprovedForAll(accounts[0], marketAddress);
      assert.equal(hasApprovalForAll, true, "The status was NOT returned correctly");
    });
  });

  describe("transfer()", () =>{
    it("should not allow transfer to the burn address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await birdInstance.createBirdGen0(101);
      var testOwner = await birdInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(birdInstance.transfer(zeroAddress, 0));
    });
  
    it("should not allow transfer to the contract address", async () => {
      const contractAddress = await birdInstance.address;
      await birdInstance.createBirdGen0(101);
      var testOwner = await birdInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(birdInstance.transfer(contractAddress, 0));
    });
  
    it("should emit a transfer event when a transfer was successful", async () => {
      await birdInstance.createBirdGen0(101);
      var testTransfer = await birdInstance.transfer(accounts[1], 1);
      truffleAssert.eventEmitted(testTransfer, 'Transfer', (ev) => {
      return ev.from == accounts[0] && ev.to == accounts[1] && ev.tokenId == 1;
      }, "Transfer event should have been emitted with correct parameters");
    });
  
    it("should check balances and transfer a token from one account to another", async () => {
      await birdInstance.createBirdGen0(101);

      var numberTokensSender = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 1, "Token balance is incorrect");
      var numberTokensRecipient = await birdInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 0, "Token balance is incorrect");

      await birdInstance.transfer(accounts[1], 1);

      numberTokensSender = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 0, "Token balance is incorrect");
      numberTokensRecipient = await birdInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 1, "Token balance is incorrect");
    });
  });
})