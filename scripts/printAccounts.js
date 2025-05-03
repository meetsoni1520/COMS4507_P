const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        // Try to get the private key if possible
        let pk = "(private key not available)";
        if (account._signer && account._signer._mnemonic) {
            pk = account._signer._mnemonic.phrase;
        } else if (account.privateKey) {
            pk = account.privateKey;
        }
        console.log(`Account #${i}: ${account.address}`);
        console.log(`Private Key: ${pk}\n`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 