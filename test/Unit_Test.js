const ERC721 = artifacts.require("Birdcontract");

contract("Testing Birdcontract...", async accounts => {
  it("should have a native ERC721 token called 'AngryBirdontheBlock'", async () => {
    var instance = await ERC721.deployed();
    var testName = await instance._name;
    assert(keccak256(abi.encodePacked(testName)) ==
           keccak256(abi.encodePacked("AngryBirdontheBlock"), "Token wasn't constructed correctly"));
  });

  it("should have the token symbol 'ABBX'", async () => {
    var instance = await ERC721.deployed();
    var testSymbol = await instance._symbol;
    assert(keccak256(abi.encodePacked(testSymbol)) ==
          keccak256(abi.encodePacked("ABBX"), "Symbol wasn't constructed correctly"));
  });

  it("should record the number of tokens owned by an address correctly", async () => {
    var instance = await ERC721.deployed();
    var numberTokens = await instance.ownsNumberOfTokens[accounts[0]];
    assert(numberTokens == 0, "The record of tokens is flawed and can't be trusted");
    numberTokens = await instance.ownsNumberOfTokens[accounts[0]]++;
    assert(numberTokens == 1, "The record of tokens is flawed and can't be trusted");
    numberTokens = await instance.ownsNumberOfTokens[accounts[0]]--;
    assert(numberTokens == 0, "The record of tokens is flawed and can't be trusted");
  });

  it("should record the total supply of tokens correctly", async () => {
    var instance = await ERC721.deployed();
    var supply = await instance.birdies.length();
    assert(supply == 0, "The record of total supply is flawed and can't be trusted");
    //add code to create a dummie token and test the total supply again.
  });

  it("should transfer a token correctly", async () => {
    var instance = await ERC721.deployed();
    //add code to create a dummie token and test:
    //- contract only allows owner to transfer
    //- transfer to the burn address is not possible
    //- transfer to the contract address is not possible
    //- records for both sender and recipient are correctly updated
  });
})