pragma solidity 0.8.7;

import "./ERC721.sol";

interface rarity {
    function summon(uint _class) external;
    function next_summoner() external returns (uint);
}

interface gold {
    function transfer(uint from, uint to, uint amount) external returns (bool);
    function transferFrom(uint executor, uint from, uint to, uint amount) external returns (bool);
}

contract guild_treasury {
    uint256 public guild_treasury_summoner;

    rarity public rm;
    gold public gd;

    constructor(address rarity_address,
                address gold_address,
                address guild_address) {
        rm = rarity(rarity_address);
        gd = gold(gold_address);
        guild_treasury_summoner = rm.next_summoner();
        rm.summon(1);
    }
}