const { default: Web3 } = require('web3')
import { tokens } from './helpers'

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
        await nativeToken.transfer(staking.address, tokens('15000'), { from: deployer })

        // tokens to investors
        await nativeToken.transfer(investor, tokens('10000'), { from: deployer })
        await nativeToken.transfer(investor1, tokens('8000'), { from: deployer })
        await nativeToken.transfer(investor2, tokens('5000'), { from: deployer })
    })
    // token deployment
    describe("Deployment", () => {
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

        /*it("Tracks total Supply", async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })*/
    })

    //staking coins by the investors

    describe('Checking the balance of investor', () => {
        let result
        /*it('investor balance', async () => {
            //let result
            result = await nativeToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('10000'), 'Balance is correct before staking')
        })*/

        it('investor balance', async () => {
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

    })

    describe('Approving tokens', () => {
        let result

        it('investor 1 approving his contract', async () => {
            //let address
            result = await nativeToken.approve(staking.address, tokens('10000'), { from: investor })
            //result.should.equal(tokens('10000').toString())
            result = await nativeToken.approve(staking.address, tokens('80000'), { from: investor1 })
            result = await nativeToken.approve(staking.address, tokens('50000'), { from: investor2 })
        })
    })
})