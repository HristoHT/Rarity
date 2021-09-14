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

contract guild is IERC721Receiver {
    uint256 public internal_erc721_id;
    mapping(uint256 => uint256) public internal_id_to_erc721_id;
    mapping(uint256 => address) public erc721_parent_contract;
    mapping(uint256 => uint256) public guild_total_shares;
    mapping(uint256 => mapping(address => uint256)) public guild_shares;
    mapping(uint256 => string) public guild_names;
    uint public guild_treasury_summoner;

    uint256 initial_guild_shares = 1000;

    rarity private rm;
    gold private gd;

    constructor(address rarity_address, address gold_address) {
        rm = rarity(rarity_address);
        gd = gold(gold_address);
        guild_treasury_summoner = rm.next_summoner();
        rm.summon(1);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        uint256 new_guild_id = internal_erc721_id;
        internal_id_to_erc721_id[new_guild_id] = tokenId;
        erc721_parent_contract[new_guild_id] = msg.sender;
        guild_shares[new_guild_id][operator] = initial_guild_shares;
        guild_total_shares[new_guild_id] = initial_guild_shares;
        internal_erc721_id++;
        return 0x150b7a02;
    }

    function guild_name(uint256 guild_id, string memory name) external {
        require(guild_total_shares[guild_id] == guild_shares[guild_id][msg.sender], "guild_share: To set name of the guild you have to have 100% of its shares");
        guild_names[guild_id] = name;
    }
}