// Contract addresses - replace with your deployed contract addresses
const CAR_NFT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const OWNERSHIP_TRANSFER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const TRANSACTION_MANAGER_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const SERVICE_HISTORY_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

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

// Add Service History ABI
const SERVICE_HISTORY_ABI = [
    "function recordService(uint256 carId, string memory serviceType, string memory description, string memory serviceProvider, uint256 mileage, string[] memory partsReplaced) public",
    "function getServiceHistory(uint256 carId) public view returns (tuple(uint256 timestamp, string serviceType, string description, string serviceProvider, uint256 mileage, string[] partsReplaced)[])",
    "function reportAccident(uint256 carId, string memory description) public",
    "function addModification(uint256 carId, string memory modification) public",
    "function hasAccidentHistory(uint256 carId) public view returns (bool)",
    "function getModifications(uint256 carId) public view returns (string[] memory)"
];

// Global variables for provider, signer and contracts
let provider;
let signer;
let carNFT;
let ownershipTransfer;
let transactionManager;
let serviceHistory;

// Initialize Web3 and contracts
async function init() {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask not found! Please install MetaMask.");
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get the signer
        signer = provider.getSigner();
        
        // Initialize contracts
        carNFT = new ethers.Contract(CAR_NFT_ADDRESS, CAR_NFT_ABI, signer);
        ownershipTransfer = new ethers.Contract(OWNERSHIP_TRANSFER_ADDRESS, OWNERSHIP_TRANSFER_ABI, signer);
        transactionManager = new ethers.Contract(TRANSACTION_MANAGER_ADDRESS, TRANSACTION_MANAGER_ABI, signer);
        serviceHistory = new ethers.Contract(SERVICE_HISTORY_ADDRESS, SERVICE_HISTORY_ABI, signer);

        console.log("Web3 initialized successfully!");
        showNotification("Connected to MetaMask successfully!", true);

        // Add event listeners after contracts are initialized
        addEventListeners();
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

    } catch (error) {
        console.error("Error initializing application:", error);
        showNotification(error.message, false);
    }
}

// Function to add event listeners
function addEventListeners() {
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    // Service forms
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleServiceSubmit);
    }

    const viewServiceHistoryForm = document.getElementById('viewServiceHistoryForm');
    if (viewServiceHistoryForm) {
        viewServiceHistoryForm.addEventListener('submit', handleViewServiceHistorySubmit);
    }

    // Transfer forms
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', handleTransferSubmit);
    }

    const acceptTransferForm = document.getElementById('acceptTransferForm');
    if (acceptTransferForm) {
        acceptTransferForm.addEventListener('submit', handleAcceptTransferSubmit);
    }

    const cancelTransferForm = document.getElementById('cancelTransferForm');
    if (cancelTransferForm) {
        cancelTransferForm.addEventListener('submit', handleCancelTransferSubmit);
    }

    // Transaction forms
    const createTransactionForm = document.getElementById('createTransactionForm');
    if (createTransactionForm) {
        createTransactionForm.addEventListener('submit', handleCreateTransactionSubmit);
    }

    const depositEscrowForm = document.getElementById('depositEscrowForm');
    if (depositEscrowForm) {
        depositEscrowForm.addEventListener('submit', handleDepositEscrowSubmit);
    }

    const completeTransactionForm = document.getElementById('completeTransactionForm');
    if (completeTransactionForm) {
        completeTransactionForm.addEventListener('submit', handleCompleteTransactionSubmit);
    }

    const disputeForm = document.getElementById('disputeForm');
    if (disputeForm) {
        disputeForm.addEventListener('submit', handleDisputeSubmit);
    }

    // View form
    const viewForm = document.getElementById('viewForm');
    if (viewForm) {
        viewForm.addEventListener('submit', handleViewSubmit);
    }
}

