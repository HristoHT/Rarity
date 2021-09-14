const has_registry = artifacts.require("has_registry");
const guild_registry = artifacts.require("guild_registry");
const ownable = artifacts.require("ownable");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("has_registry", function (accounts) {
  it("test initial registry", async function () {
    const guildRegistryInstance = await guild_registry.new();
    const hasRegistryInstance = await has_registry.new(guildRegistryInstance.address);

    assert((await hasRegistryInstance.reg()).toString(), guildRegistryInstance.address);

    return assert.isTrue(true);
  });

  it("test updating registry", async function () {
    const guildRegistryInstance = await guild_registry.new();
    const guildRegistryInstance2 = await guild_registry.new();
    const hasRegistryInstance = await has_registry.new(guildRegistryInstance.address);

    await hasRegistryInstance.update_registry(guildRegistryInstance2.address);

    assert((await hasRegistryInstance.reg()).toString(), guildRegistryInstance2.address);

    return assert.isTrue(true);
  });

  it("test updating registry with not owner", async function () {
    const guildRegistryInstance = await guild_registry.new();
    const guildRegistryInstance2 = await guild_registry.new();
    const hasRegistryInstance = await has_registry.new(guildRegistryInstance.address);

    try {
      await hasRegistryInstance.update_registry(guildRegistryInstance2.address, { from: accounts[1] });
      assert.isTrue(false, "Must revert because account[1] is not the owner");
    } catch {
      assert.isTrue(true);
    }

    return assert.isTrue(true);
  });

  it("test updating registry with contract that does not implement IERC165", async function () {
    const guildRegistryInstance = await guild_registry.new();
    const notImplementingIERC165 = await ownable.new();
    const hasRegistryInstance = await has_registry.new(guildRegistryInstance.address);

    try {
      await hasRegistryInstance.update_registry(notImplementingIERC165.address);
      assert.isTrue(false, "Must revert because notImplementingIERC165 does not implement IERC165");
    } catch {
      assert.isTrue(true);
    }

    return assert.isTrue(true);
  });
});
