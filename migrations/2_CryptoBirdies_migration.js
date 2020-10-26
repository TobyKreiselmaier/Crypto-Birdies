const ERC721 = artifacts.require("CryptoBirdies");

module.exports = async function(deployer) {
  await deployer.deploy(ERC721, "CryptoBird", "CBX");
  const instance = await ERC721.deployed();
  if(instance) {
    console.log("Main contract successfully deployed.")
  }
}