// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Usdc, IUsdcErc20} from "../src/Usdc.sol";
import {UsdcUnits} from "../src/UsdcUnits.sol";
import {NaiveEthereumPort} from "../src/examples/NaiveEthereumPort.sol";

/// @title Usdc library tests + naive-port failure documentation
contract UsdcTest is Test {
    uint256 private constant ONE_ERC20 = 1e6;
    uint256 private constant ONE_NATIVE = 1e18;

    // ── Unit / fee helpers ──────────────────────────────────────────────

    function test_FromWholeAndToWhole() public pure {
        assertEq(Usdc.fromWhole(12), 12e6);
        assertEq(Usdc.toWhole(12e6), 12);
        assertEq(Usdc.toWhole(12e6 + 999_999), 12);
    }

    function test_FeeErc20AtFloor() public pure {
        // 21_000 gas * 20 gwei = 420_000 gwei = 4.2e14 wei native
        // / 1e12 = 420 ERC-20 micro-units (0.00042 USDC)
        uint256 fee = Usdc.feeErc20(21_000, Usdc.MIN_MAX_FEE_PER_GAS);
        assertEq(fee, 420);
        assertEq(Usdc.MIN_MAX_FEE_PER_GAS, 20 gwei);
    }

    function test_NativeCoversErc20() public pure {
        assertTrue(Usdc.nativeCoversErc20(ONE_NATIVE, ONE_ERC20));
        assertFalse(Usdc.nativeCoversErc20(ONE_NATIVE - 1, ONE_ERC20));
        // Naive comparison would incorrectly treat 1e6 wei as enough for 1 USDC:
        assertTrue(NaiveEthereumPort.naiveValueCoversErc20(ONE_ERC20, ONE_ERC20));
        assertFalse(Usdc.nativeCoversErc20(ONE_ERC20, ONE_ERC20));
    }

    function test_AssertSameUnitFamilyRevertsOnMix() public {
        vm.expectRevert(Usdc.UsdcMixedUnits.selector);
        this.externalAssertMixed(ONE_NATIVE, ONE_ERC20);
    }

    function externalAssertMixed(uint256 a, uint256 b) external pure {
        Usdc.assertSameUnitFamily(a, b, true, false);
    }

    function test_AssertSameUnitFamilyOkWhenMatched() public pure {
        Usdc.assertSameUnitFamily(ONE_NATIVE, 2 * ONE_NATIVE, true, true);
        Usdc.assertSameUnitFamily(ONE_ERC20, 2 * ONE_ERC20, false, false);
    }

    // ── Naive port: these assertions document breakage ──────────────────

    function test_NaiveMsgValueComparisonIsWrongBy1e12() public pure {
        // Paying "1 USDC" as msg.value = 1e18 is correct natively.
        // A naive port often checks msg.value >= 1e6 (ERC-20 literal).
        assertTrue(NaiveEthereumPort.naiveValueCoversErc20(1e6, ONE_ERC20));
        // That accepts ~0.000000000001 USDC as if it were 1 USDC.
        assertEq(UsdcUnits.nativeToErc20(1e6), 0);
        assertFalse(Usdc.nativeCoversErc20(1e6, ONE_ERC20));
    }

    function test_NaiveDoubleCountInflatesBalance() public pure {
        // Same economic 1 USDC seen twice:
        uint256 native = ONE_NATIVE;
        uint256 erc20 = ONE_ERC20;
        uint256 naive = NaiveEthereumPort.naiveTotalBalance(native, erc20);
        // Inflated by ~1e18 — orders of magnitude too large for UI/accounting.
        assertGt(naive, ONE_NATIVE);
        assertEq(UsdcUnits.nativeToErc20(native), erc20);
    }

    function test_NaiveEmptyCheckMissesDust() public pure {
        uint256 dustNative = UsdcUnits.SCALE - 1; // invisible to ERC-20 view
        uint256 erc20View = UsdcUnits.nativeToErc20(dustNative);
        assertTrue(NaiveEthereumPort.naiveIsEmpty(erc20View));
        assertGt(dustNative, 0);
    }

    // ── Transfer guards via mockCall ────────────────────────────────────

    function test_TransferRejectsZeroAddress() public {
        vm.expectRevert(Usdc.UsdcZeroAddress.selector);
        this.externalTransfer(address(0), ONE_ERC20);
    }

    function externalTransfer(address to, uint256 amount) external {
        Usdc.transfer(to, amount);
    }

    function test_RequireBalanceRevertsWhenShort() public {
        vm.mockCall(
            Usdc.TOKEN,
            abi.encodeWithSelector(IUsdcErc20.balanceOf.selector, address(this)),
            abi.encode(uint256(100))
        );
        vm.expectRevert(abi.encodeWithSelector(Usdc.UsdcInsufficientBalance.selector, uint256(100), ONE_ERC20));
        this.externalRequireBalance(address(this), ONE_ERC20);
    }

    function externalRequireBalance(address account, uint256 required) external view {
        Usdc.requireBalance(account, required);
    }

    function test_RequireBalancePassesWhenEnough() public {
        vm.mockCall(
            Usdc.TOKEN,
            abi.encodeWithSelector(IUsdcErc20.balanceOf.selector, address(this)),
            abi.encode(ONE_ERC20)
        );
        this.externalRequireBalance(address(this), ONE_ERC20);
        assertTrue(Usdc.hasAtLeast(address(this), ONE_ERC20));
    }

    function test_TransferCallsToken() public {
        address recipient = address(0xBEEF);
        vm.mockCall(
            Usdc.TOKEN,
            abi.encodeWithSelector(IUsdcErc20.transfer.selector, recipient, ONE_ERC20),
            abi.encode(true)
        );
        Usdc.transfer(recipient, ONE_ERC20);
    }

    function testFuzz_FeeErc20MatchesNativeScale(uint64 gasLimit, uint64 feePerGas) public pure {
        gasLimit = uint64(bound(gasLimit, 21_000, 5_000_000));
        feePerGas = uint64(bound(feePerGas, 20 gwei, 200 gwei));
        uint256 nativeCost = uint256(gasLimit) * uint256(feePerGas);
        assertEq(Usdc.feeErc20(gasLimit, feePerGas), UsdcUnits.nativeToErc20(nativeCost));
    }
}
