const ERC721 = artifacts.require("Birdcontract");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(ERC721, "AngryBirdontheBlock", "ABBX");
  const instance = await ERC721.deployed();
  if(instance) {
    console.log("Success.")
  }
};