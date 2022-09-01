const { ethers, getNamedAccounts } = require("hardhat")
const { lendingPoolAddressesProvider_Address, WETHTokenAddress, DAITokenAddress, chainLinkPriceFeed_DAIETH } = require("../helper-hardhat-config")
const { getWETH, AMOUNT } = require("../scripts/get-WETH")



async function main() {

    // Getting WETH from "../scripts/get-WETH.js"
    await getWETH()

    const { deployer } = await getNamedAccounts()

    // Aave "LendingPool" Contract.
    const lendingPool = await getLendingPool(deployer)

    console.log(`lending Pool Address : ${lendingPool.address}`)


// Deposit.
    console.log("Depositing......")

    // Depositing WETH Tokens.
    await wethDeposit(WETHTokenAddress, lendingPool, AMOUNT, deployer)

    // Getting "getUserAccountData" to check the 'updated status' of "totalDebtETH" and "availableBorrowsETH".
    let { totalDebtETH, availableBorrowsETH } = await getBorrowUserData(lendingPool, deployer)

    
    // Dai Price.
    const daiPrice = await getDaiPrice()

    // Our Collateral in Dai.
    const collateralToDai = (availableBorrowsETH * 0.95 * (1 / daiPrice)).toString()     // "0.95" means we are only using [95 %] of our "availableBorrowsETH", and "borrow" against it. 

    console.log(`Total Amount of DAI, That you can Borrow : ${collateralToDai} DAI`)

    // Our Collateral in Dai in terms of WEI.
    const collateralToDaiInWei = ethers.utils.parseEther(collateralToDai)

    console.log(`Total Amount of DAI in WEI, That you can Borrow : ${collateralToDaiInWei} DAI`)


// Borrow.
    console.log("Borrowing......")

    // Borrowing DAI Tokens.
    await borrowDai(DAITokenAddress, lendingPool, collateralToDaiInWei, deployer)

    // Getting "getUserAccountData" to check the 'updated status' of "totalDebtETH" and "availableBorrowsETH".
    await getBorrowUserData(lendingPool, deployer)


// Repay.
    console.log("Repaying......")

    // Repaying back DAI Tokens.
    await repayDai(DAITokenAddress, lendingPool, collateralToDaiInWei, deployer)

    // Getting "getUserAccountData" to check the 'updated status' of "totalDebtETH" and "availableBorrowsETH".
    await getBorrowUserData(lendingPool, deployer)
}


async function repayDai(daiAddress, lendingPool, amountToRepay, account) {

    await approveERC20Token(daiAddress, lendingPool.address, amountToRepay, account)  // We have to "approve" the "LendingPool" contract first, Everytime we "repay" to the Contract.

    const repayTx = await lendingPool.repay(daiAddress, amountToRepay, 1, account)

    await repayTx.wait(1)

    console.log("Repaid...!")
}


async function borrowDai(daiAddress, lendingPool, amountToBorrow, account) {

    const borrowTx = await lendingPool.borrow(daiAddress, amountToBorrow, 1, 0, account)

    await borrowTx.wait(1)

    console.log("Borrowed...!")
}


async function getDaiPrice() {

    const daiPrice = await ethers.getContractAt("AggregatorV3Interface", chainLinkPriceFeed_DAIETH) // We don't need a "Signer" because we are just reading from a blockchain.

    const { answer } = await daiPrice.latestRoundData()  // "answer" is one of the returning values from "latestRoundData" function in "AggregatorV3Interface" which returns "price of an asset".

    console.log(`The DAI/ETH conversion is : ${answer}`)

    return (answer)
}


async function getBorrowUserData(lendingPool, account) {

    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } = await lendingPool.getUserAccountData(account)

    console.log(`Total Collateral Amount is : ${totalCollateralETH} ETH`)
    console.log(`Total Debt is : ${totalDebtETH} ETH `)
    console.log(`The Amount you can Borrow, In your Collateral : ${availableBorrowsETH} ETH`)

    return { totalDebtETH, availableBorrowsETH }     // We don't have to return "totalCollateralETH".
}


async function wethDeposit(wethContractAddress, lendingPool, amountToDeposit, account) {

    await approveERC20Token(wethContractAddress, lendingPool.address, amountToDeposit, account)  // We have to "approve" the "LendingPool" contract first, Everytime we "deposit" in the Contract.

    const depositTx = await lendingPool.deposit(wethContractAddress, amountToDeposit, account, 0)

    await depositTx.wait(1)

    console.log("Deposited...!")
}


async function approveERC20Token(erc20TokenAddress, spenderAddress, amountToSpend, account) {

    const erc20Token = await ethers.getContractAt("IERC20", erc20TokenAddress, account)

    const tx = await erc20Token.approve(spenderAddress, amountToSpend)

    await tx.wait(1)

    console.log("Approved...!")
}


async function getLendingPool(account) {

    const lendingPoolAddressesProvider = await ethers.getContractAt("ILendingPoolAddressesProvider", lendingPoolAddressesProvider_Address, account)

    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()

    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)

    return lendingPool
}




main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error)
    process.exit(1)
})