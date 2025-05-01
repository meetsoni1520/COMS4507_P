// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarNFT is ERC721, Ownable {
    struct CarDetails {
        string vin;
        string ppsr;
        string make;
        string model;
        string color;
        string licensePlate;
        uint256 year;
    }

    mapping(uint256 => CarDetails) private _carDetails;
    uint256 private _tokenIdCounter;

    event CarRegistered(uint256 indexed tokenId, string vin, string licensePlate);

    constructor() ERC721("AutoProof Car", "CAR") {}

    function registerCar(
        string memory vin,
        string memory ppsr,
        string memory make,
        string memory model,
        string memory color,
        string memory licensePlate,
        uint256 year,
        address owner
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _carDetails[tokenId] = CarDetails({
            vin: vin,
            ppsr: ppsr,
            make: make,
            model: model,
            color: color,
            licensePlate: licensePlate,
            year: year
        });

        _safeMint(owner, tokenId);
        emit CarRegistered(tokenId, vin, licensePlate);
        return tokenId;
    }

    function getCarDetails(uint256 tokenId) public view returns (
        string memory vin,
        string memory ppsr,
        string memory make,
        string memory model,
        string memory color,
        string memory licensePlate,
        uint256 year
    ) {
        require(_exists(tokenId), "Car does not exist");
        CarDetails memory car = _carDetails[tokenId];
        return (
            car.vin,
            car.ppsr,
            car.make,
            car.model,
            car.color,
            car.licensePlate,
            car.year
        );
    }
} 