const { ethers } = require("hardhat");

async function main() {
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    console.log("Chain ID:", network.chainId);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 