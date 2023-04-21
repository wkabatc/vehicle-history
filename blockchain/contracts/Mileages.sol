// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";

contract Mileages {

    struct VehicleMileage {
        string vin;
        uint mileage;
        uint[] blocksNums;
    }

    mapping(string => VehicleMileage) vehMileageMap;

    event MileageChanged(
        string vin,
        uint mileage
    );

    function regMileage(string memory _vin, uint _mileage, address _vehiclesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));

        uint[] storage blocks = vehMileageMap[_vin].blocksNums;
        blocks.push(block.number);

        VehicleMileage memory newMileage = VehicleMileage(_vin, _mileage, blocks);
        vehMileageMap[_vin] = newMileage;

        emit MileageChanged(_vin, _mileage);
    }

    function getMileage(string memory _vin) external view returns(uint _mileage) {
        return vehMileageMap[_vin].mileage;
    }

    function getBlocksNums(string memory _vin) external view returns(uint[] memory _blocksNums) {
        return vehMileageMap[_vin].blocksNums;
    }

}