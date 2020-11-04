const Birdcontract = artifacts.require("CryptoBirdies");
const Marketcontract = artifacts.require("MarketPlace");
const TestBirdies = artifacts.require("TestBirdies");
const TestMarket = artifacts.require("TestMarket");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);
var testBirdiesInstance;
var testMarketInstance;

contract("CryptoBirdies", (accounts) => {

  async function createParents() {
    await testBirdiesInstance.testCreateBird(101, accounts[0]);
    await testBirdiesInstance.testCreateBird(202, accounts[0]);
  }

  it("should deploy correctly", async () => {
    await truffleAssert.passes(Birdcontract.deployed("CryptoBird", "CBX"));
  });

  beforeEach(async () => {
    testBirdiesInstance = await TestBirdies.new("CryptoBird", "CBX");
    testMarketInstance = await TestMarket.new(testBirdiesInstance.address);
  });

  describe("constructor()", () =>{
    it("should create and emit a correct birth event for bird0", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      var birdZero = await truffleAssert.createTransactionResult(
        testBirdiesInstance, testBirdiesInstance.transactionHash);
      truffleAssert.eventEmitted(birdZero, 'Birth', (ev) => {
        return ev.owner == zeroAddress && ev.birdId == 0 && ev.mumId == 0 && ev.dadId == 0 && 
        ev.genes == 115792089237316195423570985008687907853269984665640564039457584007913129639935;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getContractOwner()", () =>{
    it("should get the owner of the smart contract", async () => {
      var owner = await testBirdiesInstance.getContractOwner();
      assert.equal(owner, accounts[0], "The owner was not returned correctly");
    });
  });

  describe("breed()", () =>{
    
    it("should pass, if both parents are owned by msg.sender", async () => {
      await createParents();
      await truffleAssert.passes(testBirdiesInstance.breed(1, 2));
    });

    it("should revert, if only the dad is owned by msg.sender", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[1]);
      await truffleAssert.reverts(testBirdiesInstance.breed(1, 2));
    });

    it("should revert, if only the mum is owned by msg.sender", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[1]);
      await truffleAssert.reverts(testBirdiesInstance.breed(2, 1));
    });

    it("should set the mum and dad IDs for the new bird correctly", async () => {
      await createParents();
      await testBirdiesInstance.breed(1, 2); // Bird3 = Baby
      var baby = await testBirdiesInstance.getBird(3);
      assert.equal(baby.dadId, 1, "IDs were not set correctly");
      assert.equal(baby.mumId, 2, "IDs were not set correctly");
    });

    it("should return the child's generation correctly, if the dad's generation is less than mum's"
    , async () => {
      await testBirdiesInstance.testCreateGenXBird(5, 101, accounts[0]);//Bird1
      await testBirdiesInstance.testCreateGenXBird(7, 202, accounts[0]);//Bird2
      await testBirdiesInstance.breed(1, 2); //Bird3 - Bird1=dad, Bird2=mum
      var baby = await testBirdiesInstance.getBird(3);
      assert.equal(baby.generation, 6, "The generation was not set correctly")
    });

    it("should return the child's generation correctly, if the mum's generation is less than dad's"
    , async () => {
      await testBirdiesInstance.testCreateGenXBird(5, 101, accounts[0]);//Bird1
      await testBirdiesInstance.testCreateGenXBird(7, 202, accounts[0]);//Bird2
      await testBirdiesInstance.breed(2, 1); //Bird3 - Bird1=mum, Bird2=dad
      var baby = await testBirdiesInstance.getBird(3);
      assert.equal(baby.generation, 6, "The generation was not set correctly")
    });

    it("should return the child's generation correctly, if the parents have the same generation"
    , async () => {
      await testBirdiesInstance.testCreateGenXBird(4, 101, accounts[0]);//Bird1
      await testBirdiesInstance.testCreateGenXBird(4, 202, accounts[0]);//Bird2
      await testBirdiesInstance.breed(1, 2); //Bird3 - Bird1=dad, Bird2=mum
      var baby = await testBirdiesInstance.getBird(3);
      assert.equal(baby.generation, 5, "The generation was not set correctly")
    });

    it("should emit a birth event with correct parameters", async () => {
      await createParents();
      var birdy = await testBirdiesInstance.breed(1, 2);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 3 && ev.mumId == 2 && ev.dadId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("supportsInterface()", () =>{
    it("should check, if the contract supports IERC721", async () => {
      var testIERC721 = await testBirdiesInstance.supportsInterface("0x80ac58cd");
      assert.equal(testIERC721, true, "The contract does not support IERC721");
    });

    it("should check, if the contract supports IERC165", async () => {
      var testIERC721 = await testBirdiesInstance.supportsInterface("0x01ffc9a7");
      assert.equal(testIERC721, true, "The contract does not support IERC721");
    });
  });

  describe("createBirdGen0()", () =>{
    it("should allow only the owner of the contract to create a bird", async () => {
      await truffleAssert.reverts(testBirdiesInstance.createBirdGen0(101, { from: accounts[1] }));
    });

    it("should set the contract owner as owner of the new bird", async () => {
      await testBirdiesInstance.createBirdGen0(101);
      var owner = await testBirdiesInstance.ownerOf(1);
      var contractOwner = await testBirdiesInstance.getContractOwner();
      assert.equal(owner, contractOwner, "The contract owner is not owner of this Gen0 bird");
    });

    it("should have generation 0", async () => {
      await testBirdiesInstance.createBirdGen0(101);
      var result = await testBirdiesInstance.getBird(1);
      assert.equal(result.generation, 0, "The generation is incorrect");
    });

    it("should have the same DNA that is used when the function is called", async () => {
      await testBirdiesInstance.createBirdGen0(101);
      var result = await testBirdiesInstance.getBird(1);
      assert.equal(result.genes, 101, "The genes are incorrect");
    });

    it("should add one to the Gen0 counter", async () => {
      await testBirdiesInstance.createBirdGen0(101);
      var result = await testBirdiesInstance.gen0Counter();
      assert.equal(result, 1, "The counter is incorrect");
    });

    it("should only allow a maximum of 10 Gen0 birds to be created", async () => {
      await testBirdiesInstance.createBirdGen0(101);
      await testBirdiesInstance.createBirdGen0(102);
      await testBirdiesInstance.createBirdGen0(103);
      await testBirdiesInstance.createBirdGen0(104);
      await testBirdiesInstance.createBirdGen0(105);
      await testBirdiesInstance.createBirdGen0(106);
      await testBirdiesInstance.createBirdGen0(107);
      await testBirdiesInstance.createBirdGen0(108);
      await testBirdiesInstance.createBirdGen0(108);
      await testBirdiesInstance.createBirdGen0(110);
      await truffleAssert.reverts(testBirdiesInstance.createBirdGen0(111));
    });

    it("should call _createBird() and _transfer() and emit a birth event with correct parameters", async () => {
      var birdy = await testBirdiesInstance.createBirdGen0(101);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 1 && ev.mumId == 0 && ev.dadId == 0 && ev.genes == 101;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getBird()", () =>{
    it("should return the correct genes of a bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var result = await testBirdiesInstance.getBird(1);
      assert.equal(result.genes, 101, "The genes are incorrect");
    });

    it("should return the correct birthTime of a bird", async () => {
      var startTime = Date.now();
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var endTime = Date.now();
      var result = await testBirdiesInstance.getBird(1);
      assert(startTime/1000 <= result.birthTime <= endTime/1000, "The birthTime is incorrect");
    });

    it("should return the correct mumId of a bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var result = await testBirdiesInstance.getBird(1);
      assert.equal(result.mumId, 0, "The id for the mum is incorrect");
    });

    it("should return the correct dadId of a bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var result = await testBirdiesInstance.getBird(1);
      assert.equal(result.dadId, 0, "The id for the dad is incorrect");
    });

    it("should return the correct generation of a bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var result = await testBirdiesInstance.getBird(1);
      assert.equal(result.generation, 0, "The generation is not zero");
    });

    it("should revert, if the bird does not exist", async () => {
      await truffleAssert.reverts(testBirdiesInstance.getBird(5));
    });
  });

  describe("getAllBirdsOfOwner()", () =>{
    it("should return all birds owned by an address", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[1]);
      var testAllBirdsOfOwner = await testBirdiesInstance.getAllBirdsOfOwner(accounts[1]);
      assert.equal(testAllBirdsOfOwner[0], 2, "Something went wrong");
    });
  });

  describe("balanceOf()", () =>{
    it("should return the correct balance of tokens owned by an address", async () => {
      var numberTokens = await testBirdiesInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      numberTokens = await testBirdiesInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    });
  });

  describe("totalSupply()", () =>{
  it("should record the total supply of tokens", async () => {
    await testBirdiesInstance.testCreateBird(101, accounts[0]);
  var supply = await testBirdiesInstance.totalSupply();
    assert.equal(supply, 2, "The record of total supply is flawed and can't be trusted");
  });
});

  describe("name()", () =>{
    it("should return the name of the native token 'CryptoBird'", async () => {
      var testName = await testBirdiesInstance.name();
      assert.equal(testName, "CryptoBird", "Token wasn't constructed correctly");
    });
  });

  describe("symbol()", () =>{
    it("should return the ticker symbol 'CBX'", async () => {
      var testSymbol = await testBirdiesInstance.symbol();
      assert.equal(testSymbol, "CBX", "Symbol wasn't constructed correctly");
    });
  });

  describe("ownerOf()", () =>{
    it("should return the correct owner of the token", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var testOwner = await testBirdiesInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "The owner of the token is incorrect");
    });

    it("should revert, if the ID does not exist", async () => {
      await truffleAssert.reverts(testBirdiesInstance.ownerOf(5));
    });
  });

  describe("transfer()", () =>{
    it("should not allow transfer to the burn address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var testOwner = await testBirdiesInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(testBirdiesInstance.transfer(zeroAddress, 0));
    });
  
    it("should not allow transfer to the contract address", async () => {
      const contractAddress = await testBirdiesInstance.address;
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var testOwner = await testBirdiesInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(testBirdiesInstance.transfer(contractAddress, 0));
    });
  
    it("should emit a transfer event when a transfer was successful", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var testTransfer = await testBirdiesInstance.transfer(accounts[1], 1);
      truffleAssert.eventEmitted(testTransfer, 'Transfer', (ev) => {
      return ev.from == accounts[0] && ev.to == accounts[1] && ev.tokenId == 1;
      }, "Transfer event should have been emitted with correct parameters");
    });
  
    it("should revert if msg.sender does not own the bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testBirdiesInstance.transfer(accounts[1], 1, { from: accounts[2] }));
    });
  
    it("should check balances and transfer a token from one account to another", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      var numberTokensSender = await testBirdiesInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 1, "Token balance is incorrect");
      var numberTokensRecipient = await testBirdiesInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 0, "Token balance is incorrect");

      await testBirdiesInstance.transfer(accounts[1], 1);

      numberTokensSender = await testBirdiesInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 0, "Token balance is incorrect");
      numberTokensRecipient = await testBirdiesInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 1, "Token balance is incorrect");
    });
  });

  describe("approve()", () =>{
    it("should set operator approval for one bird and emit the correct event", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      var approval = await testBirdiesInstance.approve(marketAddress, 1);
      truffleAssert.eventEmitted(approval, 'Approval', (ev) => {
        return ev.owner == accounts[0] && ev.approved == marketAddress && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should revert, if msg.sender is not the owner", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      await truffleAssert.reverts(testBirdiesInstance.approve(marketAddress, 1, { from: accounts[2] }));
    });
  });

  describe("setApprovalForAll()", () =>{
    it("should set operator approval for all birds of an owner and emit the correct event", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      var approvalForAll = await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should remove operator approval for all birds of an owner and emit the correct event", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      var approvalForAll = await testBirdiesInstance.setApprovalForAll(marketAddress, false);
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == false;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should allow more than one operator approval for all birds of an owner and emit the correct events",
     async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      var approvalForMarketContract = await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      truffleAssert.eventEmitted(approvalForMarketContract, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
      var approvalForAddress = await testBirdiesInstance.setApprovalForAll(accounts[1], true);
      truffleAssert.eventEmitted(approvalForAddress, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == accounts[1] && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getApproved()", () =>{
    it("should return the approved operator for a bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.approve(marketAddress, 1);
      var approvedOperator = await testBirdiesInstance.getApproved(1);
      assert.equal(approvedOperator, marketAddress, "The operator was NOT returned correctly");
    });
  });

  describe("isApprovedForAll()", () =>{
    it("should return approved status for an operator", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      var hasApprovalForAll = await testBirdiesInstance.isApprovedForAll(accounts[0], marketAddress);
      assert.equal(hasApprovalForAll, true, "The status was NOT returned correctly");
    });
  });

  describe("safeTransferFrom()", () =>{
    it("should pass, if msg.sender is owner", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[0]}));
    });

    it("should pass, if msg.sender has approval for this token", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.approve(accounts[2], 1);
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should pass, if msg.sender has operator approval for this owner", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.setApprovalForAll(accounts[2], true);
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should revert, if msg.sender is not owner or operator for a token", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[2]}));
    });

    it("should revert, if msg.sender is has no approval for this token", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.approve(accounts[1], 1);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[2]}));
    });

    it("should revert, if msg.sender has no operator rights for this owner", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.setApprovalForAll(accounts[2], true);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[1]}));
    });

    it("should revert, if from address is not the owner of the bird", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[2], accounts[1], 1, {from: accounts[0]}));
    });

    it("should not allow a transfer to the zero address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], zeroAddress, 1));
    });

    it("should not allow a transfer of a token that doesn't exist", async () => {
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1));
    });

    it("should revert, if the receiving contract does not support ERC721", async () => {
      testMarketInstance = await TestMarket.new(testBirdiesInstance.address);
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], testMarketInstance.address, 1));
    });

    it("should execute, if the receiving contract supports ERC721", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], testBirdiesInstance.address, 1));
    });
  });

  describe("_mixDna()", () =>{
    it("should create a deterministic DNA string", async () => {
      var newDna = await testBirdiesInstance.testMixDna(
        "11223344556677889", "98877665544332211", "100", "0", "0", "63");
      assert.equal(newDna, "63223365546632211", "DNA string was created incorrectly");
    });
  });
})

