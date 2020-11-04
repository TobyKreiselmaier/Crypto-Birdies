const CryptoBirdies = artifacts.require("CryptoBirdies");
const MarketPlace = artifacts.require("MarketPlace");

module.exports = async function(deployer) {
  await deployer.deploy(MarketPlace, CryptoBirdies.address);
  const instance = await MarketPlace.deployed();
  if(instance) {
    console.log("MarketPlace successfully deployed.")
  }
}