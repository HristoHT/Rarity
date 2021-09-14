pragma solidity 0.8.7;

contract guild_registry {
    mapping(string => address) registry;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "guild_registry: only owner allowed");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function change_owner(address new_owner) external onlyOwner {
        owner = new_owner;
    }

    function regiister(string calldata name, address location) external onlyOwner {
        registry[name] = location;
    }
}