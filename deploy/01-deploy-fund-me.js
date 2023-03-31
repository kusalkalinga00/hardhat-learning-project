//import

// function deployFunc() {
//     console.log("Hi!")
// }

// module.exports.default = deployFunc;

// module.exports = async (hre) => {
//     const {getNamedAccounts , deployments} = hre

// };

const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();
// const helperConfig = require("../helper-hardhat-config");
// const networkConfig = helperConfig.networkConfig;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

  let ethUsdPriceFeedAddress;

  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }

  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

   log(`FundMe deployed at ${fundMe.address}`);

  if (
    !developmentChain.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
  log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
