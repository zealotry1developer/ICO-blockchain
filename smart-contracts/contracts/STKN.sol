// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract STKN is ERC20 {

    uint256 public totalAmount;
    
    mapping(address => uint256) public balOf;

    address public owner;

    constructor() ERC20("Staking Token", "STKN") {
        owner = msg.sender;
        _mint(msg.sender, 5000 * 1e18);
        totalAmount = balOf[msg.sender];
    }

    function mint(uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint tokens");
        balOf[owner] += amount;
        totalAmount += amount;
    }
}
