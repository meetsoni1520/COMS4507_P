const { ethers } = require("hardhat");

async function main() {
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    
    console.log("\n=== Network Details for MetaMask Setup ===");
    console.log("Network Name: Hardhat Local");
    console.log("RPC URL: http://127.0.0.1:8545");
    console.log("Chain ID:", network.chainId);
    console.log("Currency Symbol: ETH");
    console.log("Block Explorer URL: (Leave empty)");
    
    // Get the first account's address and private key
    const accounts = await ethers.getSigners();
    const firstAccount = accounts[0];
    console.log("\n=== Test Account Details ===");
    console.log("Address:", await firstAccount.getAddress());
    console.log("Private Key:", process.env.PRIVATE_KEY || "Please set PRIVATE_KEY in .env file");
    
    console.log("\nTo use this network in MetaMask:");
    console.log("1. Open MetaMask");
    console.log("2. Click on the network dropdown");
    console.log("3. Click 'Add Network'");
    console.log("4. Click 'Add a network manually'");
    console.log("5. Enter the above details");
    console.log("6. Click 'Save'");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 