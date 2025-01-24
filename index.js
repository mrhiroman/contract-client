import hre from "hardhat";
import inquirer from "inquirer";
import * as readline from "node:readline/promises"; // This uses the promise-based APIs
import { stdin as input, stdout as output } from "node:process";

const ethers = hre.ethers;

import StorageArtifact from "./artifacts/contracts/contract.sol/Storage.json"  with {type: "json"};

async function main() {
  const [owner, testacc1, testacc2] = await ethers.getSigners();
  const contract_addr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const accountChoice = ["Owner", "acc1", "acc2"];
  const ownerChoice = ["Donate money", "Check top donators", "Withdraw money"];
  const donatorChoice = ["Donate money", "Check top donators"];

  const accountOption = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Select an account:",
      choices: accountChoice,
    },
  ]);

  console.log(accountOption.option, accountChoice[0]);

  const storageContract = new ethers.Contract(
    contract_addr,
    StorageArtifact.abi,
    accountOption.option == accountChoice[0]
      ? owner
      : accountOption.option == accountChoice[1]
      ? testacc1
      : testacc2
  );

  const balance =  accountOption.option == accountChoice[0]
  ? await owner.provider.getBalance(owner.address)
  : accountOption.option == accountChoice[1]
  ? await testacc1.provider.getBalance(testacc1.address)
  : await testacc2.provider.getBalance(testacc2.address)

  console.log(balance)

  const actionOption = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "What to do?",
      choices: accountOption.option == accountChoice[0] ? ownerChoice : donatorChoice,
    },
  ]);

  switch (actionOption.option) {
    case ownerChoice[0]:
      const rl = readline.createInterface({ input, output });
      const money = await rl.question("How much ETH to donate: ");
      const options = {value: ethers.parseEther(money)}
      await storageContract.donate(options);
      break;
    case ownerChoice[1]:
      const donators = await storageContract.getTopDonators();
      console.log(donators);
      break;
    case ownerChoice[2]:
      await storageContract.withdraw();
      break;
    default:
        console.log('Error!');
        break;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
