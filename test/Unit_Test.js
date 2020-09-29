const Birdcontract = artifacts.require("Birdcontract");

contract("Birdcontract", async accounts => {
  it("should have a native token called 'AngryBirdontheBlock'", async () => {
    var instance = await Birdcontract.deployed();
    var testName = await instance._name;
    assert.equal(testName, "AngryBirdontheBlock", "Token wasn't constructed correctly");
  });


  it("should have the token symbol 'ABBX'", async () => {
    var instance = await Birdcontract.deployed();
    var testSymbol = await instance._symbol;
    assert.equal(testSymbol, "ABBX", "Symbol wasn't constructed correctly");
  });

  it("should record the number of tokens owned by an address correctly", async () => {
    var instance = await Birdcontract.deployed();
    var numberTokens = await instance.ownsNumberOfTokens[accounts[0]];
    assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
    numberTokens = await instance.ownsNumberOfTokens[accounts[0]]++;
    assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    numberTokens = await instance.ownsNumberOfTokens[accounts[0]]--;
    assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
  });

  it("should record the total supply of tokens correctly", async () => {
    var instance = await Birdcontract.deployed();
    var supply = await instance.birdies.length();
    assert.equal(supply, 0, "The record of total supply is flawed and can't be trusted");
    //add code to create a dummie token and test the total supply again.
  });

  it("should transfer a token correctly", async () => {
    var instance = await Birdcontract.deployed();
    //add code to create a dummie token and test:
    //- contract only allows owner to transfer
    //- transfer to the burn address is not possible
    //- transfer to the contract address is not possible
    //- records for both sender and recipient are correctly updated
  });
})