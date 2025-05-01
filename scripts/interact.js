const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  
  // Get the deployed contracts
  const CarNFT = await hre.ethers.getContractFactory("CarNFT");
  const ServiceHistory = await hre.ethers.getContractFactory("ServiceHistory");
  
  const carNFT = await CarNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const serviceHistory = await ServiceHistory.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

  console.log("1. Registering a new car...");
  const registerTx = await carNFT.registerCar(
    "VIN123456789",
    "PPSR123",
    "Toyota",
    "Camry",
    "Blue",
    "ABC123",
    2020,
    owner.address
  );
  await registerTx.wait();
  console.log("Car registered!");

  const carId = 0;
  console.log("\n2. Getting car details...");
  const carDetails = await carNFT.getCarDetails(carId);
  console.log("Car Details:", carDetails);

  console.log("\n3. Recording a service...");
  const serviceTx = await serviceHistory.recordService(
    carId,
    "Oil Change",
    "Regular maintenance",
    "Toyota Service Center",
    50000,
    ["Oil Filter", "Engine Oil"]
  );
  await serviceTx.wait();
  console.log("Service recorded!");

  console.log("\n4. Getting service history...");
  const history = await serviceHistory.getServiceHistory(carId);
  console.log("Service History:", history);

  console.log("\n5. Reporting an accident...");
  const accidentTx = await serviceHistory.reportAccident(
    carId,
    "Minor fender bender in parking lot"
  );
  await accidentTx.wait();
  console.log("Accident reported!");

  console.log("\n6. Checking accident history...");
  const hasAccident = await serviceHistory.hasAccidentHistory(carId);
  console.log("Has accident history:", hasAccident);

  console.log("\n7. Adding a modification...");
  const modTx = await serviceHistory.addModification(
    carId,
    "Installed new sound system"
  );
  await modTx.wait();
  console.log("Modification added!");

  console.log("\n8. Getting modifications...");
  const mods = await serviceHistory.getModifications(carId);
  console.log("Modifications:", mods);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 