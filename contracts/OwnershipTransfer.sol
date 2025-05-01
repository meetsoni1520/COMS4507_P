// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarNFT.sol";

contract OwnershipTransfer is Ownable {
    CarNFT public carNFT;
    
    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
        string transferReason;
        bool isActive;
    }
    
    // Mapping from car ID to its transfer history
    mapping(uint256 => Transfer[]) public transferHistory;
    
    // Mapping to track pending transfers
    mapping(uint256 => Transfer) public pendingTransfers;
    
    event TransferInitiated(uint256 indexed carId, address indexed from, address indexed to, uint256 timestamp);
    event TransferCompleted(uint256 indexed carId, address indexed from, address indexed to, uint256 timestamp);
    event TransferCancelled(uint256 indexed carId, address indexed from, address indexed to, uint256 timestamp);
    
    constructor(address _carNFTAddress) {
        carNFT = CarNFT(_carNFTAddress);
    }
    
    modifier onlyCarOwner(uint256 carId) {
        require(carNFT.ownerOf(carId) == msg.sender, "Not the car owner");
        _;
    }
    
    function initiateTransfer(
        uint256 carId,
        address to,
        string memory transferReason
    ) public onlyCarOwner(carId) {
        require(to != address(0), "Invalid recipient address");
        require(pendingTransfers[carId].isActive == false, "Transfer already pending");
        
        Transfer memory newTransfer = Transfer({
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            transferReason: transferReason,
            isActive: true
        });
        
        pendingTransfers[carId] = newTransfer;
        emit TransferInitiated(carId, msg.sender, to, block.timestamp);
    }
    
    function acceptTransfer(uint256 carId) public {
        Transfer memory pending = pendingTransfers[carId];
        require(pending.isActive, "No active transfer");
        require(pending.to == msg.sender, "Not the intended recipient");
        
        // Transfer the NFT
        address from = pending.from;
        carNFT.transferFrom(from, msg.sender, carId);
        
        // Record the transfer in history
        transferHistory[carId].push(pending);
        
        // Clear the pending transfer
        delete pendingTransfers[carId];
        
        emit TransferCompleted(carId, from, msg.sender, block.timestamp);
    }
    
    function cancelTransfer(uint256 carId) public {
        Transfer memory pending = pendingTransfers[carId];
        require(pending.isActive, "No active transfer");
        require(pending.from == msg.sender || pending.to == msg.sender, "Not authorized");
        
        delete pendingTransfers[carId];
        emit TransferCancelled(carId, pending.from, pending.to, block.timestamp);
    }
    
    function getTransferHistory(uint256 carId) public view returns (Transfer[] memory) {
        return transferHistory[carId];
    }
    
    function getPendingTransfer(uint256 carId) public view returns (
        address from,
        address to,
        uint256 timestamp,
        string memory transferReason,
        bool isActive
    ) {
        Transfer memory transfer = pendingTransfers[carId];
        return (
            transfer.from,
            transfer.to,
            transfer.timestamp,
            transfer.transferReason,
            transfer.isActive
        );
    }
} 