// Tab switching functionality
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Function to show notifications
function showNotification(message, isSuccess = true) {
    // Shorten error messages if too long
    let displayMessage = message;
    if (!isSuccess && typeof message === 'string') {
        // Try to extract a concise error reason
        const match = message.match(/reason=\"([^\"]+)\"/);
        if (match && match[1]) {
            displayMessage = match[1];
        } else if (message.length > 120) {
            displayMessage = message.slice(0, 120) + '...';
        }
    }
    const notification = document.createElement('div');
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    notification.textContent = displayMessage;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to display service history
async function displayServiceHistory(carId) {
    try {
        const history = await ownershipTransfer.getTransferHistory(carId);
        const carDetails = await carNFT.getCarDetails(carId);
        const transactions = await transactionManager.getCarTransactionHistory(carId);
        const serviceRecords = await serviceHistory.getServiceHistory(carId);
        
        const historyContainer = document.getElementById('serviceHistoryContainer');
        historyContainer.innerHTML = '';
        
        // Display car details
        const carInfo = document.createElement('div');
        carInfo.className = 'car-info';
        carInfo.innerHTML = `
            <h3>Car Details</h3>
            <p>VIN: ${carDetails[0]}</p>
            <p>Make: ${carDetails[2]}</p>
            <p>Model: ${carDetails[3]}</p>
            <p>Year: ${carDetails[6]}</p>
        `;
        historyContainer.appendChild(carInfo);
        
        // Display service history
        const serviceSection = document.createElement('div');
        serviceSection.className = 'history-section';
        serviceSection.innerHTML = '<h3>Service History</h3>';
        if (serviceRecords.length > 0) {
            const serviceList = document.createElement('ul');
            serviceRecords.forEach(record => {
                const date = new Date(record.timestamp * 1000);
                const li = document.createElement('li');
                li.innerHTML = `
                    <p>Date: ${date.toLocaleDateString()}</p>
                    <p>Type: ${record.serviceType}</p>
                    <p>Description: ${record.description}</p>
                    <p>Provider: ${record.serviceProvider}</p>
                    <p>Mileage: ${record.mileage}</p>
                    <p>Parts Replaced: ${record.partsReplaced.join(', ')}</p>
                `;
                serviceList.appendChild(li);
            });
            serviceSection.appendChild(serviceList);
        } else {
            serviceSection.innerHTML += '<p>No service history available</p>';
        }
        historyContainer.appendChild(serviceSection);
        
        // Display transfer history
        const transferSection = document.createElement('div');
        transferSection.className = 'history-section';
        transferSection.innerHTML = '<h3>Ownership Transfer History</h3>';
        if (history.length > 0) {
            const transferList = document.createElement('ul');
            history.forEach(transfer => {
                const date = new Date(transfer.timestamp * 1000);
                const li = document.createElement('li');
                li.innerHTML = `
                    <p>From: ${transfer.from}</p>
                    <p>To: ${transfer.to}</p>
                    <p>Date: ${date.toLocaleDateString()}</p>
                    <p>Reason: ${transfer.transferReason}</p>
                `;
                transferList.appendChild(li);
            });
            transferSection.appendChild(transferList);
        } else {
            transferSection.innerHTML += '<p>No transfer history available</p>';
        }
        historyContainer.appendChild(transferSection);
        
        // Display transaction history
        const transactionSection = document.createElement('div');
        transactionSection.className = 'history-section';
        transactionSection.innerHTML = '<h3>Transaction History</h3>';
        if (transactions.length > 0) {
            const transactionList = document.createElement('ul');
            for (const txId of transactions) {
                const tx = await transactionManager.getTransaction(txId);
                const date = new Date(tx[3] * 1000);
                const li = document.createElement('li');
                li.innerHTML = `
                    <p>Transaction ID: ${txId}</p>
                    <p>Type: ${tx[6]}</p>
                    <p>Price: ${ethers.utils.formatEther(tx[3])} ETH</p>
                    <p>Date: ${date.toLocaleDateString()}</p>
                    <p>Status: ${getTransactionStatus(tx[5])}</p>
                `;
                transactionList.appendChild(li);
            }
            transactionSection.appendChild(transactionList);
        } else {
            transactionSection.innerHTML += '<p>No transaction history available</p>';
        }
        historyContainer.appendChild(transactionSection);
        
    } catch (error) {
        console.error("Error displaying service history:", error);
        showNotification("Error fetching service history", false);
    }
}

function getTransactionStatus(status) {
    const statuses = ['Pending', 'Active', 'Completed', 'Cancelled', 'Disputed'];
    return statuses[status] || 'Unknown';
}

// Handle form submissions
async function handleRegisterSubmit(e) {
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
        showNotification("Car registered successfully!");
        e.target.reset();
    } catch (error) {
        console.error("Error registering car:", error);
        showNotification(error.message, false);
    }
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    try {
        const carId = parseInt(document.getElementById('serviceCarId').value);
        const serviceType = document.getElementById('serviceType').value;
        const description = document.getElementById('serviceDescription').value;
        const provider = document.getElementById('serviceProvider').value;
        const mileage = parseInt(document.getElementById('serviceMileage').value);
        const parts = document.getElementById('serviceParts').value
            .split(',')
            .map(part => part.trim())
            .filter(part => part.length > 0);

        const tx = await serviceHistory.recordService(
            carId,
            serviceType,
            description,
            provider,
            mileage,
            parts
        );
        
        await tx.wait();
        showNotification("Service record added successfully!");
        e.target.reset();
    } catch (error) {
        console.error("Error recording service:", error);
        showNotification(error.message, false);
    }
}

// Ownership Transfer Functions
async function handleTransferSubmit(e) {
    e.preventDefault();
    try {
        const tx = await ownershipTransfer.initiateTransfer(
            document.getElementById('transferCarId').value,
            document.getElementById('recipientAddress').value,
            document.getElementById('transferReason').value
        );
        
        await tx.wait();
        showNotification("Transfer initiated successfully!");
        e.target.reset();
    } catch (error) {
        console.error("Error initiating transfer:", error);
        showNotification(error.message, false);
    }
}

async function handleAcceptTransferSubmit(e) {
    e.preventDefault();
    try {
        const tx = await ownershipTransfer.acceptTransfer(
            document.getElementById('acceptCarId').value
        );
        
        await tx.wait();
        showNotification('Transfer accepted successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error accepting transfer:", error);
        showNotification(error.message, false);
    }
}

async function handleCancelTransferSubmit(e) {
    e.preventDefault();
    try {
        const tx = await ownershipTransfer.cancelTransfer(
            document.getElementById('cancelCarId').value
        );
        
        await tx.wait();
        showNotification('Transfer cancelled successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error cancelling transfer:", error);
        showNotification(error.message, false);
    }
}

// Transaction Functions
async function handleCreateTransactionSubmit(e) {
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
        showNotification('Transaction created successfully!');
        e.target.reset();
    } catch (error) {
        console.error("Error creating transaction:", error);
        showNotification(error.message, false);
    }
}

async function handleDepositEscrowSubmit(e) {
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
}

async function handleCompleteTransactionSubmit(e) {
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
}

async function handleDisputeSubmit(e) {
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
}

// Update view car details to include transfer and transaction history
async function handleViewSubmit(e) {
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
}

// Add event listener for viewing service history
async function handleViewServiceHistorySubmit(e) {
    e.preventDefault();
    const carId = document.getElementById('historyCarId').value;
    await displayServiceHistory(carId);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init); 