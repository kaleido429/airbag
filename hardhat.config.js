require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.drpc.org",
      accounts: ["0x9e4f3557e5cef9afedd0376385d6f1ec365f1ebc6bac66a5c8401484ac1beceb"],
    },
  },
};