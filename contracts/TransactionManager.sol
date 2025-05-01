// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CarNFT.sol";
import "./OwnershipTransfer.sol";

contract TransactionManager is Ownable, ReentrancyGuard {
    CarNFT public carNFT;
    OwnershipTransfer public ownershipTransfer;
    
    struct Transaction {
        uint256 carId;
        address seller;
        address buyer;
        uint256 price;
        uint256 timestamp;
        TransactionStatus status;
        string transactionType; // e.g., "Sale", "Lease", "Trade-in"
        bytes32 documentHash; // Hash of any supporting documents
    }
    
    enum TransactionStatus { 
        Pending,
        Completed,
        Cancelled,
        Disputed
    }
    
    // Mapping from transaction ID to Transaction
    mapping(uint256 => Transaction) public transactions;
    uint256 private transactionCounter;
    
    // Mapping from car ID to its transaction history
    mapping(uint256 => uint256[]) public carTransactions;
    
    // Escrow balances
    mapping(uint256 => uint256) public escrowBalances;
    
    event TransactionCreated(uint256 indexed transactionId, uint256 indexed carId, address seller, address buyer, uint256 price);
    event TransactionCompleted(uint256 indexed transactionId, uint256 indexed carId);
    event TransactionCancelled(uint256 indexed transactionId, uint256 indexed carId);
    event DisputeRaised(uint256 indexed transactionId, address complainant);
    event EscrowDeposited(uint256 indexed transactionId, uint256 amount);
    event EscrowReleased(uint256 indexed transactionId, address recipient, uint256 amount);
    
    constructor(address _carNFTAddress, address _ownershipTransferAddress) {
        carNFT = CarNFT(_carNFTAddress);
        ownershipTransfer = OwnershipTransfer(_ownershipTransferAddress);
    }
    
    function createTransaction(
        uint256 carId,
        address buyer,
        uint256 price,
        string memory transactionType,
        bytes32 documentHash
    ) public returns (uint256) {
        require(carNFT.ownerOf(carId) == msg.sender, "Not the car owner");
        
        uint256 transactionId = transactionCounter++;
        
        Transaction memory newTransaction = Transaction({
            carId: carId,
            seller: msg.sender,
            buyer: buyer,
            price: price,
            timestamp: block.timestamp,
            status: TransactionStatus.Pending,
            transactionType: transactionType,
            documentHash: documentHash
        });
        
        transactions[transactionId] = newTransaction;
        carTransactions[carId].push(transactionId);
        
        emit TransactionCreated(transactionId, carId, msg.sender, buyer, price);
        return transactionId;
    }
    
    function depositEscrow(uint256 transactionId) public payable nonReentrant {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.buyer == msg.sender, "Not the buyer");
        require(transaction.status == TransactionStatus.Pending, "Invalid transaction status");
        require(msg.value == transaction.price, "Incorrect payment amount");
        
        escrowBalances[transactionId] = msg.value;
        emit EscrowDeposited(transactionId, msg.value);
    }
    
    function completeTransaction(uint256 transactionId) public nonReentrant {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.status == TransactionStatus.Pending, "Invalid transaction status");
        require(escrowBalances[transactionId] == transaction.price, "Escrow not funded");
        require(msg.sender == transaction.buyer || msg.sender == transaction.seller, "Not authorized");
        
        // Transfer ownership
        ownershipTransfer.initiateTransfer(
            transaction.carId,
            transaction.buyer,
            transaction.transactionType
        );
        
        // Release escrow to seller
        uint256 amount = escrowBalances[transactionId];
        escrowBalances[transactionId] = 0;
        payable(transaction.seller).transfer(amount);
        
        transaction.status = TransactionStatus.Completed;
        
        emit TransactionCompleted(transactionId, transaction.carId);
        emit EscrowReleased(transactionId, transaction.seller, amount);
    }
    
    function cancelTransaction(uint256 transactionId) public {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.status == TransactionStatus.Pending, "Invalid transaction status");
        require(msg.sender == transaction.buyer || msg.sender == transaction.seller, "Not authorized");
        
        // Refund escrow to buyer if any
        uint256 escrowAmount = escrowBalances[transactionId];
        if (escrowAmount > 0) {
            escrowBalances[transactionId] = 0;
            payable(transaction.buyer).transfer(escrowAmount);
            emit EscrowReleased(transactionId, transaction.buyer, escrowAmount);
        }
        
        transaction.status = TransactionStatus.Cancelled;
        emit TransactionCancelled(transactionId, transaction.carId);
    }
    
    function raiseDispute(uint256 transactionId) public {
        Transaction storage transaction = transactions[transactionId];
        require(msg.sender == transaction.buyer || msg.sender == transaction.seller, "Not authorized");
        require(transaction.status == TransactionStatus.Pending, "Invalid transaction status");
        
        transaction.status = TransactionStatus.Disputed;
        emit DisputeRaised(transactionId, msg.sender);
    }
    
    function getTransaction(uint256 transactionId) public view returns (
        uint256 carId,
        address seller,
        address buyer,
        uint256 price,
        uint256 timestamp,
        TransactionStatus status,
        string memory transactionType,
        bytes32 documentHash
    ) {
        Transaction memory transaction = transactions[transactionId];
        return (
            transaction.carId,
            transaction.seller,
            transaction.buyer,
            transaction.price,
            transaction.timestamp,
            transaction.status,
            transaction.transactionType,
            transaction.documentHash
        );
    }
    
    function getCarTransactionHistory(uint256 carId) public view returns (uint256[] memory) {
        return carTransactions[carId];
    }
} 