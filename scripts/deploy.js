const hre = require("hardhat");

async function main() {
  // Deploy CarNFT contract
  const CarNFT = await hre.ethers.getContractFactory("CarNFT");
  const carNFT = await CarNFT.deploy();
  await carNFT.deployed();
  console.log("CarNFT deployed to:", carNFT.address);

  // Deploy OwnershipTransfer contract
  const OwnershipTransfer = await hre.ethers.getContractFactory("OwnershipTransfer");
  const ownershipTransfer = await OwnershipTransfer.deploy(carNFT.address);
  await ownershipTransfer.deployed();
  console.log("OwnershipTransfer deployed to:", ownershipTransfer.address);

  // Deploy TransactionManager contract
  const TransactionManager = await hre.ethers.getContractFactory("TransactionManager");
  const transactionManager = await TransactionManager.deploy(carNFT.address, ownershipTransfer.address);
  await transactionManager.deployed();
  console.log("TransactionManager deployed to:", transactionManager.address);

  // Deploy ServiceHistory contract
  const ServiceHistory = await hre.ethers.getContractFactory("ServiceHistory");
  const serviceHistory = await ServiceHistory.deploy(carNFT.address);
  await serviceHistory.deployed();
  console.log("ServiceHistory deployed to:", serviceHistory.address);

  // Grant approval to OwnershipTransfer contract
  await carNFT.setApprovalForAll(ownershipTransfer.address, true);
  console.log("Granted approval to OwnershipTransfer contract");

  // Grant approval to TransactionManager contract
  await carNFT.setApprovalForAll(transactionManager.address, true);
  console.log("Granted approval to TransactionManager contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 