// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentGateway {
    address public seller;
    IERC20 public sampleToken;

    event PaymentDone(
        address payer,
        uint256 amount,
        uint256 paymentId,
        uint256 date
    );

    constructor(address sellerAddress, address sampleTokenAddress) {
        seller = sellerAddress;
        sampleToken = IERC20(sampleTokenAddress);
    }

    function pay(uint256 amount, uint256 paymentId) external {
        sampleToken.transferFrom(msg.sender, seller, amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    }
}
