const Birdcontract = artifacts.require("Birdcontract");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract("Birdcontract", async accounts => {
  var instance;
  beforeEach( async () => {instance = await Birdcontract.new("AngryBirdontheBlock", "ABBX")});
  it("should have a native token called 'AngryBirdontheBlock'", async () => {
    var testName = await instance.name();
    assert.equal(testName, "AngryBirdontheBlock", "Token wasn't constructed correctly");
  });

  it("should have the token symbol 'ABBX'", async () => {
    var testSymbol = await instance.symbol();
    assert.equal(testSymbol, "ABBX", "Symbol wasn't constructed correctly");
  });

  it("should record the number of tokens owned by an address correctly", async () => {
    var numberTokens = await instance.balanceOf(accounts[0]);
    assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
    await instance.createBirdGen0(123456);
    numberTokens = await instance.balanceOf(accounts[0]);
    assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");

  });

  it("should return the correct owner of the token", async () => {
    await instance.createBirdGen0(123456);
    var testOwner = await instance.ownerOf(0);
    assert.equal(testOwner, accounts[0], "The owner of the token is incorrect");
  });

  it("should record the total supply of tokens correctly", async () => {
    await instance.createBirdGen0(123456);
    var supply = await instance.totalSupply();
    assert.equal(supply, 1, "The record of total supply is flawed and can't be trusted");
  });

  it("should not transfer a token to the burn address", async () => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    await instance.createBirdGen0(123456);
    var testOwner = await instance.ownerOf(0);
    assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
    var testTransfer = await truffleAssert.reverts(instance.transfer(zeroAddress, 0));
  });

  it("should not transfer a token to the contract address", async () => {
    var contractAddress = await instance.address;
    testTransfer = await truffleAssert.reverts(instance.transfer(contractAddress, 0));
  });

  it("should transfer a token correctly from one account to another", async () => {
    var numberTokensSenderStart = await instance.balanceOf(accounts[0]);
    var numberTokensRecipientStart = await instance.balanceOf(accounts[1]);
    testTransfer = await truffleAssert.reverts(instance.transfer(accounts[1], 0));
    var numberTokensSenderEnd = await instance.balanceOf(accounts[0]);
    assert.equal(numberTokensSenderEnd, numberTokensSenderStart--, "Token balance sender is not updated correctly");
    var numberTokensRecipientEnd = await instance.balanceOf(accounts[1]);
    assert.equal(numberTokensRecipientEnd, numberTokensRecipientStart++, "Token balance sender is not updated correctly");
  });
})