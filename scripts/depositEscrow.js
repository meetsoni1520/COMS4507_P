const hre = require("hardhat");

async function main() {
    // Buyer private key for 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const buyerPrivateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
    const wallet = new hre.ethers.Wallet(buyerPrivateKey, hre.ethers.provider);
    console.log("Using buyer account:", wallet.address); // Should be 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

    // TransactionManager contract
    const TransactionManager = await hre.ethers.getContractFactory("TransactionManager", wallet);
    const transactionManager = await TransactionManager.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

    // Transaction ID and price
    const transactionId = 1;
    const price = hre.ethers.utils.parseEther("1.0"); // 1 ETH

    // Deposit escrow
    console.log("Depositing escrow...");
    const tx = await transactionManager.depositEscrow(transactionId, { value: price });
    await tx.wait();
    console.log("Escrow deposited!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 