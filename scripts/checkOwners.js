const hre = require("hardhat");

async function main() {
  // Get contract instances
  const carNFT = await hre.ethers.getContractAt("CarNFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const ownershipTransfer = await hre.ethers.getContractAt("OwnershipTransfer", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const transactionManager = await hre.ethers.getContractAt("TransactionManager", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

  // Get current owners
  const carNFTOwner = await carNFT.owner();
  const ownershipTransferOwner = await ownershipTransfer.owner();
  const transactionManagerOwner = await transactionManager.owner();

  console.log("Current owners:");
  console.log("CarNFT owner:", carNFTOwner);
  console.log("OwnershipTransfer owner:", ownershipTransferOwner);
  console.log("TransactionManager owner:", transactionManagerOwner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 