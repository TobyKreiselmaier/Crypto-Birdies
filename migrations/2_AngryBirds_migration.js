const ERC721 = artifacts.require("AngryBirds");

module.exports = async function(deployer) {
  await deployer.deploy(ERC721, "AngryBirdsontheBlock", "ABBX");
  const instance = await ERC721.deployed();
  if(instance) {
    console.log("Main contract successfully deployed.")
  }
}