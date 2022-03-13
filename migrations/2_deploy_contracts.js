/* eslint-disable no-undef */
// const PriceConsumerV3 = artifacts.require('PriceConsumerV3');
const DeLib = artifacts.require('DeLib');

module.exports = async function(deployer) {
  // await deployer.deploy(PriceConsumerV3);
  // const priceConsumerV3 = await PriceConsumerV3.deployed(); 

  // await deployer.deploy(DeLib, deployer, priceConsumerV3.address);
  await deployer.deploy(DeLib, '0x5bc61D9636769a514149f48220cbF9D978B5A6ea');
}