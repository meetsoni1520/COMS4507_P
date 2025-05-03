const hre = require("hardhat");

async function main() {
    // Create a wallet from the private key of the current owner
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new hre.ethers.Wallet(privateKey, hre.ethers.provider);
    
    // Get the deployed CarNFT contract
    const CarNFT = await hre.ethers.getContractFactory("CarNFT", wallet);
    const carNFT = await CarNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    
    // New owner address (your MetaMask account)
    const newOwner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    
    console.log("Current owner:", await carNFT.owner());
    console.log("Transferring ownership to:", newOwner);
    
    // Transfer ownership
    const tx = await carNFT.transferOwnership(newOwner);
    await tx.wait();
    
    console.log("Ownership transferred successfully!");
    console.log("New owner:", await carNFT.owner());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 