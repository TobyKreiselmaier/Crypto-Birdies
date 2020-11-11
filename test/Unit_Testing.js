const Birdcontract = artifacts.require("CryptoBirdies");
const Marketcontract = artifacts.require("MarketPlace");
const TestBirdies = artifacts.require("TestBirdies");
const TestMarket = artifacts.require("TestMarket");
const TestErc = artifacts.require("TestErc");
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

      assert.strictEqual(owner, accounts[0], "The owner was not returned correctly");
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
      
      //the testfunction enables to use deterministic generations
      //checking the baby for generation makes little sense
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

      assert.strictEqual(testIERC721, true, "The contract does not support IERC721");
    });

    it("should check, if the contract supports IERC165", async () => {
      var testIERC165 = await testBirdiesInstance.supportsInterface("0x01ffc9a7");

      assert.strictEqual(testIERC165, true, "The contract does not support IERC721");
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

      assert.strictEqual(owner, contractOwner, "The contract owner is not owner of this Gen0 bird");
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

    it.only("should only allow a maximum of 10 Gen0 birds to be created", async () => {
      await testBirdiesInstance.testSetGenCounter(10);

      //this should not work for an eleventh Gen0 bird.
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

      //it is not possible to test the exact birthtime, but this test
      //makes sure the birthTime is within a narrow time window
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

      assert.equal(testAllBirdsOfOwner.length, 1, "The number of birds was not returned correctly");
    });
  });

  describe("balanceOf()", () =>{
    it("should return the correct balance of tokens owned by an address", async () => {
      var numberTokens = await testBirdiesInstance.balanceOf(accounts[0]);

      //initally the balance should be 0
      assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");

      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //after the creation of the test bird, the balance should be 1
      numberTokens = await testBirdiesInstance.balanceOf(accounts[0]);

      assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    });
  });

  describe("totalSupply()", () =>{
  it("should record the total supply of tokens", async () => {
    await testBirdiesInstance.testCreateBird(101, accounts[0]);
    
    //the total supply should be Bird0 and the test bird created here.
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

      assert.strictEqual(testOwner, accounts[0], "The owner of the token is incorrect");
    });

    it("should revert, if the ID does not exist", async () => {
      await truffleAssert.reverts(testBirdiesInstance.ownerOf(5));
    });
  });

  describe("transfer()", () =>{
    it("should not allow transfer to the burn address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      await truffleAssert.reverts(testBirdiesInstance.transfer(zeroAddress, 0));
    });
  
    it("should not allow transfer to the contract address", async () => {
      const contractAddress = await testBirdiesInstance.address;
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

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

      //sender initially has one bird
      var numberTokensSender = await testBirdiesInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 1, "Token balance is incorrect");

      //recipient initially has no bird
      var numberTokensRecipient = await testBirdiesInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 0, "Token balance is incorrect");

      await testBirdiesInstance.transfer(accounts[1], 1);

      //sender has no more birds
      numberTokensSender = await testBirdiesInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 0, "Token balance is incorrect");

      //recipient now has one bird
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
      
      //create two birds
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      
      //give market contract operator approval for both of them
      var approvalForAll = await testBirdiesInstance.setApprovalForAll(marketAddress, true);

      //ensure correct event is emitted
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should remove operator approval for all birds of an owner and emit the correct event", async () => {
      
      //create two birds
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      
      //give market contract operator approval for both of them
      var approvalForAll = await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      
      //remove market contract operator approval for both of them
      var approvalForAll = await testBirdiesInstance.setApprovalForAll(marketAddress, false);
      
      //check for the correct event
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == false;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should allow more than one operator approval for all birds of an owner and emit the correct events",
     async () => {

      //create two test birds
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;

      //give market contract operator approval
      var approvalForMarketContract = await testBirdiesInstance.setApprovalForAll(marketAddress, true);

      //check for correct event
      truffleAssert.eventEmitted(approvalForMarketContract, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");

      //additionally give accounts[1] the same approval
      var approvalForAddress = await testBirdiesInstance.setApprovalForAll(accounts[1], true);

      //this should work and emit the correct event
      truffleAssert.eventEmitted(approvalForAddress, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == accounts[1] && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getApproved()", () =>{
    it("should return the approved operator for a bird", async () => {
      
      //create test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;

      //give market contract operator approval for this one bird
      await testBirdiesInstance.approve(marketAddress, 1);

      //return address of operator for bird 1
      var approvedOperator = await testBirdiesInstance.getApproved(1);

      //the approved operator should be the market contract
      assert.strictEqual(approvedOperator, marketAddress, "The operator was NOT returned correctly");
    });
  });

  describe("isApprovedForAll()", () =>{
    it("should return approved status for an operator", async () => {

      //create two test birds
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      var marketAddress = await testMarketInstance.address;

      //set operator approval for the market contract for all birds
      await testBirdiesInstance.setApprovalForAll(marketAddress, true);

      //query for who has operator approval for all of accounts[0]'s birds
      var hasApprovalForAll = await testBirdiesInstance.isApprovedForAll(accounts[0], marketAddress);
      assert.strictEqual(hasApprovalForAll, true, "The status was NOT returned correctly");
    });
  });

  describe("safeTransferFrom()", () =>{
    it("should pass, if msg.sender is owner", async () => {
      
      //create one test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //the owner of the bird intiates the safe transfer successfully
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[0]}));
    });

    it("should pass, if msg.sender has approval for this token", async () => {

      //create test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //set individual operator approval for this one bird for accounts[2]
      await testBirdiesInstance.approve(accounts[2], 1);

      //the operator should now be able to execute the safe transfer
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should pass, if msg.sender has operator approval for this owner", async () => {
      
      //create two test birds
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      await testBirdiesInstance.testCreateBird(202, accounts[0]);
      
      //give accounts[2] general operator approval for all birds
      await testBirdiesInstance.setApprovalForAll(accounts[2], true);

      //the operator should be able to transfer that bird
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should revert, if msg.sender is not owner or operator for a token", async () => {
      
      //create one test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //let an address call the safe transfer function that is not owner, nor operator
      //this operations must fail
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[2]}));
    });

    it("should revert, if msg.sender is has no approval for this token", async () => {

      //create one test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //make accounts[1] operator for this bird
      await testBirdiesInstance.approve(accounts[1], 1);

      //the transfer is expected to fail initiated by someone else
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], accounts[1], 1, { from: accounts[2]}));
    });

    it("should revert, if msg.sender has no operator rights for this owner", async () => {

      //create one test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //make accounts[2] general operator accounts[0]
      await testBirdiesInstance.setApprovalForAll(accounts[2], true);
      
      //the transfer is expected to fail initiated by someone else
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
      
      //this test contract does not support the ERC721 standard
      testMarketInstance = await TestMarket.new(testBirdiesInstance.address);

      //create one test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //trying to safe transfer that bird to a contract without ERC721 support must fail
      await truffleAssert.reverts(testBirdiesInstance.safeTransferFrom(
        accounts[0], testMarketInstance.address, 1));
    });

    it("should execute, if the receiving contract supports ERC721", async () => {

      //create instance of ERC721 compliant test contract
      testErcInstance = await TestErc.new();

      //create test bird
      await testBirdiesInstance.testCreateBird(101, accounts[0]);

      //safe transfer to the ERC721 test contract should work
      await truffleAssert.passes(testBirdiesInstance.safeTransferFrom(
        accounts[0], testErcInstance.address, 1));
    });
  });

  describe("_mixDna()", () =>{
    it("should create a deterministic DNA string", async () => {

      //the function should create a DNA string that is exactly defined by
      //four random parameters.
      var newDna = await testBirdiesInstance.testMixDna(
        "11223344556677889", "98877665544332211", "100", "0", "0", "63");

      //using the four parameters the new DNA can be predicted as 63223365546632211
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

  describe("pause()", () =>{
    it("should execute for the contract owner", async () => {
      await truffleAssert.passes(testMarketInstance.pause( { from: accounts[0] }));
    });

    it("should not execute for other users", async () => {
      await truffleAssert.reverts(testMarketInstance.pause( { from: accounts[1] }));
    });

    it("should prevent the execution of buyBird()", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      await testMarketInstance.pause( { from: accounts[0] });

      //it should not be possible to buy this bird after pause() is called
      await truffleAssert.reverts(testMarketInstance.buyBird(1, { from: accounts[1], value: 1 }));
    });

    it("should prevent the execution of withdrawFunds()", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      await testMarketInstance.pause( { from: accounts[0] });

      //it should not be possible to withdraw that 1 ETH after pause() is called
      await truffleAssert.reverts(testMarketInstance.withdrawFunds({ from: accounts[0] }));
    });

    it("should still allow the execution of getAllTokensOnSale()", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      await testMarketInstance.pause( { from: accounts[0] });
      await truffleAssert.passes(testMarketInstance.getAllTokensOnSale());
    });

    it("should still allow the execution of getBalance()", async () => {
      await testMarketInstance.testSetBalance(5);
      await testMarketInstance.pause( { from: accounts[0] });
      await truffleAssert.passes(testMarketInstance.getBalance());
    });
  });

  describe("resume()", () =>{
    it("should execute for the contract owner", async () => {
      
      //first pause the contract through test function
      await testMarketInstance.testSetPause( { from: accounts[0] });

      //owner should be able to resume
      await truffleAssert.passes(testMarketInstance.resume( { from: accounts[0] }));
    });

    it("should not execute for other users", async () => {
      
      //first pause the contract through test function
      await testMarketInstance.testSetPause( { from: accounts[0] });

      //another user shouldn't be able to resume contract execution
      await truffleAssert.reverts(testMarketInstance.resume( { from: accounts[1] }));
    });

    it("should resume the execution of buyBird()", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      // pause the contract through test function
      await testMarketInstance.testSetPause( { from: accounts[0] });

      //resume execution
      await testMarketInstance.resume( { from: accounts[0] });

      //buying the bird should work fine and emit the correct event
      var purchase = await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });
      truffleAssert.eventEmitted(purchase, 'MarketTransaction', (ev) => {
        return ev.TxType == "Bird successfully purchased" && ev.owner == accounts[1] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");

    });

    it("should resume the execution of withdrawFunds()", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //first pause the contract through test function
      await testMarketInstance.testSetPause( { from: accounts[0] });

      //it should not be possible to buy the bird at this point
      await truffleAssert.reverts(testMarketInstance.buyBird(1, { from: accounts[1], value: 1 }));

      //resume execution
      await testMarketInstance.resume( { from: accounts[0] });

      //purchase of the bird should now execute
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      //seller should be able to withdraw funds
      var fundsReceived = await testMarketInstance.withdrawFunds({ from: accounts[0] });
      truffleAssert.eventEmitted(fundsReceived, 'MonetaryTransaction', (ev) => {
        return ev.message == "Funds successfully received" && ev.recipient == accounts[0] && ev.amount == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getOffer()", () =>{
    it("should revert, if there is no active offer", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[1]);
      
      //give market contract operator approval for all birds of accounts[1]
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });

      //as no offer was set, this assert statement is expected to revert
      await truffleAssert.reverts(testMarketInstance.getOffer(1));
    });

    it("should return seller, price, index, tokenId, and status of an offer correctly",
     async () => {
      await createBirdAndSetApproval();
      
      //set offer of 1 ETH for bird 1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      var offer = await testMarketInstance.getOffer(1);
      
      //check offer parameters
      assert.strictEqual(offer.seller, accounts[0], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.strictEqual(offer.active, true, "Offer status is wrong");
    });
  });

  describe("getAllTokensOnSale()", () =>{
    it("should return an array with the correct length and ids of offers", 
    async () => {

      //create 4 test birds for 3 different owners
      await testBirdiesInstance.testCreateBird(706, accounts[0]); //Bird 1
      await testBirdiesInstance.testCreateBird(707, accounts[0]); //Bird 2
      await testBirdiesInstance.testCreateBird(101, accounts[1]); //Bird 3
      await testBirdiesInstance.testCreateBird(202, accounts[2]); //Bird 4
      var marketAddress = await testMarketInstance.address;

      //all 3 owners give the market contract operator rights
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[0] });
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[2] });

      //create an offer for each of the 4 birds
      await testMarketInstance.setOffer(10, 1);//10 ETH for Bird 1
      await testMarketInstance.setOffer(100, 2);//100 ETH for Bird 1
      await testMarketInstance.setOffer(1, 3, { from: accounts[1] });//1 ETH for Bird3
      await testMarketInstance.setOffer(2, 4, { from: accounts[2] });//2 ETH for Bird4

      //remove offer for Bird 1
      await testMarketInstance.removeOffer(1);

      //call for the array with the offers
      var arrayOffers = await testMarketInstance.getAllTokensOnSale();

      //make sure the array contains 3 offers
      assert.equal(arrayOffers.length, 3, "The offer array does NOT have the correct length");

      //make sure each of the 3 offers is assigned to the correct bird
      //[0] is Bird2; [1] is Bird 3; [2] is Bird4
      assert.equal(arrayOffers[0], 2, "Bird2 offer status is wrong");
      assert.equal(arrayOffers[1], 3, "Bird3 offer status is wrong");
      assert.equal(arrayOffers[2], 4, "Bird4 offer status is wrong");
    });
  });

  describe("setOffer()", () =>{
    it("should set an offer with a price and tokenId correctly and emit the correct event", 
     async () => {
      await createBirdAndSetApproval();
      
      //set offer for 1ETH for Bird1
      var offer = await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      
      //check for correct event parameters
      await truffleAssert.eventEmitted(offer, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
      
      //return offer
      var offer = await testMarketInstance.getOffer(1);
      
      //make sure all details of the offer are correct
      assert.strictEqual(offer.seller, accounts[0], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.strictEqual(offer.active, true, "Offer status is wrong");
    });

    it("should only allow the owner to set an offer", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      
      //give market contract operator approval
      await testBirdiesInstance.setApprovalForAll(marketAddress, true);
      
      //accounts[1] should not be able to set an offer
      await truffleAssert.reverts(testMarketInstance.setOffer(1, 1, { from: accounts[1] }));
    });

    it("should not allow to set a new offer when another already exists", async () => {
      await createBirdAndSetApproval();
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      
      //the second attempt to set an offer for Bird 1 should fail
      await truffleAssert.reverts(testMarketInstance.setOffer(5, 1));//5 ETH for Bird1
    });

    it("should not allow to set an offer, if the Marketcontract is not an approved operator",
     async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[0]);
      var marketAddress = await testMarketInstance.address;
      
      //make sure the market contract is NOT an approved operator
      await testBirdiesInstance.setApprovalForAll(marketAddress, false);
      
      //setting the offer should now fail
      await truffleAssert.reverts(testMarketInstance.setOffer(5, 1));//5 ETH for Bird1
    });

    it("should emit a transaction event with correct parameters", async () => {
      await createBirdAndSetApproval();
      
      //set offer for 1ETH for Bird1
      var offer = await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //a correctly created event should be emitted
      truffleAssert.eventEmitted(offer, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("removeOffer()", () =>{
    it("should only allow the owner to remove an offer", async () => {
      await createBirdAndSetApproval();
      
      //owner sets offer
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //someone else trying to remove the offer should fail
      await truffleAssert.reverts(testMarketInstance.removeOffer(1, { from: accounts[1] }));
    });

    it("should set status in the offers array to false", async () => {
      await createBirdAndSetApproval();
      
      //create an offer of 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });
      
      //this should set the status within the offers array to false
      await testMarketInstance.removeOffer(1, { from: accounts[0] });
      
      //get all 5 parameters from the offers array
      var offer = await testMarketInstance.getOfferFromArray(0);
      
      //owner, price, index, and tokenID are still in the array, but status must be false
      assert.strictEqual(offer.seller, accounts[0], "The offer was not removed correctly");
      assert.equal(offer.price, 1, "The offer was not removed correctly");
      assert.equal(offer.index, 0, "The offer was not removed correctly");
      assert.equal(offer.tokenId, 1, "The offer was not removed correctly");
      assert.strictEqual(offer.active, false, "The offer was not removed correctly");
    });

    it("should delete the entry in the offer mapping", async () => {
      await createBirdAndSetApproval();

      //create an offer of 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //delete the entry in the mapping
      await testMarketInstance.removeOffer(1, { from: accounts[0] });

      //trying to get the offer from the mapping
      var offer = await testMarketInstance.getOfferFromMapping(1);

      //none of the 5 parameters should reflect the original offer
      assert.notStrictEqual(offer.seller, accounts[0], "The offer was not removed correctly");
      assert.notEqual(offer.price, 1, "The offer was not removed correctly");
      assert.equal(offer.index, 0, "The offer was not removed correctly");
      assert.notEqual(offer.tokenId, 1, "The offer was not removed correctly");
      assert.notStrictEqual(offer.active, true, "The offer was not removed correctly");
    });

    it("should emit a MarketTransaction with correct parameters", async () => {
      await createBirdAndSetApproval();

      //create an offer of 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //offer removed
      var removal = await testMarketInstance.removeOffer(1, { from: accounts[0] });

      //check for removal event
      truffleAssert.eventEmitted(removal, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer removed" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("buyBird()", () =>{
    it("should only work, if there is an active offer", async () => {
      await testBirdiesInstance.testCreateBird(101, accounts[1]);
      var marketAddress = await testMarketInstance.address;

      //after the Bird1 is created, the market contract receives operator rights
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });

      //since no offer was created, the purchase of the bird must fail
      await truffleAssert.reverts(testMarketInstance.buyBird(1, { from: accounts[2], value: 1 }));
    });

    it("should only work, if the value offered is equal to the asking price", async () => {
      await createBirdAndSetApproval();
      
      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //Trying to buy the bird for 2ETH must fail
      await truffleAssert.reverts(testMarketInstance.buyBird(1, { from: accounts[1], value: 2 }));
    });

    it("should transfer ownership correctly", async () => {
      await createBirdAndSetApproval();

      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //accounts[1] buys Bird1 from accounts[0]
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      //get owner
      var owner = await testBirdiesInstance.ownerOf(1);

      //make sure the new owner is accounts[1]
      assert.strictEqual(owner, accounts[1], "Ownership was not updated correctly");
    });

    it("should set the status in the offers array to false", async () => {
      await createBirdAndSetApproval();

      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //accounts[1] buys Bird1 for 1ETH from accounts[0]
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      //check array for offer parameters
      var offer = await testMarketInstance.getOfferFromArray(0);

      //make sure seller, price, index, and tokenId are still correct
      //while offer status must now be false
      assert.strictEqual(offer.seller, accounts[0], "The offer was not removed correctly");
      assert.equal(offer.price, 1, "The offer was not removed correctly");
      assert.equal(offer.index, 0, "The offer was not removed correctly");
      assert.equal(offer.tokenId, 1, "The offer was not removed correctly");
      assert.strictEqual(offer.active, false, "The offer was not removed correctly");
    });

    it("should delete the entry in the offer mapping", async () => {
      await createBirdAndSetApproval();

      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //accounts[1] buys Bird1 for 1ETH from accounts[0]
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      //return parameters from mapping
      var offer = await testMarketInstance.getOfferFromMapping(1);

      //all 5 parameters of the mapping are deleted and should not reflect the original offer
      assert.notStrictEqual(offer.seller, accounts[0], "The offer was not removed correctly");
      assert.notStrictEqual(offer.price, 1, "The offer was not removed correctly");
      assert.notStrictEqual(offer.index, 0, "The offer was not removed correctly");
      assert.notStrictEqual(offer.tokenId, 1, "The offer was not removed correctly");
      assert.notStrictEqual(offer.active, true, "The offer was not removed correctly");
    });

    it("should transfer funds to the _fundsToBeCollected mapping", async () => {
      var buyer = accounts[1];
      await createBirdAndSetApproval();
      
      //convert offer of 1ETH to BN
      var price = web3.utils.toBN(1);

      //convert offer to Wei
      var inWei = web3.utils.toWei(price, "ether");

      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(inWei, 1);

      //check buyer's ETH balance before the purchase
      var buyerStart = parseInt(await web3.eth.getBalance(buyer));

      //purchase Bird1 for 1ETH
      await testMarketInstance.buyBird(1, { from: buyer, value: inWei });

      //check buyer's ETH balance after the purchase
      var buyerEnd = parseInt(await web3.eth.getBalance(buyer));

      //check the balance in the funds mapping
      var fundsInMapping = parseInt(await testMarketInstance.getBalanceOfMapping(accounts[0]));
      
      //convert the purchase price back into integer for comparison reasons
      weiInt = parseInt(inWei);
      
      //check that the same amount was added to the funds mapping that the buyer sent
      assert.strictEqual(fundsInMapping, weiInt, 
        "Funds were not correctly added to the mapping");

      //check that the buyer's balance is at most 
      //what he had before less the purchase price.
      //it should be a little less, because of gas fees.
      assert.isAtMost(buyerEnd, buyerStart - weiInt, 
      "Funds were not correctly subtracted from the buyer account");

      //check that the buyer's balance is at least
      //what he had before less twice the purchase price.
      //this ensures that buyer wasn't double charged
      assert.isAtLeast(buyerEnd, buyerStart - 2 * weiInt, 
        "Funds were not correctly subtracted from the buyer account");
    });

    it("should emit a MarketTransaction event with correct parameters", async () => {
      await createBirdAndSetApproval();

      //set offer of 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //purchase Bird1
      var purchase = await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      //check for all event parameters to be emitted correctly
      truffleAssert.eventEmitted(purchase, 'MarketTransaction', (ev) => {
        return ev.TxType == "Bird successfully purchased" && ev.owner == accounts[1] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getBalance()", () =>{
    it("should return the balance of msg.sender", async () => {
      var amountToSet = 5;

      //a test function was created to set test balances in the funds mapping
      //create a balance of 5ETH for msg.sender
      await testMarketInstance.testSetBalance(amountToSet);

      //check mapping for balance
      var amountToGet = await testMarketInstance.getBalance();

      //ensure the mapping contains the same value as was set in the test
      assert.equal(amountToSet, amountToGet, 
        "Balance was not returned correctly");
    });
  });

  describe("withdrawFunds()", () =>{
    it("should revert, if no funds are available to withdraw", async () => {
      await truffleAssert.reverts(testMarketInstance.withdrawFunds({ from: accounts[0] }));
    });

    it("should revert, if the contract owner tries to withdraw user funds", async () => {
      await testMarketInstance.testSetBalance(5, { from: accounts[2] });
      await truffleAssert.reverts(testMarketInstance.withdrawFunds({ from: accounts[0] }));
    });

    it("should withdraw funds correctly", async () => {
      var seller = accounts[1];
      var buyer = accounts[2];
      
      //create test bird for seller
      await testBirdiesInstance.testCreateBird(101, seller);
      var marketAddress = await testMarketInstance.address;
      await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: seller });
  
      //conversions of offer of 1ETH
      var price = web3.utils.toBN(1);
      var inWei = web3.utils.toWei(price, "ether");

      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(inWei, 1, { from: seller });

      //check buyer's ETH balance before purchase
      var buyerStart = parseInt(await web3.eth.getBalance(buyer));

      //correct purchase of Bird1
      await testMarketInstance.buyBird(1, { from: buyer, value: inWei });

      //check buyer's ETH balance after purchase
      var buyerEnd = parseInt(await web3.eth.getBalance(buyer));

      //check seller's ETH balance before withdrawal
      var sellerStart = parseInt(await web3.eth.getBalance(seller));

      //check funds in mapping
      var fundsInMapping = await testMarketInstance.getBalanceOfMapping(seller);
      assert.equal(fundsInMapping, parseInt(inWei), 
        "Funds were not correctly added to the mapping");

      //seller should be able to withdraw 1ETH
      await testMarketInstance.withdrawFunds({ from: seller });

      //check seller's ETH balance after withdrawal
      var sellerEnd = parseInt(await web3.eth.getBalance(seller));

      //check mapping again
      fundsInMapping = await testMarketInstance.getBalanceOfMapping(seller);

      //convert back to integer
      var weiInt = parseInt(inWei);

      //make sure funds were removed from mapping
      assert.equal(fundsInMapping, 0, 
        "Funds were not correctly removed from the mapping");

      //make sure seller didn't receive any more funds than the proceedings from the purchase
      assert.isAtMost(sellerEnd - sellerStart, weiInt,
        "Funds were not correctly added to the seller account");

      //check that the amount was correctly subtracted from buyer
      //considering gas, at least purchase price and gas should have been removed
      assert.isAtLeast(buyerStart - buyerEnd, weiInt, 
        "Funds were not correctly subtracted from the buyer account");

      //check that the amount was correctly subtracted from buyer
      //considering gas, at most double the purchase price should have been removed
      //this ensures that there is no double spending
      assert.isAtMost(buyerStart - buyerEnd, 2 * weiInt, 
        "Funds were not correctly subtracted from the buyer account");
    });

    it("should emit a MonetaryTransaction event with correct parameters", async () => {
      await createBirdAndSetApproval();

      //set offer for 1ETH for Bird1
      await testMarketInstance.setOffer(1, 1, { from: accounts[0] });

      //purchase of Bird1
      await testMarketInstance.buyBird(1, { from: accounts[1], value: 1 });

      //seller withdraws funds
      var fundsReceived = await testMarketInstance.withdrawFunds({ from: accounts[0] });

      //ensure correct event for withdrawal is emitted
      truffleAssert.eventEmitted(fundsReceived, 'MonetaryTransaction', (ev) => {
        return ev.message == "Funds successfully received" && ev.recipient == accounts[0] && ev.amount == 1;
        }, "Event was NOT emitted with correct parameters");
    });

    it("should allow seller to access correct funds, if birds were sold to different buyers",
    async () => {
    var seller = accounts[1];
    var buyer1 = accounts[2];
    var buyer2 = accounts[3];

    //create 2 test birds and give market contract approval as operator
    await testBirdiesInstance.testCreateBird(101, seller);
    await testBirdiesInstance.testCreateBird(202, seller);
    var marketAddress = await testMarketInstance.address;
    await testBirdiesInstance.setApprovalForAll(marketAddress, true, { from: seller });

    //conversions
    var price1 = web3.utils.toBN(5);
    var inWei1 = web3.utils.toWei(price1, "ether");
    var price2 = web3.utils.toBN(3);
    var inWei2 = web3.utils.toWei(price2, "ether");

    //create 2 offers
    await testMarketInstance.setOffer(inWei1, 1, { from: seller }); //5 ETH for Bird1
    await testMarketInstance.setOffer(inWei2, 2, { from: seller }); //3 ETH for Bird2

    //purchase of the birds by two different buyers
    await testMarketInstance.buyBird(1, { from: buyer1, value: inWei1 });
    await testMarketInstance.buyBird(2, { from: buyer2, value: inWei2 });

    //check seller's ETH balance before withdrawal
    var sellerStart = parseInt(await web3.eth.getBalance(seller));

    await testMarketInstance.withdrawFunds({ from: seller });

    //check seller's ETH balance after withdrawal
    var sellerEnd = parseInt(await web3.eth.getBalance(seller));
    var weiInt = parseInt(inWei1 + inWei2);

    //make sure seller didn't receive any more funds than the proceedings from the purchase
    assert.isAtMost(sellerEnd - sellerStart, weiInt,
      "Funds were not correctly added to the seller account");
    });
  });
})