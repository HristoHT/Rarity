pragma solidity 0.8.7;

contract gold_mock {
    bool private return_value;
    uint256 public transferCallCounter;

    function transferReturnValue(bool value) external {
        return_value = value;
    }

    function transfer(uint256 from, uint256 guild_id, uint256 amount) external returns (bool) {
        transferCallCounter++;
        return return_value;
    }
}