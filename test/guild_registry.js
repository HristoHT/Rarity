const guild_registry = artifacts.require("guild_registry");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("guild_registry", function ( accounts ) {
  it("test owner functionallity", async function () {
    const registryInstance = await guild_registry.new();

    assert.equal((await registryInstance.owner()).toString(), accounts[0]);

    await registryInstance.change_owner(accounts[1]);

    assert.equal((await registryInstance.owner()).toString(), accounts[1]);

    return assert.isTrue(true);
  });

  it("test registry functionallity", async function () {
    const registryInstance = await guild_registry.new();

    await registryInstance.update_register("rarity_gold", accounts[0]);

    assert.equal((await registryInstance.register("rarity_gold")).toString(), accounts[0]);

    await registryInstance.update_register("rarity_gold", accounts[1]);

    assert.equal((await registryInstance.register("rarity_gold")).toString(), accounts[1]); 

    return assert.isTrue(true);
  });
});
