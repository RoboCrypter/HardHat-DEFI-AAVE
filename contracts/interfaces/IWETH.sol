// SPDX-License-Identifier: MIT

pragma solidity ^0.4.19;

interface IWETH {

    function allowance(address owner, address spender) external view returns(uint256 remainingAllowance);

    function approve(address spender, uint256 amount) external returns(bool success);

    function balanceOf(address account) external view returns(uint256 accountBalance);

    function decimals() external view returns(uint8 decimalPlaces);

    function name() external view returns(string memory tokenName);

    function symbol() external view returns(string memory tokenSymbol);

    function totalSupply() external view returns(uint256 tokensTotalSupply);

    function transfer(address to, uint256 amount) external returns(bool success);

    function transferFrom(address from, address to, uint256 amount) external returns(bool success);

    function deposit() external payable;

    function withdraw(uint256 wad) external;
}
