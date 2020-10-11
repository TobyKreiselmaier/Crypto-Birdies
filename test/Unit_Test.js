const Birdcontract = artifacts.require("AngryBirds");
const Testcontract = artifacts.require("Test");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");


contract("Testcontract", (accounts) => {
  var instance;
  
  beforeEach(async () => {instance = await Testcontract.new("AngryBirdsontheBlock", "ABBX")});

  describe("getAllBirdsOfOwner()", () =>{
    it("should return all birds owned by an address", async () => {
      await instance.createTestBird(101, accounts[0]);
      await instance.createTestBird(202, accounts[0]);
      await instance.createTestBird(303, accounts[1]);
      await instance.createTestBird(404, accounts[0]);
      await instance.createTestBird(505, accounts[1]);
      var testAllBirdsOfOwner = await instance.getAllBirdsOfOwner(accounts[1]);
      assert.equal(testAllBirdsOfOwner[0].toNumber(), 2, "Data is incorrect");
      assert.equal(testAllBirdsOfOwner[1], 4, "Data is incorrect");
    });
  });
})

contract("Birdcontract", (accounts) => {
  var instance;

  beforeEach(async () => {instance = await Birdcontract.new("AngryBirdsontheBlock", "ABBX")});

  describe("name()", () =>{
    it("should return the name of the native token 'AngryBirdsontheBlock'", async () => {
      var testName = await instance.name();
      assert.equal(testName, "AngryBirdsontheBlock", "Token wasn't constructed correctly");
    });
  });

  describe("symbol()", () =>{
    it("should return the ticker symbol 'ABBX'", async () => {
      var testSymbol = await instance.symbol();
      assert.equal(testSymbol, "ABBX", "Symbol wasn't constructed correctly");
    });
  });

  describe("balanceOf()", () =>{
    it("should return the correct balance of tokens owned by an address", async () => {
      var numberTokens = await instance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
      await instance.createBirdGen0(101);
      numberTokens = await instance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    });
  });

  describe("getBird()", () =>{
    it("should return the correct genes of a token", async () => {
      await instance.createBirdGen0(101);
      var result = await instance.getBird(0);
      assert.equal(result.genes.toNumber(), 101, "The genes are incorrect");
    });

    it("should return the correct birthTime of a token", async () => {
      var startTime = Date.now();
      await instance.createBirdGen0(101);
      var endTime = Date.now();
      var result = await instance.getBird(0);
      assert(startTime/1000 <= result.birthTime <= endTime/1000, "The birthTime is incorrect");
    });

    it("should return the correct mumId of a token", async () => {
      await instance.createBirdGen0(101);
      var result = await instance.getBird(0);
      assert.equal(result.mumId, 0, "The id for the mum is incorrect");
    });

    it("should return the correct dadId of a token", async () => {
      await instance.createBirdGen0(101);
      var result = await instance.getBird(0);
      assert.equal(result.dadId, 0, "The id for the dad is incorrect");
    });

    it("should return the correct generation of a token", async () => {
      await instance.createBirdGen0(101);
      var result = await instance.getBird(0);
      assert.equal(result.generation, 0, "The generation is not zero");
    });

    it("should revert, if the bird does not exist", async () => {
      await truffleAssert.reverts(instance.getBird(5));
    });
  });

  describe("ownerOf()", () =>{
    it("should return the correct owner of the token", async () => {
      await instance.createBirdGen0(101);
      var testOwner = await instance.ownerOf(0);
      assert.equal(testOwner, accounts[0], "The owner of the token is incorrect");
    });

    it("should revert, if the ID does not exist", async () => {
      await truffleAssert.reverts(instance.ownerOf(5));
    });
  });

  describe("totalSupply()", () =>{
    it("should record the total supply of tokens", async () => {
      await instance.createBirdGen0(101);
      var supply = await instance.totalSupply();
      assert.equal(supply, 1, "The record of total supply is flawed and can't be trusted");
    });
  });

  describe("transfer()", () =>{
    it("should not allow transfer to the burn address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await instance.createBirdGen0(101);
      var testOwner = await instance.ownerOf(0);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(instance.transfer(zeroAddress, 0));
    });
  
    it("should not allow transfer to the contract address", async () => {
      var contractAddress = await instance.address;
      await truffleAssert.reverts(instance.transfer(contractAddress, 0));
    });
  
    it("should emit a transfer event when a transfer was successful", async () => {
      await instance.createBirdGen0(101);
      var testTransfer = await instance.transfer(accounts[1], 0);
      truffleAssert.eventEmitted(testTransfer, 'Transfer', (ev) => {
        return ev.from == accounts[0] && ev.to == accounts[1] && ev.tokenId == 0;
      }, "Transfer event should have been emitted with correct parameters");
    });
  
    it("should transfer a token from one account to another", async () => {
      var numberTokensSenderStart = await instance.balanceOf(accounts[0]);
      var numberTokensRecipientStart = await instance.balanceOf(accounts[1]);
      await truffleAssert.reverts(instance.transfer(accounts[1], 0));
      var numberTokensSenderEnd = await instance.balanceOf(accounts[0]);
      assert.equal(numberTokensSenderEnd, numberTokensSenderStart--, "Token balance sender is not updated correctly");
      var numberTokensRecipientEnd = await instance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipientEnd, numberTokensRecipientStart++, "Token balance sender is not updated correctly");
    });
  });
})