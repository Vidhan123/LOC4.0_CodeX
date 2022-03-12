// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
  AggregatorV3Interface internal priceFeedMatic;
  
  constructor() {
    // For Polygon Mumbai Testnet
    priceFeedMatic = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
  }

  function getLatestPriceMatic() public view returns (int) {
    (uint80 roundID, int price, uint startedAt, uint timeStamp, uint80 answeredInRound) = priceFeedMatic.latestRoundData();

    return price;
  }
}