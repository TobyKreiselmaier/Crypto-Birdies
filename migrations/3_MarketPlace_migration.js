const AngryBirds = artifacts.require("AngryBirds");
const MarketPlace = artifacts.require("MarketPlace");

module.exports = async function(deployer) {
  await deployer.deploy(MarketPlace, AngryBirds.address);
  const instance = await MarketPlace.deployed();
  if(instance) {
    console.log("Market Place contract successfully deployed.")
  }
}