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
        it('Tracks the name, sysmbol and decimals', async () => {
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

        it('Investors balance before staking', async () => {
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
        })

        it('investors approving contract and staking', async () => {

            // Investor 0 approving and Staking
            await nativeToken.approve(staking.address, tokens(10000), { from: investor })
            result = await nativeToken.approved(investor, staking.address, { from: investor })
            console.log('Investor 0 has approved ' + result.toString())
            /*result = await nativeToken.isApproved(staking.address, { from: investor })
            console.log(result)*/


            await staking.stake(tokens(9000), { from: investor })
            result = await staking.balanceOf(investor)
            console.log('Investor 0 staking balance ' + result.toString())
            result.toString().should.equal(tokens(9000).toString())

            // Investor 1 approving and Staking
            await nativeToken.approve(staking.address, tokens(8000), { from: investor1 })
            result = await nativeToken.approved(investor1, staking.address, { from: investor1 })
            console.log('Investor 1 has approved ' + result.toString())
            await staking.stake(tokens(7000), { from: investor1 })
            result = await staking.balanceOf(investor1)
            console.log('Investor 1 staking balance ' + result.toString())
            result.toString().should.equal(tokens(7000).toString())

            // Investor 2 approving and Staking
            await nativeToken.approve(staking.address, tokens(5000), { from: investor2 })
            result = await nativeToken.approved(investor2, staking.address, { from: investor2 })
            console.log('Investor 2 has approved ' + result.toString())
            await staking.stake(tokens(4000), { from: investor2 })
            result = await staking.balanceOf(investor2)
            console.log('Investor 2 staking balance ' + result.toString())
            result.toString().should.equal(tokens(4000).toString())

        })
        it('Investors balance after staking', async () => {
            result = await nativeToken.balanceOf(investor)
            console.log('Investor 0 balance: ' + result.toString())
            result = await nativeToken.balanceOf(investor1.toString())
            console.log('Investor 1 balance: ' + result.toString())
            result = await nativeToken.balanceOf(investor2.toString())
            console.log('Investor 2 balance: ' + result.toString())
            result.toString().should.equal(tokens(5000).toString())
        })
    })
    describe('Reward ', () => {
        let result, totalStake

        /*beforeEach(async () => {
             await staking.stake(tokens(9000), { from: investor })
             await staking.stake(tokens(7000), { from: investor1 })
             await staking.stake(tokens(4000), { from: investor2 })
         })*/

        it('Rewards to Investors', async () => {
            totalStake = tokens(20000)
            await staking.stake(tokens(9000), { from: investor })
            //await staking.poolOneReward(investor)
            result = await staking.rewardOnePool(staking.address, { from: investor })
            console.log(result.toString())
        })
    })
})