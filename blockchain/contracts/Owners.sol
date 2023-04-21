// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";

contract Owners {

    struct Ownership {
        string vin;
        string regNum;
        string owner;
        string co_owner;
        string regProvince;
        uint[] blocksNums;
    }

    mapping(string => Ownership) ownershipMap;

    event OwnerChanged(
        string vin,
        string regNum,
        string owner,
        string co_owner,
        string regProvince
    );

    function setOwnerInfo(string memory _vin, string memory _regNum, string memory _owner, string memory _co_owner, string memory _regProvince, address _vehiclesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));

        uint[] storage blocks = ownershipMap[_vin].blocksNums;
        blocks.push(block.number);

        Ownership memory newOwnership = Ownership(_vin, _regNum, _owner, _co_owner, _regProvince, blocks);
        ownershipMap[_vin] = newOwnership;

        emit OwnerChanged(_vin, _regNum, _owner, _co_owner, _regProvince);
    }

    function getOwnerInfo(string memory _vin) external view returns(string memory _regNum, string memory _owner, string memory _co_owner, string memory _regProvince) {
        Ownership memory o = ownershipMap[_vin];
        return (o.regNum, o.owner, o.co_owner, o.regProvince);
    }

    //SPRÓBOWAĆ WDROŻYĆ JAKIŚ UNIWERSALNY MECHANIZM NA PRZECHOWYWANIE NUMERÓW BLOKÓW
    function getBlocksNums(string memory _vin) external view returns(uint[] memory _blocksNums) {
        return ownershipMap[_vin].blocksNums;
    }
    
}