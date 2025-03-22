// scripts/check-connection.js
const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  console.log("Connected to:", network.name, "(chainId:", network.chainId, ")");
}

main();
