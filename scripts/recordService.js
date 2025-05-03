const hre = require("hardhat");

async function main() {
    // Create a wallet using the private key of the car owner
    const ownerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new hre.ethers.Wallet(ownerPrivateKey, hre.ethers.provider);
    console.log("Using account:", wallet.address);

    // Get the ServiceHistory contract
    const ServiceHistory = await hre.ethers.getContractFactory("ServiceHistory", wallet);
    const serviceHistory = await ServiceHistory.attach("0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F");

    // Record a service for car ID 0
    console.log("Recording a service...");
    const tx = await serviceHistory.recordService(
        0,                          // carId
        "Oil Change",               // serviceType
        "Regular maintenance",      // description
        "Toyota Service Center",    // serviceProvider
        50000,                     // mileage
        ["Oil Filter", "Engine Oil"] // partsReplaced
    );
    await tx.wait();
    console.log("Service recorded successfully!");

    // Get the service history
    console.log("\nGetting service history...");
    const history = await serviceHistory.getServiceHistory(0);
    console.log("Service History:", history);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 