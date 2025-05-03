const hre = require("hardhat");

async function main() {
  // Your MetaMask account address (where we want to transfer ownership to)
  const newOwnerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  // Create a wallet from the current owner's private key
  const currentOwnerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new hre.ethers.Wallet(currentOwnerPrivateKey, hre.ethers.provider);
  
  console.log("Using current owner's address:", wallet.address);

  // Get contract instances with the wallet
  const carNFT = await hre.ethers.getContractAt("CarNFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3", wallet);
  const ownershipTransfer = await hre.ethers.getContractAt("OwnershipTransfer", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", wallet);
  const transactionManager = await hre.ethers.getContractAt("TransactionManager", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", wallet);

  // Transfer ownership of CarNFT
  console.log("Transferring ownership of CarNFT...");
  const tx1 = await carNFT.transferOwnership(newOwnerAddress);
  await tx1.wait();
  console.log("CarNFT ownership transferred to:", newOwnerAddress);

  // Transfer ownership of OwnershipTransfer
  console.log("Transferring ownership of OwnershipTransfer...");
  const tx2 = await ownershipTransfer.transferOwnership(newOwnerAddress);
  await tx2.wait();
  console.log("OwnershipTransfer ownership transferred to:", newOwnerAddress);

  // Transfer ownership of TransactionManager
  console.log("Transferring ownership of TransactionManager...");
  const tx3 = await transactionManager.transferOwnership(newOwnerAddress);
  await tx3.wait();
  console.log("TransactionManager ownership transferred to:", newOwnerAddress);

  console.log("All ownership transfers completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 