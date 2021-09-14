const ownable = artifacts.require("ownable");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ownable", function (accounts) {
  it("test owner is changed", async function () {
    const ownableInstance = await ownable.new();

    assert.equal((await ownableInstance.owner()).toString(), accounts[0]);

    await ownableInstance.update_owner(accounts[1]);

    assert.equal((await ownableInstance.owner()).toString(), accounts[1]);

    return assert.isTrue(true);
  });

  it("test owner is not changed", async function () {
    const ownableInstance = await ownable.new({ from: accounts[1] });

    assert.equal((await ownableInstance.owner()).toString(), accounts[1]);

    try {
      await ownableInstance.update_owner(accounts[0]);
      assert.isTrue(false, "Rever should be triggered");
    } catch {
      assert.isTrue(true);
    }

    return assert.isTrue(true);
  });
});
