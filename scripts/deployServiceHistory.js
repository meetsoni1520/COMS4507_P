const hre = require("hardhat");

async function main() {
    // Create a wallet using the private key of the owner
    const ownerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(ownerPrivateKey, hre.ethers.provider);
    console.log("Using account:", wallet.address);

    // Deploy ServiceHistory contract
    console.log("Deploying ServiceHistory contract...");
    const ServiceHistory = await hre.ethers.getContractFactory("ServiceHistory", wallet);
    const serviceHistory = await ServiceHistory.deploy("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    await serviceHistory.deployed();
    console.log("ServiceHistory deployed to:", serviceHistory.address);

    // Verify the CarNFT address
    const carNFTAddress = await serviceHistory.carNFT();
    console.log("CarNFT address in contract:", carNFTAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 