// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

interface IERC20 {

    function allowance(address owner, address spender) external view returns(uint256 remainingAllowance);
    
    function approve(address spender, uint256 amount) external returns(bool success);

    function increaseAllowance(address spender, uint256 addedAmount) external returns(bool success);

    function decreaseAllowance(address spender, uint256 subtractedAmount) external returns(bool success);

    function balanceOf(address account) external view returns(uint256 accountBalance);

    function name() external view returns(string memory tokenName);

    function symbol() external view returns(string memory tokenSymbol);

    function totalSupply() external view returns(uint256 tokensTotalSupply);

    function decimals() external view returns(uint8 decimalPlaces);

    function transfer(address to, uint256 amount) external returns(bool success);

    function transferFrom(address from, address to, uint256 amount) external returns(bool success);
    
}