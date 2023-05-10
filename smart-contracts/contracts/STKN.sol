// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STKN is ERC20 {

    constructor() ERC20("ICO", "ICO") {
        _mint(msg.sender, 5000 * 1e18);
    }

    function mint(address minter, uint value) public {
        _mint(minter, value * 1e18);
    }
}
