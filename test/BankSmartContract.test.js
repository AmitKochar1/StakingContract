const { default: Web3 } = require('web3');
import { tokens } from './helpers';

const NativeToken = artifacts.require('./Token')
const Staking = artifacts.require('./BankSmartContract')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Staking', ([deployer, investor, investor1, investor2]) => {
    const name = "Earth"
    const symbol = "ERTH"

    const decimals = '18'
    //const totalSupply = tokens(1000000).toString() 
    let nativeToken, staking

    beforeEach(async () => {
        nativeToken = await NativeToken.new()
        staking = await Staking.new(nativeToken.address)

        //token to farm
        await nativeToken.transfer(staking.address, tokens(15000), { from: deployer })

        // tokens to investors
        await nativeToken.transfer(investor, tokens(10000), { from: deployer })
        await nativeToken.transfer(investor1, tokens(8000), { from: deployer })
        await nativeToken.transfer(investor2, tokens(5000), { from: deployer })
    })
    // token deployment
    describe("Deployment", () => {
        let result
        it('Tracks the name, symbol and decimals', async () => {
            result = await nativeToken.name()
            result.should.equal(name)
            console.log('Token name is ' + result)

            result = await nativeToken.symbol()
            result.should.equal(symbol)
            console.log('Token symbol is ' + result)

            result = await nativeToken.decimals()
            result.toString().should.equal(decimals)
            console.log('Decimals are ' + result.toString())
        })
    })


    describe('Balance after / before, Approving and staking tokens', () => {
        let result
        it('staking testing', async () => {
            //Investor 0 Balance
            result = await nativeToken.balanceOf(investor)
            console.log('Investor 0 balance before staking ' + result.toString())
            result.toString().should.equal(tokens(10000).toString())

            //Investor 1 Balance
            result = await nativeToken.balanceOf(investor1)
            console.log('Investor 1 balance before staking ' + result.toString())
            result.toString().should.equal(tokens(8000).toString())

            result = await nativeToken.balanceOf(investor2)
            console.log('Investor 2 balance before staking ' + result.toString())
            result.toString().should.equal(tokens(5000).toString())

            // Investor 0 approving and Staking
            await nativeToken.approve(staking.address, tokens(10000), { from: investor })
            result = await nativeToken.approved(investor, staking.address, { from: investor })
            console.log('Investor 0 has approved ' + result.toString())
            /*result = await nativeToken.isApproved(staking.address, { from: investor })
            console.log(result)*/


            await staking.stake(tokens(9000), { from: investor })
            result = await staking.StakingbalanceOf(investor)
            console.log('Investor 0 staking balance ' + result.toString())
            result.toString().should.equal(tokens(9000).toString())

            // Investor 1 approving and Staking
            await nativeToken.approve(staking.address, tokens(8000), { from: investor1 })
            result = await nativeToken.approved(investor1, staking.address, { from: investor1 })
            console.log('Investor 1 has approved ' + result.toString())
            await staking.stake(tokens(7000), { from: investor1 })
            result = await staking.StakingbalanceOf(investor1)
            console.log('Investor 1 staking balance ' + result.toString())
            result.toString().should.equal(tokens(7000).toString())

            // Investor 2 approving and Staking
            await nativeToken.approve(staking.address, tokens(5000), { from: investor2 })
            result = await nativeToken.approved(investor2, staking.address, { from: investor2 })
            console.log('Investor 2 has approved ' + result.toString())
            await staking.stake(tokens(4000), { from: investor2 })
            result = await staking.StakingbalanceOf(investor2)
            console.log('Investor 2 staking balance ' + result.toString())
            result.toString().should.equal(tokens(4000).toString())

            //investor Balance after staking
            result = await nativeToken.balanceOf(investor)
            console.log('Investor 0 remaining balance: ' + result.toString())
            result = await nativeToken.balanceOf(investor1.toString())
            console.log('Investor 1 remaining balance: ' + result.toString())
            result = await nativeToken.balanceOf(investor2.toString())
            console.log('Investor 2 remaining balance: ' + result.toString())
            result.toString().should.equal(tokens(1000).toString())

            //Unstaking and rewrads to investors
            await staking.unStake(tokens(9000), { from: investor })
            result = await nativeToken.balanceOf(investor)
            //result = await staking.rewardOnePool(investor)
            console.log('Investor 0 balance after unstaking all tokens: ' + result.toString())
        })
    })
})