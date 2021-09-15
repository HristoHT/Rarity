pragma solidity 0.8.7;

contract rarity_mock {
    uint256 public next_summoner = 1;
    uint256 public summonCallCounter;

    function summon(uint _class) external {
        summonCallCounter++;
    }
}