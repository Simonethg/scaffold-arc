// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {UsdcUnits} from "../src/UsdcUnits.sol";

/// @title UsdcUnits tests — Arc footgun #1 as executable documentation
/// @notice These tests encode the behavior that breaks naive Ethereum ports:
///         native USDC (18 decimals) and ERC-20 USDC (6 decimals) are the
///         same funds under two units, off by exactly 10^12.
contract UsdcUnitsTest is Test {
    /// @dev 1.00 USDC expressed in each view.
    uint256 private constant ONE_USDC_ERC20 = 1e6;
    uint256 private constant ONE_USDC_NATIVE = 1e18;

    function test_OneUsdcIsTheSameFundsInBothViews() public pure {
        assertEq(
            UsdcUnits.erc20ToNative(ONE_USDC_ERC20),
            ONE_USDC_NATIVE,
            "1.00 USDC (6d) must equal 1.00 USDC (18d) after scaling"
        );
        assertEq(
            UsdcUnits.nativeToErc20(ONE_USDC_NATIVE),
            ONE_USDC_ERC20,
            "round-trip must preserve whole-unit amounts"
        );
    }

    function test_NaiveEthereumPortIsOffByTwelveOrdersOfMagnitude() public pure {
        // A naive port compares msg.value (18d) against balanceOf (6d) directly.
        // That comparison is wrong by exactly 10^12 — this assertion documents it.
        assertEq(ONE_USDC_NATIVE / ONE_USDC_ERC20, 1e12, "the two views differ by 10^12");
        assertEq(UsdcUnits.SCALE, 1e12, "SCALE constant must match the decimal gap");
    }

    function test_Erc20ViewTruncatesSubCentDust() public pure {
        // Native balance of 1 USDC plus dust below the 6-decimal boundary:
        // the ERC-20 view floors it. The dust is NOT lost onchain.
        uint256 nativeWithDust = ONE_USDC_NATIVE + (UsdcUnits.SCALE - 1);
        assertEq(
            UsdcUnits.nativeToErc20(nativeWithDust),
            ONE_USDC_ERC20,
            "sub-cent dust must truncate in the 6-decimal view"
        );

        // Dust-only balance: balanceOf reads zero while native balance is not.
        uint256 dustOnly = UsdcUnits.SCALE - 1;
        assertEq(
            UsdcUnits.nativeToErc20(dustOnly),
            0,
            "balanceOf() == 0 does not prove the native balance is zero"
        );
        assertGt(dustOnly, 0, "the dust still exists onchain");
    }

    function testFuzz_RoundTripNeverInflates(uint256 erc20Amount) public pure {
        // Converting 6d -> 18d -> 6d must always return the original amount:
        // crediting a user based on mixed units must never create money.
        erc20Amount = bound(erc20Amount, 0, type(uint256).max / UsdcUnits.SCALE);
        assertEq(
            UsdcUnits.nativeToErc20(UsdcUnits.erc20ToNative(erc20Amount)),
            erc20Amount,
            "round-trip must be lossless for whole ERC-20 units"
        );
    }
}
