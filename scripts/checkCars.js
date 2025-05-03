const hre = require("hardhat");

async function main() {
    // Create a wallet using the private key of the car owner
    const ownerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(ownerPrivateKey, hre.ethers.provider);
    console.log("Using account:", wallet.address);

    // Get the CarNFT contract
    const CarNFT = await hre.ethers.getContractFactory("CarNFT", wallet);
    const carNFT = await CarNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    try {
        // Try to get details of car ID 0
        console.log("Checking car ID 0...");
        const details = await carNFT.getCarDetails(0);
        console.log("Car exists! Details:", details);
    } catch (error) {
        console.log("Car ID 0 does not exist:", error.message);
    }

    try {
        // Try to get the owner of car ID 0
        console.log("\nChecking owner of car ID 0...");
        const owner = await carNFT.ownerOf(0);
        console.log("Car owner:", owner);
    } catch (error) {
        console.log("Could not get owner:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 