require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: __dirname + '/.env.local' })

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337, // As per hardhat documentation
    },
    mumbai: {
      url: process.env.MUMBAI_POLYGON_ENDPOINT,
      accounts: [process.env.METAMASK_PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.MAINNET_POLYGON_ENDPOINT,
      accounts: [process.env.METAMASK_PRIVATE_KEY],
    },
  },
  solidity: '0.8.4',
}
