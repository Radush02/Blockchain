// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Event.sol";

contract EventFactory {
    mapping(uint256 => Event) public evenimente;
    uint256 public nextEventId;

    event EventCreat(address adresaEvent, string eveniment, uint256 pretBilet, uint256 disponibilitateBilete);

    function createEvent(
        string memory _eveniment,
        uint256 _pretBilet,
        uint256 _disponibilitateBilete
    ) external {
        Event e = new Event(_eveniment, _pretBilet, _disponibilitateBilete);
        evenimente[nextEventId] = e;
        emit EventCreat(address(e), _eveniment, _pretBilet, _disponibilitateBilete);
        nextEventId++;
    }

    function getEvent(uint256 _id) external view returns (Event) {
        return evenimente[_id];
    }
}