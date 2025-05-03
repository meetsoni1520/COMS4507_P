const hre = require("hardhat");

async function main() {
    // Car owner private key
    const ownerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(ownerPrivateKey, hre.ethers.provider);
    console.log("Using account:", wallet.address);

    // CarNFT contract
    const CarNFT = await hre.ethers.getContractFactory("CarNFT", wallet);
    const carNFT = await CarNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // OwnershipTransfer contract address
    const ownershipTransferAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Approve OwnershipTransfer contract
    console.log("Granting approval to OwnershipTransfer contract...");
    const tx = await carNFT.setApprovalForAll(ownershipTransferAddress, true);
    await tx.wait();
    console.log("Approval granted!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 