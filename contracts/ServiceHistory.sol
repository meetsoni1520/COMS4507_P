// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarNFT.sol";

contract ServiceHistory is Ownable {
    struct ServiceRecord {
        uint256 timestamp;
        string serviceType;
        string description;
        string serviceProvider;
        uint256 mileage;
        string[] partsReplaced;
    }

    CarNFT public carNFT;
    mapping(uint256 => ServiceRecord[]) private _serviceHistory;
    mapping(uint256 => bool) private _isAccident;
    mapping(uint256 => string[]) private _modifications;

    event ServiceRecorded(uint256 indexed carId, string serviceType, uint256 timestamp);
    event AccidentReported(uint256 indexed carId, string description, uint256 timestamp);
    event ModificationAdded(uint256 indexed carId, string modification, uint256 timestamp);

    constructor(address _carNFTAddress) {
        carNFT = CarNFT(_carNFTAddress);
    }

    function recordService(
        uint256 carId,
        string memory serviceType,
        string memory description,
        string memory serviceProvider,
        uint256 mileage,
        string[] memory partsReplaced
    ) public {
        require(carNFT.ownerOf(carId) == msg.sender, "Only car owner can record service");
        
        ServiceRecord memory newRecord = ServiceRecord({
            timestamp: block.timestamp,
            serviceType: serviceType,
            description: description,
            serviceProvider: serviceProvider,
            mileage: mileage,
            partsReplaced: partsReplaced
        });

        _serviceHistory[carId].push(newRecord);
        emit ServiceRecorded(carId, serviceType, block.timestamp);
    }

    function reportAccident(uint256 carId, string memory description) public {
        require(carNFT.ownerOf(carId) == msg.sender, "Only car owner can report accident");
        _isAccident[carId] = true;
        emit AccidentReported(carId, description, block.timestamp);
    }

    function addModification(uint256 carId, string memory modification) public {
        require(carNFT.ownerOf(carId) == msg.sender, "Only car owner can add modification");
        _modifications[carId].push(modification);
        emit ModificationAdded(carId, modification, block.timestamp);
    }

    function getServiceHistory(uint256 carId) public view returns (ServiceRecord[] memory) {
        return _serviceHistory[carId];
    }

    function hasAccidentHistory(uint256 carId) public view returns (bool) {
        return _isAccident[carId];
    }

    function getModifications(uint256 carId) public view returns (string[] memory) {
        return _modifications[carId];
    }
} 