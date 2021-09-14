const guild = artifacts.require("guild");
const guildERC721 = artifacts.require("guildERC721");
const rarity_c = artifacts.require("rarity_c");
const rarity_gold = artifacts.require("rarity_gold");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("guild", function ( accounts ) {
  it("playground", async function () {
    const guildShareInstance = await guild.deployed();
    const guildERC721Instance = await guildERC721.deployed();
    const rarityInstance = await rarity_c.deployed();

    await guildERC721Instance.mint(accounts[0]);
    assert.equal(await guildERC721Instance.totalSupply(), 1);

    await guildERC721Instance.safeTransferFrom(accounts[0], guildShareInstance.address, 0);
    console.log(await guildShareInstance.internal_erc721_id());
    console.log(await guildShareInstance.guild_shares(0, accounts[0]));

    console.log((await guildShareInstance.guild_treasury_summoner()).toNumber());
  });

  it("should summon hero on initiliazation", async () => {
    const rarityInstance = await rarity_c.deployed();
    const goldInstance = await rarity_gold.deployed();
    await rarityInstance.summon(1);
    await rarityInstance.summon(1);
    await rarityInstance.summon(1);

    const guildInstance = await guild.new(rarityInstance.address, goldInstance.address);

    assert.equal((await guildInstance.guild_treasury_summoner()).toNumber(), 4);
  });
});
