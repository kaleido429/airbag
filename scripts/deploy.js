/** gateway test
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
});*/
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("배포 계정:", deployer.address);
  console.log("잔액:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Axelar Gateway 주소를 넣으세요
  const AXELAR_GATEWAY = "0xD39b1B9A5C9b6d05E3c1A0d0EC1Fe0A5222f9ed0"; // ethereum-sepolia gateway
  const PRICE_FEED = "0x0000000000000000000000000000000000000000";
  const UNISWAP_ROUTER = "0x0000000000000000000000000000000000000000";
  const XRP_TOKEN = "0x0000000000000000000000000000000000000000";

  const Contract = await hre.ethers.getContractFactory("XrpTriggeredRebalance");

  const contract = await Contract.deploy(
    AXELAR_GATEWAY,
    PRICE_FEED,
    UNISWAP_ROUTER,
    XRP_TOKEN
  );

  await contract.waitForDeployment();

  console.log("✅ XrpTriggeredRebalance 배포 완료!");
  console.log("📦 Contract 주소:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
