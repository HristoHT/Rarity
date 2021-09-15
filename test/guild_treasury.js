const guild_treasury = artifacts.require("guild_treasury");
const guild_registry = artifacts.require("guild_registry");

// Mock contracts
const rarity_mock = artifacts.require("rarity_mock");
const gold_mock = artifacts.require("gold_mock");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const setUp = async () => {
  const mockGoldInstance = await gold_mock.new();
  const mockRarityInstance = await rarity_mock.new();
  const guildRegistryInstance = await guild_registry.new();

  await guildRegistryInstance.update_register("gold_dao", mockGoldInstance.address);
  await guildRegistryInstance.update_register("rarity", mockRarityInstance.address);

  const guildTreasuryInstance = await guild_treasury.new(guildRegistryInstance.address);

  return [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance];
}

contract("guild_treasury", function (/* accounts */) {
  it("summoning hero on initilization", async function () {
    [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance] = await setUp();

    const constants = {
      guild_treasury_summoner: 1
    }

    // test
    assert.equal((await guildTreasuryInstance.guild_treasury_summoner()).toNumber(), constants.guild_treasury_summoner);
    assert.equal((await mockRarityInstance.summonCallCounter()).toNumber(), 1);

    return assert.isTrue(true);
  });

  it("successful deposit", async function () {
    [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance] = await setUp();

    // conditions
    await mockGoldInstance.transferReturnValue(true);

    // test
    const constants = {
      guild_id: 2,
      amount: 10
    }

    await guildTreasuryInstance.depositToGuild(1, constants.guild_id, constants.amount);

    assert.equal((await mockGoldInstance.transferCallCounter()).toNumber(), 1);
    assert.equal((await guildTreasuryInstance.guilds_treasury(constants.guild_id)).toNumber(), constants.amount);

    return assert.isTrue(true);
  });

  it("successful widrawl", async function () {
    [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance] = await setUp();

    const constants = {
      guild_id: 2,
      amountIn: 10,
      amountOut: 5
    }

    // conditions
    await mockGoldInstance.transferReturnValue(true);
    await guildTreasuryInstance.depositToGuild(1, constants.guild_id, constants.amountIn);

    // test
    await guildTreasuryInstance.widrawFromGuild(constants.guild_id, 1, constants.amountOut);

    assert.equal((await mockGoldInstance.transferCallCounter()).toNumber(), 2);
    assert.equal((await guildTreasuryInstance.guilds_treasury(constants.guild_id)).toNumber(), constants.amountIn - constants.amountOut);

    return assert.isTrue(true);
  });

  it("deposit fail", async function () {
    [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance] = await setUp();

    // conditions
    const constants = {
      guild_id: 2,
      amount: 10
    }

    await mockGoldInstance.transferReturnValue(false);

    // test

    try {
      await guildTreasuryInstance.depositToGuild(1, constants.guild_id, constants.amount);
      assert.isTrue(false, "Must revert transaction");
    } catch {
      assert.isTrue(true);
    }

    assert.equal((await mockGoldInstance.transferCallCounter()).toNumber(), 0);
    assert.equal((await guildTreasuryInstance.guilds_treasury(constants.guild_id)).toNumber(), 0);

    return assert.isTrue(true);
  });

  it("widrawl fail - insuficient funds in guild", async function () {
    [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance] = await setUp();

    const constants = {
      guild_id: 2,
      amountIn: 10,
      amountOut: 15
    }

    // conditions
    await mockGoldInstance.transferReturnValue(true);
    await guildTreasuryInstance.depositToGuild(1, constants.guild_id, constants.amountIn);

    // test
    try {
      await guildTreasuryInstance.widrawFromGuild(constants.guild_id, 1, constants.amountOut);
      assert.isTrue(false, "Must revart transaction");
    } catch {
      assert.isTrue(true);
    }

    assert.equal((await mockGoldInstance.transferCallCounter()).toNumber(), 1);
    assert.equal((await guildTreasuryInstance.guilds_treasury(constants.guild_id)).toNumber(), constants.amountIn);

    return assert.isTrue(true);
  });

  it("widrawl fail - invalid transfer", async function () {
    [guildTreasuryInstance, guildRegistryInstance, mockRarityInstance, mockGoldInstance] = await setUp();

    const constants = {
      guild_id: 2,
      amountIn: 10,
      amountOut: 5
    }

    // conditions
    await mockGoldInstance.transferReturnValue(true);
    await guildTreasuryInstance.depositToGuild(1, constants.guild_id, constants.amountIn);
    await mockGoldInstance.transferReturnValue(false);

    // test
    try {
      await guildTreasuryInstance.widrawFromGuild(constants.guild_id, 1, constants.amountOut);
      assert.isTrue(false, "Must revart transaction");
    } catch {
      assert.isTrue(true);
    }

    assert.equal((await mockGoldInstance.transferCallCounter()).toNumber(), 1);
    assert.equal((await guildTreasuryInstance.guilds_treasury(constants.guild_id)).toNumber(), constants.amountIn);

    return assert.isTrue(true);
  });
});
