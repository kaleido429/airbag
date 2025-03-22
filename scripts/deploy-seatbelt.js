const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 배포 계정:", deployer.address);
  console.log("💰 잔액:", (await deployer.provider.getBalance(deployer.address)).toString());

  // 실제 주소들로 교체하세요!
  const AXELAR_GATEWAY = "0xD39b1B9A5C9b6d05E3c1A0d0EC1Fe0A5222f9ed0"; // Sepolia용 Axelar Gateway
  const PRICE_FEED = "0xYourMockPriceFeedAddress";       // 예: MockPriceFeed 배포 주소
  const UNISWAP_ROUTER = "0xYourUniswapRouterAddress";   // 예: Uniswap V2 Router 또는 Mock
  const XRP_TOKEN = "0xYourXRPTokenAddress";             // 예: mock XRP (ERC20)

  const Contract = await hre.ethers.getContractFactory("SeatBeltImpl");

  const contract = await Contract.deploy(
    AXELAR_GATEWAY,
    PRICE_FEED,
    UNISWAP_ROUTER,
    XRP_TOKEN
  );

  await contract.waitForDeployment();

  console.log("✅ SeatBeltImpl 배포 완료!");
  console.log("📦 Contract 주소:", contract.target);
}

main().catch((error) => {
  console.error("❌ 배포 실패:", error);
  process.exit(1);
});
