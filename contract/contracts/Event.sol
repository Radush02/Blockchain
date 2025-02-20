// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./BiletNFT.sol";

contract Event is Ownable, IERC721Receiver {
    string public eveniment;
    uint256 public pretBilet;
    bool public anulat;
    BiletNFT public bilet;
    mapping(address => uint256) public retrageri;

  
    event RefundCerut(address indexed detinator, uint256 indexed idBilet);
    event BiletCumparatEvent(address indexed cumparator);

    constructor(
        string memory _eveniment, 
        uint256 _pretBilet, 
        uint256 _disponibilitateBilete
    ) Ownable(msg.sender) {
        eveniment = _eveniment;
        pretBilet = _pretBilet;
        bilet = new BiletNFT(_eveniment, "BILET", _pretBilet, _disponibilitateBilete, address(this));
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function cumparaBilet() external payable {
        require(!anulat, "Evenimentul este anulat");
        require(msg.value == pretBilet, "Suma ETH gresita");
        bilet.cumparaBilet{value: msg.value}(msg.sender);
        emit BiletCumparatEvent(msg.sender);
    }

    function anuleazaEvent() external onlyOwner {
        anulat = true;
    }

    function refundBilet(uint256 ticketId) external {
        require(anulat, "Evenimentul nu este anulat");
        require(bilet.ownerOf(ticketId) == msg.sender, "Nu detii acest bilet");
        bilet.refundTransfer(msg.sender, address(this), ticketId);
        retrageri[msg.sender] += pretBilet;
        emit RefundCerut(msg.sender, ticketId);
    }

    function withdraw() external {
        uint256 amount = retrageri[msg.sender];
        require(amount > 0, "Nu ai fonduri de retras");
        retrageri[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer esuat");
    }

    receive() external payable {}
}