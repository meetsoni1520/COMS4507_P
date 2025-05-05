const fs = require('fs');
const path = require('path');
const { ethers } = require("hardhat");

// Predefined private key for universal account
const UNIVERSAL_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function main() {
    // Deploy contracts in the correct order
    console.log("Deploying contracts...");
    
    // 1. Deploy CarNFT first (no dependencies)
    const CarNFT = await ethers.getContractFactory("CarNFT");
    const carNFT = await CarNFT.deploy();
    await carNFT.deployed();
    console.log("CarNFT deployed to:", carNFT.address);

    // 2. Deploy OwnershipTransfer (depends on CarNFT)
    const OwnershipTransfer = await ethers.getContractFactory("OwnershipTransfer");
    const ownershipTransfer = await OwnershipTransfer.deploy(carNFT.address);
    await ownershipTransfer.deployed();
    console.log("OwnershipTransfer deployed to:", ownershipTransfer.address);

    // 3. Deploy ServiceHistory (depends on CarNFT)
    const ServiceHistory = await ethers.getContractFactory("ServiceHistory");
    const serviceHistory = await ServiceHistory.deploy(carNFT.address);
    await serviceHistory.deployed();
    console.log("ServiceHistory deployed to:", serviceHistory.address);

    // 4. Deploy TransactionManager (depends on CarNFT and OwnershipTransfer)
    const TransactionManager = await ethers.getContractFactory("TransactionManager");
    const transactionManager = await TransactionManager.deploy(carNFT.address, ownershipTransfer.address);
    await transactionManager.deployed();
    console.log("TransactionManager deployed to:", transactionManager.address);

    // Update frontend configuration
    const appJsPath = path.join(__dirname, '../public/app.js');
    let appJsContent = fs.readFileSync(appJsPath, 'utf8');

    // Replace contract addresses
    appJsContent = appJsContent.replace(
        /const CAR_NFT_ADDRESS = ".*?";/,
        `const CAR_NFT_ADDRESS = "${carNFT.address}";`
    );
    appJsContent = appJsContent.replace(
        /const OWNERSHIP_TRANSFER_ADDRESS = ".*?";/,
        `const OWNERSHIP_TRANSFER_ADDRESS = "${ownershipTransfer.address}";`
    );
    appJsContent = appJsContent.replace(
        /const TRANSACTION_MANAGER_ADDRESS = ".*?";/,
        `const TRANSACTION_MANAGER_ADDRESS = "${transactionManager.address}";`
    );
    appJsContent = appJsContent.replace(
        /const SERVICE_HISTORY_ADDRESS = ".*?";/,
        `const SERVICE_HISTORY_ADDRESS = "${serviceHistory.address}";`
    );

    fs.writeFileSync(appJsPath, appJsContent);
    console.log("Updated frontend configuration with new contract addresses");

    // Create a setup guide file
    const setupGuide = `
# AutoProof Setup Guide

## Network Configuration
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH

## Universal Test Account
Private Key: ${UNIVERSAL_PRIVATE_KEY}
Address: ${new ethers.Wallet(UNIVERSAL_PRIVATE_KEY).address}

## Contract Addresses
CarNFT: ${carNFT.address}
OwnershipTransfer: ${ownershipTransfer.address}
TransactionManager: ${transactionManager.address}
ServiceHistory: ${serviceHistory.address}

## Setup Steps
1. Start the Hardhat node: npx hardhat node
2. Start the server: npm start
3. Open http://localhost:3010
4. Add the network to MetaMask using the above configuration
5. Import the universal test account using the private key above
`;
    fs.writeFileSync(path.join(__dirname, '../SETUP_GUIDE.md'), setupGuide);
    console.log("Created SETUP_GUIDE.md with detailed instructions");

    console.log("\nSetup complete! Please check SETUP_GUIDE.md for detailed instructions.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 