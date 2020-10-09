const ERC721 = artifacts.require("AngryBirds");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(ERC721, "AngryBirdsontheBlock", "ABBX");
  const instance = await ERC721.deployed();
  if(instance) {
    console.log("Contract successfully deployed.")
  }
}