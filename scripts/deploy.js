const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  const gatewayAddress = "0x8734d0c8e58e8b347b72b0f7455e6d58c4cd5b31"; // Axelar Sepolia Gateway
  const Contract = await hre.ethers.getContractFactory("HelloFromXRPL");
  const contract = await Contract.deploy(gatewayAddress);

  await contract.deployed();

  console.log("✅ Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
