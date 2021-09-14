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

contract guild_members is has_registry {
    mapping(uint256 => uint256) public guild_member_capacity;
    mapping(uint256 => uint256) public members_in_guild;
    mapping(uint256 => uint256) public guild_member;
    uint256 public guild_counter = 0;
    uint256 public default_guild_capacity = 5;
    uint256 public guild_treasury_summoner;

     string private constant rarity_contract_name = "rarity";
    function rm() internal view returns (rarity) {
        return rarity(reg.register(rarity_contract_name));
    }

    string private constant gold_contract_name = "gold";
    function gd() internal view returns (gold) {
        return gold(reg.register(gold_contract_name));
    }

    constructor(address registry_address) has_registry(registry_address) {
        guild_treasury_summoner = rm().next_summoner();
        rm().summon(1);
    }

    function create_guild(uint256 guild_id, uint256 hero) external {
        guild_member_capacity[guild_id] = default_guild_capacity;
        guild_member[hero] = guild_id; 
        members_in_guild[guild_id] += 1;
        guild_counter += 1;
    }
}