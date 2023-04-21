// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";
import "./Mileages.sol";

contract Inspections {

    struct Inspection {
        string vin;
        string insResult;
        uint validity;
        uint[] blocksNums;
    }

    mapping(string => Inspection) inspectionMap;

    event InspectionDone(
        string vin,
        string insResult
    );

    function regInspection(string memory _vin, string memory _insResult, uint _mileage, address _vehiclesContract, address _mileagesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));
        require(
            keccak256(abi.encodePacked(_insResult)) == keccak256(abi.encodePacked("P")) ||
            keccak256(abi.encodePacked(_insResult)) == keccak256(abi.encodePacked("N")),
            "Inspection result should be P (Positive) or N (Negative)!"
        );

        uint validity;
        uint[] storage blocks = inspectionMap[_vin].blocksNums;
        blocks.push(block.number);

        if (keccak256(abi.encodePacked(_insResult)) == keccak256(abi.encodePacked("P"))) {
            validity = block.timestamp + 31536000; //data teraz + 1 rok, zastanowić czy jakoś można to ugrać w zależności od wieku 
            vehicles.setRegCertStatus(_vin, "V");
        } else {
            vehicles.setRegCertStatus(_vin, "I");
        }

        Inspection memory newInspection = Inspection(_vin, _insResult, validity, blocks);
        inspectionMap[_vin] = newInspection;

        Mileages mileages = Mileages(_mileagesContract);
        mileages.regMileage(_vin, _mileage, _vehiclesContract);

        emit InspectionDone(_vin, _insResult);
    }

    function getInspectionInfo(string memory _vin) external view returns(string memory _insResult, uint _validity) {
        Inspection memory i = inspectionMap[_vin];
        return (i.insResult, i.validity);
    }

    function getBlocksNums(string memory _vin) external view returns(uint[] memory _blocksNums) {
        return inspectionMap[_vin].blocksNums;
    }
    
}