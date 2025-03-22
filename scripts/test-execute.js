const { ethers } = require("hardhat");

async function main() {
  const contract = await ethers.getContractAt("HelloFromXRPL", "0xaf98D22e4DA20c02Ca459CF8FFa08Fb86bD42651");
  const payload = ethers.utils.defaultAbiCoder.encode(["string"], ["Hello from XRPL!"]);

  const tx = await contract.testExecute(
    ethers.constants.HashZero,
    "xrpl",
    "rEXAMPLEXRPLADDRESS",
    payload
  );

  await tx.wait();
  console.log("✅ testExecute() called successfully!");
}

main().catch(console.error);
