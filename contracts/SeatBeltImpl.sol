// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SeatBelt.sol";

contract SeatBeltImpl is SeatBelt {
    constructor(
        address gateway_,
        address priceFeed_,
        address router_,
        address xrpToken_
    ) SeatBelt(gateway_, priceFeed_, router_, xrpToken_) {}
}
