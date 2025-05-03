const hre = require("hardhat");

async function main() {
    // Seller private key (original car owner)
    const sellerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(sellerPrivateKey, hre.ethers.provider);
    console.log("Using seller account:", wallet.address);

    // TransactionManager contract
    const TransactionManager = await hre.ethers.getContractFactory("TransactionManager", wallet);
    const transactionManager = await TransactionManager.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

    // Transaction ID
    const transactionId = 1;

    // Complete transaction
    console.log("Completing transaction...");
    const tx = await transactionManager.completeTransaction(transactionId);
    await tx.wait();
    console.log("Transaction completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 