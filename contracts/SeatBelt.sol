// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract XrpTriggeredRebalance is AxelarExecutable {
    event RebalanceTriggered(uint256 triggerPrice, uint256 currentPrice, string tag);
    event Swapped(address toToken, uint256 amount);
    event AssetMapped(string symbol, address token);

    address public owner;

    AggregatorV3Interface public xrpPriceFeed;
    IUniswapV2Router02 public router;
    IERC20 public xrpToken;

    // symbol (e.g. "RLUSD") → ERC20 token address
    mapping(string => address) public assetToAddress;

    struct Allocation {
        string asset;
        uint256 percent; // e.g. 50 for 50%
    }

    constructor(
        address gateway_,
        address priceFeed_,
        address router_,
        address xrpToken_
    ) AxelarExecutable(gateway_) {
        owner = msg.sender;
        xrpPriceFeed = AggregatorV3Interface(priceFeed_);
        router = IUniswapV2Router02(router_);
        xrpToken = IERC20(xrpToken_);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    // Owner can map asset symbols to ERC20 addresses
    function setAssetAddress(string calldata symbol, address token) external onlyOwner {
        require(token != address(0), "zero address");
        assetToAddress[symbol] = token;
        emit AssetMapped(symbol, token);
    }

    // Core: handle GMP message and trigger rebalancing
    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        (uint256 triggerPrice, Allocation[] memory allocations) =
            abi.decode(payload, (uint256, Allocation[]));

        uint256 currentPrice = getXrpUsdPrice();
        if (currentPrice > triggerPrice) { // no rebalance needed
            emit RebalanceTriggered(triggerPrice, currentPrice, "seatbelt ready");
            return;
        }

        emit RebalanceTriggered(triggerPrice, currentPrice, "seatbelt activate");

        uint256 xrpBalance = xrpToken.balanceOf(address(this));
        require(xrpBalance > 0, "no XRP balance"); //if no XRP, nothing to do   

        // loop: for each asset, swap % of XRP into it
        for (uint256 i = 0; i < allocations.length; i++) {
            Allocation memory alloc = allocations[i];
            address toToken = assetToAddress[alloc.asset];
            require(toToken != address(0), "unknown asset");

            uint256 amount = (xrpBalance * alloc.percent) / 100;

            // approve Uniswap router
            xrpToken.approve(address(router), amount);

            address ;
            path[0] = address(xrpToken);
            path[1] = toToken;

            router.swapExactTokensForTokens(
                amount,
                0, // no slippage control for now
                path,
                address(this),
                block.timestamp
            );

            emit Swapped(toToken, amount);
        }
    }

    function getXrpUsdPrice() public view returns (uint256) {
        (, int256 price,,,) = xrpPriceFeed.latestRoundData();
        return uint256(price); // 8 decimals
    }
}
