// Contract addresses - replace with your deployed contract addresses
const CAR_NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const OWNERSHIP_TRANSFER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TRANSACTION_MANAGER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Contract ABIs
const CAR_NFT_ABI = [
    "function registerCar(string vin, string ppsr, string make, string model, string color, string licensePlate, uint256 year, address owner) public returns (uint256)",
    "function getCarDetails(uint256 tokenId) public view returns (string, string, string, string, string, string, uint256)"
];

const OWNERSHIP_TRANSFER_ABI = [
    "function initiateTransfer(uint256 carId, address to, string memory transferReason) public",
    "function acceptTransfer(uint256 carId) public",
    "function cancelTransfer(uint256 carId) public",
    "function getTransferHistory(uint256 carId) public view returns (tuple(address from, address to, uint256 timestamp, string transferReason, bool isActive)[])",
    "function getPendingTransfer(uint256 carId) public view returns (address, address, uint256, string, bool)"
];

const TRANSACTION_MANAGER_ABI = [
    "function createTransaction(uint256 carId, address buyer, uint256 price, string memory transactionType, bytes32 documentHash) public returns (uint256)",
    "function depositEscrow(uint256 transactionId) public payable",
    "function completeTransaction(uint256 transactionId) public",
    "function cancelTransaction(uint256 transactionId) public",
    "function raiseDispute(uint256 transactionId) public",
    "function getTransaction(uint256 transactionId) public view returns (uint256, address, address, uint256, uint256, uint8, string, bytes32)",
    "function getCarTransactionHistory(uint256 carId) public view returns (uint256[])"
];

let provider;
let signer;
let carNFT;
let ownershipTransfer;
let transactionManager;

// Initialize Web3 and contracts
async function init() {
    try {
        console.log("Starting initialization...");
        
        // Check if ethers is available
        if (typeof ethers === 'undefined') {
            throw new Error("Ethers.js is not loaded. Please check your internet connection and refresh the page.");
        }
        console.log("Ethers.js is loaded");

        // Check if MetaMask is installed
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
        }
        console.log("MetaMask is detected");

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected account:", accounts[0]);
        
        // Initialize provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provider initialized");
        
        // Get signer
        signer = provider.getSigner();
        console.log("Signer obtained");

        // Initialize contracts
        carNFT = new ethers.Contract(CAR_NFT_ADDRESS, CAR_NFT_ABI, signer);
        console.log("CarNFT contract initialized");
        
        ownershipTransfer = new ethers.Contract(OWNERSHIP_TRANSFER_ADDRESS, OWNERSHIP_TRANSFER_ABI, signer);
        console.log("OwnershipTransfer contract initialized");
        
        transactionManager = new ethers.Contract(TRANSACTION_MANAGER_ADDRESS, TRANSACTION_MANAGER_ABI, signer);
        console.log("TransactionManager contract initialized");

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
            console.log("Network changed. Reloading...");
            window.location.reload();
        });

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log("Account changed. Reloading...");
            window.location.reload();
        });

        console.log("Initialization complete!");
    } catch (error) {
        console.error("Initialization error:", error);
        alert(`Error initializing application: ${error.message}`);
    }
}

// Tab switching functionality
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Register new car
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const tx = await carNFT.registerCar(
            document.getElementById('vin').value,
            document.getElementById('ppsr').value,
            document.getElementById('make').value,
            document.getElementById('model').value,
            document.getElementById('color').value,
            document.getElementById('licensePlate').value,
            document.getElementById('year').value,
            await signer.getAddress()
        );
        
        await tx.wait();
        alert('Car registered successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error registering car:", error);
        alert('Error registering car. Check console for details.');
    }
});

// Ownership Transfer Functions
document.getElementById('transferForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const tx = await ownershipTransfer.initiateTransfer(
            document.getElementById('transferCarId').value,
            document.getElementById('recipientAddress').value,
            document.getElementById('transferReason').value
        );
        
        await tx.wait();
        alert('Transfer initiated successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error initiating transfer:", error);
        alert('Error initiating transfer. Check console for details.');
    }
});

document.getElementById('acceptTransferForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const tx = await ownershipTransfer.acceptTransfer(
            document.getElementById('acceptCarId').value
        );
        
        await tx.wait();
        alert('Transfer accepted successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error accepting transfer:", error);
        alert('Error accepting transfer. Check console for details.');
    }
});

document.getElementById('cancelTransferForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const tx = await ownershipTransfer.cancelTransfer(
            document.getElementById('cancelCarId').value
        );
        
        await tx.wait();
        alert('Transfer cancelled successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error cancelling transfer:", error);
        alert('Error cancelling transfer. Check console for details.');
    }
});

