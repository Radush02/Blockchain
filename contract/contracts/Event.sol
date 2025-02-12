// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BiletNFT.sol";
import "hardhat/console.sol";

contract Event is Ownable {
    string public eveniment;
    uint256 public pretBilet;
    uint256 public disponibilitateBilete;
    bool public anulat;
    BiletNFT public bilet;
    
    constructor(
        string memory _eveniment, 
        uint256 _pretBilet, 
        uint256 _disponibilitateBilete
    ) Ownable(msg.sender) {
        eveniment = _eveniment;
        pretBilet = _pretBilet;
        disponibilitateBilete = _disponibilitateBilete;
        anulat = false;
        bilet = new BiletNFT(_eveniment, "BILET", _pretBilet, _disponibilitateBilete,owner());
    }
    
    event EventAnulat();
    event RefundCerut(address indexed detinator, uint256 indexed idBilet);
    event BiletCumparatEvent(address indexed cumparator);

    function setBilet(address _Bilet) external onlyOwner {
        bilet = BiletNFT(_Bilet);
    }

    function cumparaBilet() external payable {
        require(!anulat, "Evenimentul este anulat");
        require(msg.value == pretBilet, "Suma ETH gresita");

        bilet.cumparaBilet{value: msg.value}();
        emit BiletCumparatEvent(msg.sender);
    }
    

    function anuleazaEvent() external onlyOwner {
        anulat = true;
        emit EventAnulat();
    }
    
    function refundBilet(uint256 ticketId) external {
        require(anulat, "Evenimentul nu este anulat");
        require(address(this).balance >= pretBilet, "Fonduri insuficiente pentru refund");

        bilet.transferBilet(owner(),ticketId);
        payable(msg.sender).transfer(pretBilet);
        emit RefundCerut(msg.sender, ticketId);
    }
    receive() external payable {}
}