contract("MarketPlace", (accounts) => {

  async function createBirdAndSetApproval(){
    await testBirdiesInstance.testCreateBird(101, accounts[0]);
    var marketAddress = await testMarketInstance.address;
    await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[0] });
  }

  it("should deploy correctly", async () => {
    testBirdiesInstance = await TestBirdies.new("CryptoBird", "CBX");
    await truffleAssert.passes(Marketcontract.deployed(testBirdiesInstance.address));
  });

  beforeEach(async () => {
    testBirdiesInstance = await TestBirdies.new("CryptoBird", "CBX");
    testMarketInstance = await TestMarket.new(testBirdiesInstance.address);
  });

  describe("setContract()", () =>{
    it("should set the Birdcontract by address", async () => {
      await truffleAssert.passes(testMarketInstance.setContract(testBirdiesInstance.address));
    });

    it("should revert, if not called by owner", async () => {
      await truffleAssert.reverts(testMarketInstance.setContract(
        testBirdiesInstance.address, { from: accounts[1] }));
    });
  });

  describe("getOffer()", () =>{
    it("should revert, if there is no active offer", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await truffleAssert.reverts(testMarketInstance.getOffer(1));
    });

    it("should return seller, price, index, tokenId, and status of an offer correcly",
     async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      var offer = await testMarketInstance.getOffer(1);
      assert.equal(offer.seller, accounts[0], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.equal(offer.active, true, "Offer status is wrong");
    });
  });

  describe("getAllTokensOnSale()", () =>{
    it("should return an array with the correct length and ids of offers", 
    async () => {
      await testBirdiesInstance.testCreateBird(706, accounts[0]); //Bird 1
      await testBirdiesInstance.testCreateBird(707, accounts[0]); //Bird 2
      await testBirdiesInstance.testCreateBird(101, accounts[1]); //Bird 3
      await testBirdiesInstance.testCreateBird(202, accounts[2]); //Bird 4
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[0] });
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[2] });
      await testMarketInstance.setOffer(10, 1);//10 ETH for Bird 1
      await testMarketInstance.setOffer(100, 2);//100 ETH for Bird 1
      await testMarketInstance.setOffer(1, 3, { from: accounts[1] });//1 ETH for Bird3
      await testMarketInstance.setOffer(2, 4, { from: accounts[2] });//2 ETH for Bird4
      await testMarketInstance.removeOffer(1);
      var arrayOffers = await testMarketInstance.getAllTokensOnSale();
      assert.equal(arrayOffers.length, 3, "The offer array does NOT have the correct length");
      assert.equal(arrayOffers[0], 2, "Bird2 offer status is wrong");
      assert.equal(arrayOffers[1], 3, "Bird3 offer status is wrong");
      assert.equal(arrayOffers[2], 4, "Bird4 offer status is wrong");
    });
  });

  describe("setOffer()", () =>{
    it("should set an offer with a price and tokenId correctly and emit the correct event", 
     async () => {
      await createBirdAndSetApproval();
      var offer = await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await truffleAssert.eventEmitted(offer, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
      var offer = await testMarketInstance.getOffer(1);
      assert.equal(offer.seller, accounts[0], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.equal(offer.active, true, "Offer status is wrong");
    });

    it("should only allow the owner to set an offer", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      await truffleAssert.reverts(testMarketInstance.setOffer(1, 1, { from: accounts[1] }));
    });

    it("should not allow to set a new offer when another already exists", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await truffleAssert.reverts(testMarketInstance.setOffer(5, 1));//5 ETH for Bird1
    });

    it("should not allow to set an offer, if the Marketcontract is not an approved operator",
     async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, false);
      await truffleAssert.reverts(testMarketInstance.setOffer(5, 1));//5 ETH for Bird1
    });

    it("should emit a transaction event with correct parameters", async () => {
      await createBirdAndSetApproval();
      var offer = await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      truffleAssert.eventEmitted(offer, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("removeOffer()", () =>{
    it("should only allow the owner to remove an offer", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await truffleAssert.reverts(testMarketInstance.removeOffer(1, { from: accounts[1] }));
    });

    it("should set status in the offers array to false", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.removeOffer(1, { from: accounts[0] });
      assert.fail(await testMarketInstance.getOfferFromArray(1));
    });

    it("should delete the entry in the offer mapping", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.removeOffer(1, { from: accounts[0] });
      var offer = await testMarketInstance.getOfferFromMapping(1);
      assert.notStrictEqual(offer.seller, accounts[0], "Something went wrong");
      assert.notStrictEqual(offer.price, 1, "Something went wrong");
      assert.notStrictEqual(offer.index, 0, "Something went wrong");
      assert.notStrictEqual(offer.tokenId, 1, "Something went wrong");
      assert.notStrictEqual(offer.active, true, "Something went wrong");
    });

    it("should emit a MarketTransaction with correct parameters", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      var removal = await testMarketInstance.removeOffer(1, { from: accounts[0] });
      truffleAssert.eventEmitted(removal, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer removed" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("buyBird()", () =>{
    it("should only work, if there is an active offer", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await truffleAssert.reverts(testMarketInstance.buyBird(1, { from: accounts[2], value: 1 }));
    });

    it("should only work, if the value offered is equal to the asking price of the offer", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await truffleAssert.reverts(testMarketInstance.buyBird(1, { from: accounts[1], value: 2 }));
    });

    it("should transfer ownership correctly", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });
      var owner = await testBirdiesInstance.ownerOf(1);
      assert.equal(owner, accounts[1], "Ownership was not updated correctly");
    });

    it("should transfer funds correctly", async () => {
      var seller = accounts[0];
      var buyer = accounts[1];
      await testBirdiesInstance.testCreateBird(101, seller);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      var price = web3.utils.toBN(1);
      var inWei = web3.utils.toWei(price, "ether");
      await testMarketInstance.setOffer(inWei, 1);//1 ETH for Bird1
      var sellerStart = parseInt(await web3.eth.getBalance(seller));
      var buyerStart = parseInt(await web3.eth.getBalance(buyer));
      await testMarketInstance.buyBird(1, { from: buyer, value: inWei });
      var sellerEnd = parseInt(await web3.eth.getBalance(seller));
      var buyerEnd = parseInt(await web3.eth.getBalance(buyer));
      weiInt = parseInt(inWei);
      assert.equal(sellerStart + weiInt, sellerEnd, 
        "Funds were not correctly added to the seller account");
      assert.isAtMost(buyerEnd, buyerStart - weiInt, 
        "Funds were not correctly subtracted from the buyer account");
      assert.isAtLeast(buyerEnd, buyerStart - 2 * weiInt, 
        "Funds were not correctly subtracted from the buyer account");
    });

    it("should set the status in the offers array to false", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });
      assert.fail(await testMarketInstance.getOfferFromArray(1));
    });

    it("should delete the entry in the offer mapping", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });
      var offer = await testMarketInstance.getOfferFromMapping(1);
      assert.notStrictEqual(offer.seller, accounts[0], "Something went wrong");
      assert.notStrictEqual(offer.price, 1, "Something went wrong");
      assert.notStrictEqual(offer.index, 0, "Something went wrong");
      assert.notStrictEqual(offer.tokenId, 1, "Something went wrong");
      assert.notStrictEqual(offer.active, true, "Something went wrong");
    });

    it("should emit a MarketTransaction event with correct parameters", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      var purchase = await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });
      truffleAssert.eventEmitted(purchase, 'MarketTransaction', (ev) => {
        return ev.TxType == "Bird successfully purchased" && ev.owner == accounts[1] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });
})