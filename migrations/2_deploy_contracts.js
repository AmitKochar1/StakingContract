const { default: Web3 } = require("web3");

const Token = artifacts.require("Token");
const BankSmartContract = artifacts.require("BankSmartContract");


module.exports = async function (deployer) {
    //const accounts = await web3.eth.getAccounts()
    await deployer.deploy(Token);
    const address = Token.address;
    console.log("This is the contract address: " + address);
    await deployer.deploy(BankSmartContract, address);
};