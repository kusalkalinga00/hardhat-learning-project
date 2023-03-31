const { network } = require("hardhat");
const {
  developmentChain,
  INITIAL_ASNWER,
  DECIMALS,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  if (developmentChain.includes(network.name)) {
    log("local network detected. deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ASNWER],
    });
    log("Mocks Deployed!");
    log("----------------------------------------------");
  }
};

module.exports.tags = ["all" , "mocks"]
