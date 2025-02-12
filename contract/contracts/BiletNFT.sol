// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BiletNFT is ERC721URIStorage, Ownable {
    uint256 public nextID = 1;
    uint256 public pretBilet;
    uint256 public nrTotalBilete;
    uint256 public bileteVandute;
    address public eventContract;
    constructor(
        string memory _numeEvent,
        string memory _simbolEvent,
        uint256 _pretBilet,
        uint256 _nrTotalBilete,
        address _eventContract
    ) ERC721(_numeEvent, _simbolEvent) Ownable(msg.sender) {
        pretBilet = _pretBilet;
        nrTotalBilete = _nrTotalBilete;
        eventContract = _eventContract;
    }

    event BiletCumparat(address indexed cumparator, uint256 indexed idBilet);
    event TransferBilet(address indexed deLa, address indexed catre, uint256 indexed idBilet);
    
    function cumparaBilet() external payable {
        require(msg.value == pretBilet, "Suma de ETH incorect trimisa");
        require(bileteVandute < nrTotalBilete, "Nu mai sunt bilete disponibile");

        _mint(msg.sender, nextID);
        emit BiletCumparat(msg.sender, nextID);
        nextID++;
        bileteVandute++;
        payable(eventContract).transfer(msg.value);
    }

    function transferBilet(address to, uint256 ticketId) external {
        require(ownerOf(ticketId) == msg.sender, "Nu esti proprietarul acestui bilet");

        _transfer(msg.sender, to, ticketId);
        emit TransferBilet(msg.sender, to, ticketId);
    }
}
