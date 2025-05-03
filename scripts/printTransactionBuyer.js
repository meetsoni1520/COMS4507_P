const hre = require("hardhat");

async function main() {
    // Use any account for reading
    const [account] = await hre.ethers.getSigners();
    const TransactionManager = await hre.ethers.getContractFactory("TransactionManager", account);
    const transactionManager = await TransactionManager.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

    const transactionId = 1;
    const tx = await transactionManager.getTransaction(transactionId);
    console.log("Buyer address for Transaction", transactionId, ":", tx[2]);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 