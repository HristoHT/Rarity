pragma solidity 0.8.7;

import "./ERC721.sol";

interface guild_share {

}

interface rarity {
    function summon(uint _class) external;
}

interface gold {
    function transfer(uint from, uint to, uint amount) external returns (bool);
    function transferFrom(uint executor, uint from, uint to, uint amount) external returns (bool);
}

contract guildERC721 is ERC721Enumerable, IERC721Metadata {
    function name() override external pure returns (string memory) {
        return "Guild";
    }

    function symbol() override external pure returns (string memory) {
        return "GLD";
    }

    function tokenURI(uint256 tokenId) override external pure returns (string memory) {
        return "";
    }

    function mint(address to) external {
        uint256 next_token_id = totalSupply();
        _safeMint(to, next_token_id);
    }
}