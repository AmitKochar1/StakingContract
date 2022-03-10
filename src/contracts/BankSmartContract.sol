// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "./Token.sol";

/* things we need to build the staking system:
1. Token contract - import from openzeppelin,
2. Mapping to track the stakeholders, rewards, stakes (staking amount)
3. A reward system
*/

contract BankSmartContract {
    uint256 public reward = 1000 * 1e18; // 1000 in rewards - farm supply
    address public owner;
    uint256 public time;
    uint256 public totalStakeBalance;
    uint256 public amount;
    uint256 private duration = 60 seconds;
    uint256 private poolOneTime = 86400 seconds; // Reward can be claimed after 1 day.
    uint256 private poolTwoTime = 172800 seconds; // Reward can be claimed after 2 days.
    uint256 private totalStakedTime;

    address[] public hasApproved;

    //Balances of the users -
    mapping(address => uint256) public StakingbalanceOf;
    mapping(address => uint256) public rewardBalance;
    mapping(address => bool) public isStaking;
    //mapping(address => bool) approved;
    //address[] public hasApproved;
    mapping(address => bool) public isApproved;
    mapping(address => uint256) public stakeTime;

    event Stake(address indexed sender, uint256 amount);
    event UnStake(address indexed sender, uint256 amount);
    Token public token;

    constructor(Token _token) {
        token = _token;
        owner = msg.sender;
        time = block.timestamp;
        //totalStake += amount;
    }

    modifier checkBalance(uint256 _amount) {
        require(_amount > 0, "amount should be bigger than 0");
        _;
    }

    function stake(uint256 _amount) public payable checkBalance(_amount) {
        //require(_amount > 0, "amount should be bigger than 0");
        require(msg.sender != address(0), "Bank cannot deposit to pool");

        //this can be used but wont be neccessary, uncomment if you wish to use.
        if (isApproved[msg.sender] = false) {
            token.approve(address(this), _amount);
            hasApproved.push(msg.sender);
            isApproved[msg.sender] = true;
        }

        token.transferFrom(msg.sender, address(this), _amount);

        //update the user's balance
        isApproved[msg.sender] = true;
        StakingbalanceOf[msg.sender] += _amount;
        isStaking[msg.sender] = true;
        stakeTime[msg.sender] = block.timestamp;
        totalStakeBalance += amount;

        //emit to notify the change onto blockchain
        emit Stake(msg.sender, _amount);
    }

    function unStake(uint256 _amount) public payable {
        uint256 balance = StakingbalanceOf[msg.sender];
        require(isStaking[msg.sender] = true, "You wish");
        require(0 < balance, "No tokens to unstake");
        uint256 rewards;
        uint256 amountUnStake;

        if (totalStakedTime > poolOneTime) {
            rewards = poolOneReward(msg.sender);
            amountUnStake = balance + rewards;
            totalStakeBalance -= balance;
        } else if (totalStakedTime > poolTwoTime) {
            rewards = poolTwoReward(msg.sender);
            amountUnStake = balance + rewards;
            totalStakeBalance -= balance;
        } else {
            rewards = poolThirdReward(msg.sender);
            amountUnStake = balance + rewards;
            totalStakeBalance -= balance;
        }

        if (0 < StakingbalanceOf[msg.sender]) {
            isStaking[msg.sender] = true;
        } else {
            isStaking[msg.sender] = false;
            token.transfer(msg.sender, _amount);
            totalStakeBalance -= amount;
        }

        //StakingbalanceOf[msg.sender] += rewardOne;

        emit UnStake(msg.sender, _amount);
    }

    //internal view to public for testing
    function poolOneReward(address _user) public returns (uint256) {
        //pool 1 - Time 1 day
        uint256 percentage = 100;
        uint256 poolWeight = 20;
        uint256 poolOneSupply = ((totalStakeBalance) * (poolWeight)) /
            (percentage);
        uint256 userAllocation = (StakingbalanceOf[_user] /
            (totalStakeBalance)) * (percentage);
        uint256 rewardOne = (poolOneSupply * (userAllocation)) / (percentage);
        //rewardOnePool[msg.sender] += rewardOne;
        uint256 totalReward = rewardOne;
        return totalReward;
    }

    function poolTwoReward(address _user) public returns (uint256) {
        //pool 2 - Time 2 day
        uint256 previousReward = poolOneReward(_user);
        uint256 percentage = 100;
        uint256 poolWeight = 30;
        uint256 poolTwoSupply = ((totalStakeBalance) * (poolWeight)) /
            (percentage);
        uint256 userAllocation = (StakingbalanceOf[_user] /
            (totalStakeBalance)) * (percentage);
        uint256 rewardTwo = (poolTwoSupply * (userAllocation)) / (percentage);
        uint256 totalReward = rewardTwo + previousReward;
        return totalReward;
    }

    function poolThirdReward(address _user) public returns (uint256) {
        //pool 3 - Time 3 day
        uint256 previousReward = poolTwoReward(_user);
        uint256 percentage = 100;
        uint256 poolWeight = 50;
        uint256 poolThirdSupply = ((totalStakeBalance) * (poolWeight)) /
            (percentage);
        uint256 userAllocation = (StakingbalanceOf[_user] /
            (totalStakeBalance)) * (percentage);
        uint256 rewardThird = (poolThirdSupply * (userAllocation)) /
            (percentage);
        uint256 totalReward = rewardThird + previousReward;
        return totalReward;
    }
}
