/* eslint-disable no-undef */
// const PriceConsumerV3 = artifacts.require('PriceConsumerV3');
const DeLib = artifacts.require('DeLib');

module.exports = async function(deployer) {
  // await deployer.deploy(PriceConsumerV3);
  // const priceConsumerV3 = await PriceConsumerV3.deployed(); 

  // await deployer.deploy(DeLib, deployer, priceConsumerV3.address);
  await deployer.deploy(DeLib, '0xF0AeCD618f4325E42D367685562e18f14a55085C');
}