const Birdcontract = artifacts.require("Birdcontract");

contract("Birdcontract", async accounts => {
  it("should have a native token called 'AngryBirdontheBlock'", async () => {
    var instance = await Birdcontract.deployed();
    var testName = await instance.name();
    assert.equal(testName, "AngryBirdontheBlock", "Token wasn't constructed correctly");
  });


  it("should have the token symbol 'ABBX'", async () => {
    var instance = await Birdcontract.deployed();
    var testSymbol = await instance.symbol();
    assert.equal(testSymbol, "ABBX", "Symbol wasn't constructed correctly");
  });

  it("should record the number of tokens owned by an address correctly", async () => {
    var instance = await Birdcontract.deployed();
    var numberTokens = await instance.balanceOf(accounts[0]);
    assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
    await instance.createBirdGen0(123456);
    numberTokens = await instance.balanceOf(accounts[0]);
    assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");

  });

  it("should record the total supply of tokens correctly", async () => {
    var instance = await Birdcontract.deployed();
    var supply = await instance.totalSupply();
    assert.equal(supply, 1, "The record of total supply is flawed and can't be trusted");
    //a bird was created in the previous test.
  });

  it("should transfer a token correctly", async () => {
    var instance = await Birdcontract.deployed();
    var testOwner = await instance.ownerOf(0);
    assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
    var testTransfer = await instance.transfer(address(0), 0);
    assert.equal(testTransfer, false, "Error: Token was transferred to the burn address");
    testTransfer = await instance.transfer(address(this), 0);
    assert.equal(testTransfer, false, "Error: Token was transferred to the contract address");
    var numberTokensSenderStart = await instance.balanceOf(accounts[0]);
    var numberTokensRecipientStart = await instance.balanceOf(accounts[1]);
    var testTransfer = await instance.transfer(accounts[1], 0);
    assert.equal(testTransfer, true, "Token wasn't transferred correctly");
    var numberTokensSenderEnd = await instance.balanceOf(accounts[0]);
    assert.equal(numberTokensSenderEnd, numberTokensSenderStart--, "Token balance sender is not updated correctly");
    var numberTokensRecipientEnd = await instance.balanceOf(accounts[1]);
    assert.equal(numberTokensRecipientEnd, numberTokensRecipientStart++, "Token balance sender is not updated correctly");
  });
})