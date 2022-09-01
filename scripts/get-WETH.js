const { getNamedAccounts, ethers } = require("hardhat")
const { WETHTokenAddress } = require("../helper-hardhat-config")


const AMOUNT = ethers.utils.parseEther("0.02")


async function getWETH() {

    const { deployer } = await getNamedAccounts()

    const iWETH = await ethers.getContractAt("IWETH", WETHTokenAddress, deployer)

    const tx = await iWETH.deposit({value: AMOUNT})

    await tx.wait(1)

    const checkWETHBalance = (await iWETH.balanceOf(deployer)).toString()

    console.log(`Balance : ${checkWETHBalance} WETH`)
}


module.exports = { getWETH, AMOUNT }