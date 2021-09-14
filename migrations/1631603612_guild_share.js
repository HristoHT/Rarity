const guildERC721 = artifacts.require("guildERC721");
const guild = artifacts.require("guild");
const rarity_gold = artifacts.require("rarity_gold");
const rarity_c = artifacts.require("rarity_c");

module.exports = async function(deployer) {
  await deployer.deploy(rarity_c);
  const rarityInstance = await rarity_c.deployed();
  await deployer.deploy(rarity_gold, rarityInstance.address);
  const goldInstance = await rarity_gold.deployed();
  await deployer.deploy(guildERC721);
  await deployer.deploy(guild, rarityInstance.address, goldInstance.address);
};
