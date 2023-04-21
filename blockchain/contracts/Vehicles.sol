// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Owners.sol";

contract Vehicles {

    struct Vehicle {
        string vin;
        string brand;
        string model;
        string regCertStatus;
    }

    string[] private vinNumbers;
    mapping(string => Vehicle) vehiclesMap;

    event VehicleAdded(
        string vin,
        string model,
        string brand
    );

    function addVehicle(string memory _vin, string[] memory _vehicleDetails, string[] memory _ownerDetails, address _ownersContract) external {

        require(checkVehicleExists(_vin) == false, "Vehicle already exists!");

        vinNumbers.push(_vin);

        Vehicle memory newVehicle = Vehicle(_vin, _vehicleDetails[0], _vehicleDetails[1], "V");
        vehiclesMap[_vin] = newVehicle;

        emit VehicleAdded(_vin, _vehicleDetails[0], _vehicleDetails[1]);

        Owners owners = Owners(_ownersContract);
        owners.setOwnerInfo(_vin, _ownerDetails[0], _ownerDetails[1], _ownerDetails[2], _ownerDetails[3], address(this));
    }

    function setRegCertStatus(string memory _vin, string memory _status) external {
        vehiclesMap[_vin].regCertStatus = _status;
    }

    function getVinNumbers() external view returns (string[] memory) {
        return vinNumbers;
    }

    function getBasicVehicleInfo(string memory _vin) external view returns(string memory _brand, string memory _model, string memory _regCertStatus) {
        Vehicle memory v = vehiclesMap[_vin];
        return (v.brand, v.model, v.regCertStatus);
    }

    function checkVehicleExists(string memory _vin) public view returns(bool) {
        return bytes(vehiclesMap[_vin].vin).length > 0;
    }
    
}