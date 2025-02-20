// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Event.sol";

contract EventFactory {
    mapping(uint256 => address) public evenimente;
    uint256 public nextEventId;

    event EventCreat(address indexed adresaEvent, string eveniment, uint256 pretBilet, uint256 disponibilitateBilete);

    function createEvent(string memory _eveniment, uint256 _pretBilet, uint256 _disponibilitateBilete) external {
        Event e = new Event(_eveniment, _pretBilet, _disponibilitateBilete);
        evenimente[nextEventId] = address(e);
        emit EventCreat(address(e), _eveniment, _pretBilet, _disponibilitateBilete);
        nextEventId++;
    }

    function getEvents() external view returns (address[] memory) {
        address[] memory e = new address[](nextEventId);
        for (uint256 i = 0; i < nextEventId; i++) {
            e[i] = evenimente[i];
        }
        return e;
    }
}