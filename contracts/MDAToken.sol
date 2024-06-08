// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MDAToken is ERC20, Ownable {
    using Address for address;
    using SafeMath for uint256;
    using SafeMath for uint8;
    using SafeMath for uint;

    uint8 private __decimals;

    constructor() ERC20 ("MetaDapp Token", "MDA") {
        __decimals = 18;
        _mint(_msgSender(), 10**6 * 10**__decimals);
    }

    function decimals() public view override returns(uint8){
        return __decimals;
    }
}