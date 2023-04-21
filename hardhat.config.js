require("@nomiclabs/hardhat-waffle");
const secret = require("./environment/secrets.json");

module.exports = {
  solidity: "0.8.17",
  paths: {
    sources: "./blockchain/contracts",
    tests: "./blockchain/tests",
    cache: "./blockchain/cache",
    artifacts: "./blockchain/artifacts",
  },
  networks: {
    avalancheTest: {
      url: secret.avalanchenode,
      accounts: [secret.privatekey],
    },
  },
};
