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

        let amount = tokens('10000')
        await nativeToken.transfer(staking.address, amount, { from: deployer })

        // tokens to investors
        amount = tokens('1000')
        await nativeToken.transfer(investor, amount, { from: deployer })
        await nativeToken.transfer(investor1, amount, { from: deployer })
        await nativeToken.transfer(investor2, amount, { from: deployer })
    })
    // token deployment
    describe("Deployment", () => {
        it('Tracks the name', async () => {
            const result = await token.name()
            result.should.equal(name)
        })

        it('Tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('Tracks the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        /*it("Tracks total Supply", async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })*/
    })

    //staking coins by the investors

    describe('investors staking coins', () => {
        it('investor staking', async () => {
            let amount = '500'
            const result = await staking.stake(amount, { from: investor })
            result.toString().should.equal(amount.toString())
        })
        it('investor1 staking', async () => {
            let amount = '600'
            const result = await staking.stake(amount, { from: investor1 })
            result.toString().should.equal(amount.toString())
        })
        it('investor2 staking', async () => {
            let amount = '700'
            const result = await staking.stake(amount, { from: investor2 })
            result.toString().should.equal(amount.toString())
        })

    })
})