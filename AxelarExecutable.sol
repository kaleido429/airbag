// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract XRPLMessageReceiver is AxelarExecutable {
    string public lastMessage;
    address public lastSender;
    string public lastSourceChain;
    event MessageReceived(string sourceChain, string sourceAddress, string message);
    
    constructor(address gateway) AxelarExecutable(gateway) {}
    
    // Axelar에서 호출하는 함수
    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        lastSourceChain = sourceChain;
        lastSender = msg.sender;
        
        // 메시지 디코딩
        string memory message = abi.decode(payload, (string));
        lastMessage = message;
        
        emit MessageReceived(sourceChain, sourceAddress, message);
        
        // 여기서 추가 로직 수행 가능
        // 예: XRPL 네이티브 트랜잭션 발생시키기, 다른 액션 수행하기 등
    }
}