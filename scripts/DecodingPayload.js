const { AbiCoder } = require("ethers");
const { Client, Wallet } = require("xrpl");
const { decode } = require("ripple-binary-codec");
const { send } = require("process");
//https://docs.xrplevm.org/pages/developers/making-a-cross-chain-dapp/send-messages를 참고

// 최상위 await를 사용하기 위해 비동기 함수로 감싸기
async function main() {
  const seed = "sEd7mvkreugq5Efk1mPTbGhW5bYjfUK";

  // ABI-encoded payload 생성
  const payload = AbiCoder.defaultAbiCoder().encode(["string"], ["triger:1000000, RLUSD:3, BTC:4, ETH:2"]);
  
  // 지갑 생성
  const wallet = Wallet.fromSeed(seed);
  console.log("지갑 주소:", wallet.address);
  
  // 클라이언트 생성 및 연결
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  const ethClient = new Client("wss://ropsten.infura.io/ws/v3/4f7f3b3f7f7e4f3f8f3f8f3f8f3f8f3f");
  try {
    await client.connect();
    console.log("XRPL 서버에 연결됨");
    
    // 결제 트랜잭션 객체 생성
    const payment = {
      TransactionType: "Payment",
      Account: wallet.address,
      Amount: "10000000",
      Destination: "rsCPY4vwEiGogSraV9FeRZXca6gUBWZkhg",
      Memos: [
        {
          Memo: {
            MemoType: Buffer.from("destination_address").toString("hex").toUpperCase(),
            MemoData: "F16A31764C91805B6C8E1D488941E41A86531880",
          },
        },
        {
          Memo: {
            MemoType: Buffer.from("destination_chain").toString("hex").toUpperCase(),
            MemoData: Buffer.from("xrpl-evm-test-1").toString("hex").toUpperCase(),
          },
        },
        {
          Memo: {
            MemoType: "7061796C6F61645F68617368",
            MemoData: payload.slice(2),
          },
        },
      ],
    };
    
    // 트랜잭션 준비 및 필수 필드 채우기
    const prepared = await client.autofill(payment);
    
    // 트랜잭션 서명
    const signed = wallet.sign(prepared);
    console.log("서명된 트랜잭션:", signed.tx_blob);
    
    // 트랜잭션 제출
    const result = await client.submit(signed.tx_blob);
    console.log("트랜잭션 결과:", result);
    
    if (result.result.engine_result === "tesSUCCESS") {
      console.log("트랜잭션 성공!");
      console.log("페이로드:", payload.slice(2));
      decodedMsg = AbiCoder.defaultAbiCoder().decode(["string"], "0x" + payload.slice(2));
      console.log("디코딩된 메시지:", decodedMsg);
    } else {
      console.error("트랜잭션 실패:", result.result.engine_result_message);
    }
    
  } catch (error) {
    console.error("오류 발생:", error);
  } finally {
    // 클라이언트 연결 종료
    await client.disconnect();
    console.log("XRPL 서버 연결 종료");
  }
  
}
//
// 메인 함수 실행
main().catch(console.error);