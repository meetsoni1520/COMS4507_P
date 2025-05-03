const hre = require("hardhat");

async function main() {
    // Create a wallet using the private key of the owner
    const ownerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(ownerPrivateKey, hre.ethers.provider);
    console.log("Using account:", wallet.address);

    // Get the CarNFT contract
    const CarNFT = await hre.ethers.getContractFactory("CarNFT", wallet);
    const carNFT = await CarNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Register a new car
    console.log("Registering a new car...");
    const tx = await carNFT.registerCar(
        "VIN123456789",  // VIN
        "PPSR123",       // PPSR
        "Toyota",        // Make
        "Camry",         // Model
        "Blue",          // Color
        "ABC123",        // Registration
        2020,            // Year
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"    // Owner
    );
    await tx.wait();
    console.log("Car registered successfully!");

    // Get the token ID of the newly registered car
    const tokenId = await carNFT.totalSupply();
    console.log("New car token ID:", tokenId.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 