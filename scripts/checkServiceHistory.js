const hre = require("hardhat");

async function main() {
    // Create a wallet using the private key of the car owner
    const ownerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(ownerPrivateKey, hre.ethers.provider);
    console.log("Using account:", wallet.address);

    // Get the ServiceHistory contract
    const ServiceHistory = await hre.ethers.getContractFactory("ServiceHistory", wallet);
    const serviceHistory = await ServiceHistory.attach("0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1");

    try {
        // Check if the contract is properly initialized by getting the CarNFT address
        console.log("Checking CarNFT address in ServiceHistory contract...");
        const carNFTAddress = await serviceHistory.carNFT();
        console.log("CarNFT address:", carNFTAddress);

        // Try to get service history for car ID 0
        console.log("\nGetting service history for car ID 0...");
        const history = await serviceHistory.getServiceHistory(0);
        console.log("Service history:", history);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 