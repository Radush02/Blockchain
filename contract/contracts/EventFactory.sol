// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Event.sol";

contract EventFactory {
    Event[] public evenimente;

    event EventCreat(address adresaEvent, string eveniment, uint256 pretBilet, uint256 disponibilitateBilete);

    function createEvent(
        string memory _eveniment,
        uint256 _pretBilet,
        uint256 _disponibilitateBilete
    ) external {
        Event e = new Event(_eveniment, _pretBilet, _disponibilitateBilete);
        evenimente.push(e);
        emit EventCreat(address(e), _eveniment, _pretBilet, _disponibilitateBilete);
    }

    function getEvenimente() external view returns (Event[] memory) {
        return evenimente;
    }
}