const fs = require("fs");
let addresses = {};

async function main() {
  const contractsNames = [
    "Vehicles",
    "Owners",
    "Mileages",
    "Inspections",
    "Controls",
    "Stealings",
    "Policies",
    "Damages"
  ];

  for (const cn of contractsNames) {
    await deployContract(cn);
  }
}

async function deployContract(name) {
  const contractFactory = await ethers.getContractFactory(name);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`The ${name} Contract was deployed to: ${contract.address}`);

  addresses[`${name.toLowerCase()}Contract`] = contract.address;
  const addressesJSON = JSON.stringify(addresses);
  fs.writeFileSync("environment/contract-address.json", addressesJSON);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
