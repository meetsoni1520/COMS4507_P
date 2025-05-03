const hre = require("hardhat");

async function main() {
    const [account] = await hre.ethers.getSigners();
    const CarNFT = await hre.ethers.getContractFactory("CarNFT", account);
    const carNFT = await CarNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

    for (let i = 0; i < 5; i++) { // Check first 5 car IDs
        try {
            const details = await carNFT.getCarDetails(i);
            const owner = await carNFT.ownerOf(i);
            console.log(`Car ID ${i}:`, details, "Owner:", owner);
        } catch (e) {
            console.log(`Car ID ${i}: does not exist or error`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 