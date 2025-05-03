const hre = require("hardhat");

async function main() {
    // Seller (current car owner)
    const sellerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(sellerPrivateKey, hre.ethers.provider);
    console.log("Using seller account:", wallet.address);

    // TransactionManager contract
    const TransactionManager = await hre.ethers.getContractFactory("TransactionManager", wallet);
    const transactionManager = await TransactionManager.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

    // Test values
    const carId = 0;
    const buyer = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Example Hardhat account
    const price = hre.ethers.utils.parseEther("1.0"); // 1 ETH
    const transactionType = "Sale";
    const documentHash = hre.ethers.utils.id("TestDocument");

    // Create transaction
    console.log("Creating transaction...");
    const tx = await transactionManager.createTransaction(carId, buyer, price, transactionType, documentHash);
    const receipt = await tx.wait();
    console.log("Transaction created! Receipt:", receipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 