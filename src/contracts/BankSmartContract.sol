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
    uint256 public totalStake;
    uint256 public amount;
    //Balances of the users -
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public isStaking;
    mapping(address => bool) public isApproved;
    mapping(address => uint256) public rewardBalance;
    mapping(address => uint256) public stakeTime;

    event Stake(address indexed sender, uint256 amount);
    event UnStake(address indexed sender, uint256 amount);
    Token public token;

    // contructor
    constructor(Token _token) {
        token = _token;
        owner = msg.sender;
        time = block.timestamp;
        //totalStake += amount;
    }

    //stake function
    function stake(uint256 _amount) public payable {
        require(_amount > 0, "amount should be bigger than 0");

        if (isApproved[msg.sender] == false) {
            token.approve(address(this), _amount);
        }
        token.transferFrom(msg.sender, address(this), _amount);
        //update the user's balance
        isApproved[msg.sender] == true;
        balanceOf[msg.sender] += _amount;
        isStaking[msg.sender] == true;
        stakeTime[msg.sender] = block.timestamp;
        totalStake += amount;

        //emit to notify the chanhe onto blockchain
        emit Stake(msg.sender, _amount);
    }

    function unStake(uint256 _amount) public payable {
        require(isStaking[msg.sender] == true, "You wish");
        balanceOf[msg.sender] -= _amount;
        if (balanceOf[msg.sender] > 0) {
            isStaking[msg.sender] == true;
        }
        isStaking[msg.sender] == false;
        token.transfer(msg.sender, _amount);
        totalStake -= amount;

        emit UnStake(msg.sender, _amount);
    }

    function poolOneReward(address _user) internal view returns (uint256) {
        //pool 1 - Time 1 day
        uint256 percentage = 100;
        uint256 poolWeight = 20;
        uint256 poolOneSupply = ((totalStake) * (poolWeight)) / (percentage);
        uint256 userAllocation = (balanceOf[_user] / (totalStake)) *
            (percentage);
        uint256 rewardOne = (poolOneSupply * (userAllocation)) / (percentage);
        return rewardOne;
    }

    function poolTwoReward(address _user) internal view returns (uint256) {
        //pool 1 - Time 1 day
        uint256 previousReward = poolOneReward(_user);
        uint256 percentage = 100;
        uint256 poolWeight = 30;
        uint256 poolTwoSupply = ((totalStake) * (poolWeight)) / (percentage);
        uint256 userAllocation = (balanceOf[_user] / (totalStake)) *
            (percentage);
        uint256 rewardTwo = (poolTwoSupply * (userAllocation)) / (percentage);
        uint256 totalReward = rewardTwo + previousReward;
        return totalReward;
    }

    function poolThirdReward(address _user) internal view returns (uint256) {
        //pool 1 - Time 1 day
        uint256 previousReward = poolTwoReward(_user);
        uint256 percentage = 100;
        uint256 poolWeight = 50;
        uint256 poolThirdSupply = ((totalStake) * (poolWeight)) / (percentage);
        uint256 userAllocation = (balanceOf[_user] / (totalStake)) *
            (percentage);
        uint256 rewardThird = (poolThirdSupply * (userAllocation)) /
            (percentage);
        uint256 totalReward = rewardThird + previousReward;
        return totalReward;
    }
}
