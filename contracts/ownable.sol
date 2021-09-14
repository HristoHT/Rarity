pragma solidity 0.8.7;

contract ownable {
    address public owner;

    modifier onlyOwner() {
        require(owner == msg.sender, "ownable: only owner allowed");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function update_owner(address new_owner) public onlyOwner {
        owner = new_owner;
    }
}