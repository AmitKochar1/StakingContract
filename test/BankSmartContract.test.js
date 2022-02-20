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

        //let amount = tokens('10000')
        await nativeToken.transfer(staking.address, tokens(15000), { from: deployer })

        // tokens to investors
        await nativeToken.transfer(investor, tokens(10000), { from: deployer })
        await nativeToken.transfer(investor1, tokens(8000), { from: deployer })
        await nativeToken.transfer(investor2, tokens(5000), { from: deployer })
    })
    // token deployment
    /*describe("Deployment", () => {
        it('Tracks the name', async () => {
            const result = await nativeToken.name()
            result.should.equal(name)
        })

        it('Tracks the symbol', async () => {
            const result = await nativeToken.symbol()
            result.should.equal(symbol)
        })

        it('Tracks the decimals', async () => {
            const result = await nativeToken.decimals()
            result.toString().should.equal(decimals)
        })

        //it("Tracks total Supply", async () => {
        //const result = await token.totalSupply()
        // result.toString().should.equal(totalSupply.toString())
        //})
    })*/

    //staking coins by the investors

    /*describe('Checking the balance of investor', () => {
        let result*/
    /*it('investor balance', async () => {
        //let result
        result = await nativeToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('10000'), 'Balance is correct before staking')
    })*/

    /*it('investor balance', async () => {
        result = await nativeToken.balanceOf(investor)
        result.toString().should.equal(tokens('10000').toString())
    })

    it('investor1 balance', async () => {
        result = await nativeToken.balanceOf(investor1)
        result.toString().should.equal(tokens('8000').toString())
    })
    it('investor2 balance', async () => {
        result = await nativeToken.balanceOf(investor2)
        result.toString().should.equal(tokens('5000').toString())
    })
})*/


    describe('Balance after / before, Approving and staking tokens', () => {
        let result

        it('Investors balance before staking', async () => {
            //Investor 0 Balance
            result = await nativeToken.balanceOf(investor)
            console.log('Investor 0 balance before staking ' + result.toString())
            result.toString().should.equal(tokens(10000).toString())
        })

        it('investors approving contract and staking', async () => {
            // Investor 0 approving and Staking
            await nativeToken.approve(staking.address, tokens(10000), { from: investor })

            //result.should.equal(bool, true)
            await staking.stake(tokens(9000), { from: investor })
            result = await staking.balanceOf(investor)
            console.log('Investor 0 staking balance ' + result.toString())
            result.toString().should.equal(tokens(9000).toString())
            result = await staking.isApproved(investor)
            console.log(result)
            // /\result.should.equal('true')

            // Investor 1 approving and Staking
            await nativeToken.approve(staking.address, tokens(8000), { from: investor1 })
            await staking.stake(tokens(7000), { from: investor1 })
            result = await staking.balanceOf(investor1)
            console.log('Investor 1 staking balance ' + result.toString())
            result.toString().should.equal(tokens(7000).toString())

            // Investor 2 approving and Staking
            await nativeToken.approve(staking.address, tokens(5000), { from: investor2 })
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
            result.toString().should.equal(tokens('5000').toString())
        })
    })
})