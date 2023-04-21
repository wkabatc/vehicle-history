// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";

contract Policies {

    struct Policy {
        string vin;
        uint policyNum;
        bool oc;
        bool ac;
        bool nnw;
        bool assistance;
        uint validFrom;
        uint validTo;
    }

    mapping(string => Policy) policyMap;

    event PolicyEntered(
        string vin,
        uint policyNum,
        uint validTo
    );

    function enterPolicy(string memory _vin, uint _policyNum, bool _oc, bool _ac, bool _nnw, bool _assistance, uint _validFrom, uint _validTo, address _vehiclesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));

        Policy memory newPolicy = Policy(_vin, _policyNum, _oc, _ac, _nnw, _assistance, _validFrom, _validTo);
        policyMap[_vin] = newPolicy;

        emit PolicyEntered(_vin, _policyNum, _validTo);
    }

    function getPolicyInfo(string memory _vin) public view returns (uint _policyNum, bool _oc, bool _ac, bool _nnw, bool _assistance, uint _validFrom, uint _validTo) {
        Policy memory p = policyMap[_vin];
        return (p.policyNum, p.oc, p.ac, p.nnw, p.assistance, p.validFrom, p.validTo);
    }

}