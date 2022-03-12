// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "./Token.sol";

contract BankSmartContract {
    uint256 totalFarmSupply = 10000 * 1e18; // 10,000 in rewards - farm supply
    address public owner;
    uint256 public lockPeriod;
    uint256 public totalStakeBalance;
    uint256 public amount;

    uint256 private duration = 60 seconds; // No deposit/withdraw for 60 seconds after the staking.
    uint256 private poolOneTime = 86400 seconds; // lock period for pool one.
    uint256 private poolTwoTime = 172800 seconds; // lock period for pool two.
    uint256 private poolThirdTime = 259200 seconds; // lock period for pool three;
    uint256 private totalStakedTime;

    mapping(address => uint256) public stakingBalanceOf;
    mapping(address => uint256) public rewardBalance;
    mapping(address => bool) public isStaking;
    //mapping(address => bool) hasStaked;
    address[] public stakers;
    uint256 stakerCount;
    mapping(address => uint256) public stakeTime; //start time

    //Approved mapping and array, refer to line 58.
    /*mapping(address => bool) approved;
    mapping(address => bool) public isApproved;
    address[] public hasApproved;*/

    event Stake(address indexed sender, uint256 amount);
    event UnStake(address indexed sender, uint256 amount);
    Token public token;

    constructor(Token _token) {
        token = _token;
        owner = msg.sender;
        lockPeriod = block.timestamp + duration;
    }

    modifier checkBalance(uint256 _amount, address _address) {
        require(_amount > 0, "amount should be bigger than 0");
        require(_address != address(0), "Bank cannot deposit to pool");
        _;
    }

    function stake(uint256 _amount)
        public
        payable
        checkBalance(_amount, msg.sender)
    {
        //require(msg.sender != address(0), "Bank cannot deposit to pool");
        require(
            lockPeriod >= block.timestamp,
            "No more deposit allowed for 60 seconds"
        );

        //this can be used but wont be neccessary, uncomment if you wish to use. refer to line 35.
        /*if (isApproved[msg.sender] = false) {
            token.approve(address(this), _amount);
            hasApproved.push(msg.sender);
            isApproved[msg.sender] = true;
        }*/

        token.transferFrom(msg.sender, address(this), _amount);

        //update the user's balance
        if (!isStaking[msg.sender]) {
            stakers.push(msg.sender);
            stakerCount++;
        }
        isStaking[msg.sender] = true;
        stakingBalanceOf[msg.sender] += _amount;
        stakeTime[msg.sender] = block.timestamp;
        totalStakeBalance += stakingBalanceOf[msg.sender];

        emit Stake(msg.sender, _amount);
    }

    function unStake() public payable {
        uint256 balance = stakingBalanceOf[msg.sender];
        require(isStaking[msg.sender] = true, "You wish");
        require(0 < balance, "No tokens to unstake");
        uint256 rewards;
        uint256 totalAmount;

        totalStakedTime = block.timestamp - stakeTime[msg.sender];

        if (totalStakedTime >= poolOneTime) {
            rewards = poolOneReward(msg.sender);
            totalAmount = balance + rewards;
            token.transfer(msg.sender, totalAmount);
            totalFarmSupply -= rewards;
            totalStakeBalance -= balance;
            isStaking[msg.sender] = false;
            stakerCount--;

            emit UnStake(msg.sender, totalAmount);
        } else if (totalStakedTime >= poolTwoTime) {
            rewards = poolTwoReward(msg.sender);
            totalAmount = balance + rewards;
            token.transfer(msg.sender, totalAmount);
            totalFarmSupply -= rewards;
            totalStakeBalance -= balance;
            isStaking[msg.sender] = false;
            stakerCount--;

            emit UnStake(msg.sender, totalAmount);
        } else if (totalStakedTime >= poolTwoTime) {
            rewards = poolThirdReward(msg.sender);
            totalAmount = balance + rewards;
            token.transfer(msg.sender, totalAmount);
            totalFarmSupply -= rewards;
            totalStakeBalance -= balance;
            isStaking[msg.sender] = false;
            stakerCount--;

            emit UnStake(msg.sender, totalAmount);
        }
    }

    //internal view to public for testing
    function poolOneReward(address _user) internal view returns (uint256) {
        //pool 1 - Time 1 day
        uint256 percentage = 100;
        uint256 poolWeight = 20;
        uint256 poolOneSupply = ((totalFarmSupply) * (poolWeight)) /
            (percentage);
        uint256 userAllocation = (stakingBalanceOf[_user] /
            (totalStakeBalance)) * (percentage);
        uint256 rewardOne = (poolOneSupply * (userAllocation)) / (percentage);
        uint256 totalReward = rewardOne;
        return totalReward;
    }

    function poolTwoReward(address _user) internal view returns (uint256) {
        //pool 2 - Time 2 day
        uint256 previousReward = poolOneReward(_user);
        uint256 percentage = 100;
        uint256 poolWeight = 30;
        uint256 poolTwoSupply = ((totalFarmSupply) * (poolWeight)) /
            (percentage);
        uint256 userAllocation = (stakingBalanceOf[_user] /
            (totalStakeBalance)) * (percentage);
        uint256 rewardTwo = (poolTwoSupply * (userAllocation)) / (percentage);
        uint256 totalReward = rewardTwo + previousReward;
        return totalReward;
    }

    function poolThirdReward(address _user) internal view returns (uint256) {
        //pool 3 - Time 3 day
        uint256 previousReward = poolTwoReward(_user);
        uint256 percentage = 100;
        uint256 poolWeight = 50;
        uint256 poolThirdSupply = ((totalFarmSupply) * (poolWeight)) /
            (percentage);
        uint256 userAllocation = (stakingBalanceOf[_user] /
            (totalStakeBalance)) * (percentage);
        uint256 rewardThird = (poolThirdSupply * (userAllocation)) /
            (percentage);
        uint256 totalReward = rewardThird + previousReward;
        return totalReward;
    }
}
