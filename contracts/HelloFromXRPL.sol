// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract HelloFromXRPL is AxelarExecutable {
    event MessageReceived(string message);

    constructor(address gateway_) AxelarExecutable(gateway_) {}

    function _execute(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        string memory message = abi.decode(payload, (string));
        emit MessageReceived(message);
    }
    function testExecute(
    bytes32 commandId,
    string calldata sourceChain,
    string calldata sourceAddress,
    bytes calldata payload
    ) external {
        _execute(commandId, sourceChain, sourceAddress, payload);
    }
}