// Transaction Functions
document.getElementById('createTransactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const documentHash = ethers.utils.id(document.getElementById('documentHash').value);
        const price = ethers.utils.parseEther(document.getElementById('price').value);
        
        const tx = await transactionManager.createTransaction(
            document.getElementById('transactionCarId').value,
            document.getElementById('buyerAddress').value,
            price,
            document.getElementById('transactionType').value,
            documentHash
        );
        
        await tx.wait();
        alert('Transaction created successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error creating transaction:", error);
        alert('Error creating transaction. Check console for details.');
    }
});

document.getElementById('depositEscrowForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const transactionId = document.getElementById('escrowTransactionId').value;
        const transaction = await transactionManager.getTransaction(transactionId);
        
        const tx = await transactionManager.depositEscrow(transactionId, {
            value: transaction[3] // price
        });
        
        await tx.wait();
        alert('Escrow deposited successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error depositing escrow:", error);
        alert('Error depositing escrow. Check console for details.');
    }
});

document.getElementById('completeTransactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const tx = await transactionManager.completeTransaction(
            document.getElementById('completeTransactionId').value
        );
        
        await tx.wait();
        alert('Transaction completed successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error completing transaction:", error);
        alert('Error completing transaction. Check console for details.');
    }
});

document.getElementById('disputeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const tx = await transactionManager.raiseDispute(
            document.getElementById('disputeTransactionId').value
        );
        
        await tx.wait();
        alert('Dispute raised successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error raising dispute:", error);
        alert('Error raising dispute. Check console for details.');
    }
});

// Update view car details to include transfer and transaction history
document.getElementById('viewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const carId = document.getElementById('viewCarId').value;
        
        // Get car details
        const details = await carNFT.getCarDetails(carId);
        
        // Get transfer history
        const transferHistory = await ownershipTransfer.getTransferHistory(carId);
        
        // Get transaction history
        const transactionIds = await transactionManager.getCarTransactionHistory(carId);
        const transactions = await Promise.all(
            transactionIds.map(id => transactionManager.getTransaction(id))
        );
        
        // Display car details
        const detailsHtml = `
            <h3>Car Details</h3>
            <p><strong>VIN:</strong> ${details[0]}</p>
            <p><strong>PPSR:</strong> ${details[1]}</p>
            <p><strong>Make:</strong> ${details[2]}</p>
            <p><strong>Model:</strong> ${details[3]}</p>
            <p><strong>Color:</strong> ${details[4]}</p>
            <p><strong>License Plate:</strong> ${details[5]}</p>
            <p><strong>Year:</strong> ${details[6]}</p>
        `;
        
        // Display transfer history
        const transferHistoryHtml = `
            <h3>Transfer History</h3>
            ${transferHistory.map(transfer => `
                <div class="history-entry">
                    <p><strong>From:</strong> ${transfer.from}</p>
                    <p><strong>To:</strong> ${transfer.to}</p>
                    <p><strong>Date:</strong> ${new Date(transfer.timestamp * 1000).toLocaleString()}</p>
                    <p><strong>Reason:</strong> ${transfer.transferReason}</p>
                </div>
            `).join('')}
        `;
        
        // Display transaction history
        const transactionHistoryHtml = `
            <h3>Transaction History</h3>
            ${transactions.map(tx => `
                <div class="history-entry">
                    <p><strong>Transaction ID:</strong> ${tx[0]}</p>
                    <p><strong>Seller:</strong> ${tx[1]}</p>
                    <p><strong>Buyer:</strong> ${tx[2]}</p>
                    <p><strong>Price:</strong> ${ethers.utils.formatEther(tx[3])} ETH</p>
                    <p><strong>Date:</strong> ${new Date(tx[4] * 1000).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${['Pending', 'Completed', 'Cancelled', 'Disputed'][tx[5]]}</p>
                    <p><strong>Type:</strong> ${tx[6]}</p>
                </div>
            `).join('')}
        `;
        
        document.getElementById('carDetails').innerHTML = detailsHtml;
        document.getElementById('transferHistory').innerHTML = transferHistoryHtml;
        document.getElementById('transactionHistory').innerHTML = transactionHistoryHtml;
    } catch (error) {
        console.error("Error viewing car details:", error);
        alert('Error viewing car details. Check console for details.');
    }
});

// Initialize when page loads
window.addEventListener('load', async () => {
    console.log("Page loaded, initializing...");
    await init();
}); 