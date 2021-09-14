pragma solidity 0.8.7;

interface IERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

contract guild_registry is IERC165 {
    mapping(string => address) public register;
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

    function update_register(string calldata name, address location) external onlyOwner {
        register[name] = location;
    }

    function supportsInterface(bytes4 interfaceID) override external view returns (bool) {
        return guild_registry(address(this)).update_register.selector ^ guild_registry(address(this)).register.selector == interfaceID;
    }
}