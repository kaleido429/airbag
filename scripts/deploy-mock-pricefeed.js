const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying mock price feed from:", deployer.address);

  const MockPriceFeed = await hre.ethers.getContractFactory("MockPriceFeed");
  const priceFeed = await MockPriceFeed.deploy();
  await priceFeed.waitForDeployment();

  console.log("✅ MockPriceFeed deployed at:", priceFeed.target);

  // 초기 가격 조절 (optional)
  const tx = await priceFeed.setPrice(49000000); // 0.49 USD (8 decimals)
  await tx.wait();
  console.log("✅ Price set to 0.49 USD");

  return priceFeed.target;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
