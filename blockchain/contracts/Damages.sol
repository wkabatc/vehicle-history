// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";
import "./Mileages.sol";

contract Damages {

    struct Damage {
        string vin;
        uint date;
        string place;
        string desc;
        uint damageVal;
        string[] photosHashes;
        uint[] blocksNums;
    }

    mapping(string => Damage) damageMap;

    event DamageRegistered(
        string vin,
        uint date,
        string place,
        string desc,
        uint damageVal,
        uint mileage,
        string[] photosHashes
    );

    function regDamage(string memory _vin, uint _date, string memory _place, string memory _desc, uint _damageVal, uint _mileage, string[] memory _photosHashes, address _vehiclesContract, address _mileagesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));

        string[] storage photos = damageMap[_vin].photosHashes;
        
        for (uint i = 0; i < _photosHashes.length; i++) {
            photos.push(_photosHashes[i]);
        }

        uint[] storage blocks = damageMap[_vin].blocksNums;
        blocks.push(block.number);

        Damage memory newDamage = Damage(_vin, _date, _place, _desc, _damageVal, photos, blocks);
        damageMap[_vin] = newDamage;

        Mileages mileages = Mileages(_mileagesContract);
        mileages.regMileage(_vin, _mileage, _vehiclesContract);

        emit DamageRegistered(_vin, _date, _place, _desc, _damageVal, _mileage, _photosHashes);
    }

    function getPhotosHashes(string memory _vin) external view returns(string[] memory _blocksNums) {
        return damageMap[_vin].photosHashes;
    }

    function getBlocksNums(string memory _vin) external view returns(uint[] memory _blocksNums) {
        return damageMap[_vin].blocksNums;
    }
    
}