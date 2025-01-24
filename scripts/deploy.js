const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const signer = await ethers.getSigners();
  const Storage = await ethers.getContractFactory("Storage", signer);
  const storage = await Storage.deploy();
  await storage.waitForDeployment();
  console.log(await storage.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
