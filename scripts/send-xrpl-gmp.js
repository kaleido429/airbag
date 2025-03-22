const { AbiCoder } = require("ethers");
const xrpl = require("xrpl");

// ====== STEP 1: Prepare Payload ======
const message = "Hello from XRPL!";

const abiPayload = AbiCoder.defaultAbiCoder().encode(["string"], ["Hello from XRPL!"]);

// ====== STEP 2: Connect to XRPL Testnet ======
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

async function sendGMPMessage() {
  await client.connect();

  // Replace with your own XRPL Testnet seed
  const wallet = xrpl.Wallet.fromSeed("sEd7mvkreugq5Efk1mPTbGhW5bYjfUK");

  const payment = {
    TransactionType: "Payment",
    Account: wallet.address,
    Amount: "1", // 1 drop
    Destination: "rfEf91bLxrTVC76vw1W3Ur8Jk4Lwujskmb", // Axelar Gateway on XRPL Testnet
    Memos: [
      {
        Memo: {
          MemoType: xrpl.convertStringToHex("destination_address"),
          MemoData: xrpl.convertStringToHex("af98D22e4DA20c02Ca459CF8FFa08Fb86bD42651"),
        },
      },
      {
        Memo: {
          MemoType: xrpl.convertStringToHex("destination_chain"),
          MemoData: xrpl.convertStringToHex("ethereum-sepolia"),
        },
      },
      {
        Memo: {
          MemoType: xrpl.convertStringToHex("payload_hash"),
          MemoData: xrpl.convertStringToHex(abiPayload),
        },
      },
    ],
  };

  const tx = await client.autofill(payment);
  const signed = wallet.sign(tx);
  const result = await client.submit(signed.tx_blob);

  console.log("✅ Transaction submitted:", result);

  await client.disconnect();
}

sendGMPMessage().catch(console.error);