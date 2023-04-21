// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./Vehicles.sol";

contract Stealings {

    struct Stealing {
        string vin;
        uint date;
        string place;
        string description;
        uint[] blocksNums;
    }

    mapping(string => Stealing) stealingMap;

    event StealingReported(
        string vin,
        string place,
        uint date,
        string description
    );

    function reportStealing(string memory _vin, string memory _place, uint _date, string memory _description, address _vehiclesContract) external {

        Vehicles vehicles = Vehicles(_vehiclesContract);
        require(vehicles.checkVehicleExists(_vin) == true, string(abi.encodePacked("Vehicle ", _vin, " not found!")));

        uint[] storage blocks = stealingMap[_vin].blocksNums;
        blocks.push(block.number);

        Stealing memory newStealing = Stealing(_vin, _date, _place, _description, blocks);
        stealingMap[_vin] = newStealing;

        emit StealingReported(_vin, _place, _date, _description);
    }

    function getBlocksNums(string memory _vin) external view returns(uint[] memory _blocksNums) {
        return stealingMap[_vin].blocksNums;
    }
    
}