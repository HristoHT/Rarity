pragma solidity 0.8.7;

import "./ERC721.sol";

interface rarity {
    function summon(uint _class) external;
    function next_summoner() external returns (uint);
}

interface gold {
    function transfer(uint from, uint to, uint amount) external returns (bool);
}

contract guild_treasury is has_registry {
    mapping (uint256 => uint256) public guilds_treasury;
    uint256 public guild_treasury_summoner;

    string private constant rarity_contract_name = "rarity";
    function rm() internal view returns (rarity) {
        return rarity(reg.register(rarity_contract_name));
    }

    string private constant gold_contract_name = "gold_dao";
    function gd() internal view returns (gold) {
        return gold(reg.register(gold_contract_name));
    }

    constructor(address registry_address) has_registry(registry_address) {
        guild_treasury_summoner = rm().next_summoner();
        rm().summon(1);
    }

    function depositToGuild(uint256 from, uint256 guild_id, uint256 amount) external returns(bool) {
        require(gd().transfer(from, guild_treasury_summoner, amount), "guild_treasury: invalid transfer");
        guilds_treasury[guild_id] += amount;
        return true;
    }

    function widrawFromGuild(uint256 guild_id, uint256 to, uint256 amount) external returns(bool) {
        require(amount <= guilds_treasury[guild_id], "guild_treasury: insufitient funds");
        require(gd().transfer(guild_treasury_summoner, to, amount), "guild_treasury: invalid transfer");
        guilds_treasury[guild_id] -= amount;
        return true;
    }
}