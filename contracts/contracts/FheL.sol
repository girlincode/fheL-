// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import {InEuint64} from "@fhenixprotocol/cofhe-contracts/ICofhe.sol";

/// @title fheL — Private Liquidation Engine (MVP)
/// @notice Encrypted collateral and debt; health and liquidation use FHE comparisons only.
/// @dev Amounts are abstract 64-bit units (no external price oracle in this MVP).
contract FheL {
    struct Position {
        euint64 collateral;
        euint64 debt;
    }

    /// @notice Max borrow as basis points of collateral (80%)
    uint64 public constant MAX_BORROW_BPS = 8000;
    /// @notice Liquidation when encrypted debt exceeds this fraction of collateral (75%)
    uint64 public constant LIQUIDATION_BPS = 7500;
    uint64 public constant BPS = 10000;

    mapping(address => Position) internal _positions;

    event Deposited(address indexed user);
    event Borrowed(address indexed user);
    event LiquidationAttempt(address indexed user, address indexed liquidator);

    /// @notice Encrypted max borrow: collateral * MAX_BORROW_BPS / BPS
    function _maxBorrow(euint64 collateral) internal returns (euint64) {
        return FHE.div(
            FHE.mul(collateral, FHE.asEuint64(MAX_BORROW_BPS)),
            FHE.asEuint64(BPS)
        );
    }

    /// @notice Encrypted liquidation threshold: collateral * LIQUIDATION_BPS / BPS
    function _liquidationThreshold(euint64 collateral) internal returns (euint64) {
        return FHE.div(
            FHE.mul(collateral, FHE.asEuint64(LIQUIDATION_BPS)),
            FHE.asEuint64(BPS)
        );
    }

    /// @notice Owner (`msg.sender`) may decrypt via CoFHE permits; contract retains handles for FHE ops.
    function _allowOwnerDecrypt(euint64 collateral, euint64 debt) internal {
        FHE.allowThis(collateral);
        FHE.allowSender(collateral);
        FHE.allowThis(debt);
        FHE.allowSender(debt);
    }

    /// @notice After liquidation, only the position owner should decrypt — not the liquidator.
    function _allowOwnerDecryptFor(address user, euint64 collateral, euint64 debt) internal {
        FHE.allowThis(collateral);
        FHE.allowThis(debt);
        FHE.allow(collateral, user);
        FHE.allow(debt, user);
    }

    /// @param encAmount Encrypted deposit amount (same units as the rest of the position).
    function deposit(InEuint64 calldata encAmount) external {
        euint64 addAmt = FHE.asEuint64(encAmount);
        Position storage p = _positions[msg.sender];
        p.collateral = FHE.add(p.collateral, addAmt);
        FHE.allowThis(p.collateral);
        FHE.allowSender(p.collateral);
        emit Deposited(msg.sender);
    }

    /// @param encAmount Encrypted borrow amount; debt only increases if still within max LTV.
    function borrow(InEuint64 calldata encAmount) external {
        Position storage p = _positions[msg.sender];
        euint64 borrowAmt = FHE.asEuint64(encAmount);
        euint64 maxB = _maxBorrow(p.collateral);
        euint64 newDebt = FHE.add(p.debt, borrowAmt);
        ebool canBorrow = FHE.lte(newDebt, maxB);
        p.debt = FHE.select(canBorrow, newDebt, p.debt);
        _allowOwnerDecrypt(p.collateral, p.debt);
        emit Borrowed(msg.sender);
    }

    /// @notice Anyone may call; position is zeroed only when encrypted debt exceeds the liquidation threshold.
    function liquidate(address user) external {
        Position storage p = _positions[user];
        euint64 liqLine = _liquidationThreshold(p.collateral);
        ebool isLiq = FHE.gt(p.debt, liqLine);
        euint64 zero = FHE.asEuint64(0);
        p.collateral = FHE.select(isLiq, zero, p.collateral);
        p.debt = FHE.select(isLiq, zero, p.debt);
        _allowOwnerDecryptFor(user, p.collateral, p.debt);
        emit LiquidationAttempt(user, msg.sender);
    }

    function positionOf(address user) external view returns (euint64 collateral, euint64 debt) {
        Position storage p = _positions[user];
        return (p.collateral, p.debt);
    }
}
