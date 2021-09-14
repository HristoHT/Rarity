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
    uint256 public internal_erc721_id = 1;
    mapping(uint256 => uint256) public internal_id_to_erc721_id;
    mapping(uint256 => address) public erc721_parent_contract;
    mapping(uint256 => string) public guild_names;
    uint public guild_treasury_summoner;

    uint256 initial_guild_shares = 1000;

    rarity public rm;
    gold public gd;

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
        internal_erc721_id++;
        return 0x150b7a02;
    }
}