// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";
import "./Mileages.sol";

contract Controls {

    struct Control {
        string vin;
        uint[] blocksNums;
    }

    mapping(string => Control) controlMap;

    event ControlDone(
        string vin,
        string regCertStatus
    );

    function regControl(string memory _vin, string memory _regCertStatus, uint _mileage, address _vehiclesContract, address _mileagesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));
        require(
            keccak256(abi.encodePacked(_regCertStatus)) == keccak256(abi.encodePacked("V")) ||
            keccak256(abi.encodePacked(_regCertStatus)) == keccak256(abi.encodePacked("I")),
            "Registration certificate status should be V (Valid) or I (Invalid)!"
        );

        uint[] storage blocks = controlMap[_vin].blocksNums;
        blocks.push(block.number);

        Control memory newControl = Control(_vin, blocks);
        controlMap[_vin] = newControl;

        vehicles.setRegCertStatus(_vin, _regCertStatus);

        Mileages mileages = Mileages(_mileagesContract);
        mileages.regMileage(_vin, _mileage, _vehiclesContract);

        emit ControlDone(_vin, _regCertStatus);
    }

    function getBlocksNums(string memory _vin) external view returns(uint[] memory _blocksNums) {
        return controlMap[_vin].blocksNums;
    }
    
}