// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
contract BiletNFT is ERC721URIStorage, Ownable {
    uint256 public nextID = 1;
    uint256 public pretBilet;
    uint256 public nrTotalBilete;
    uint256 public bileteVandute;
    address public eventContract;
    mapping(address => uint256[]) public bileteDetinute;
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

    function getBileteDetinute(address user) external view returns (uint256[] memory) {
        console.log("biletele lui %s", user);
        for(uint256 i = 0; i < bileteDetinute[user].length; i++)
            console.log("biletul %d", bileteDetinute[user][i]);
        
    }

    event BiletCumparat(address indexed cumparator, uint256 indexed idBilet);
    event TransferBilet(address indexed deLa, address indexed catre, uint256 indexed idBilet);

function cumparaBilet() external payable {
    require(msg.value == pretBilet, "Suma de ETH incorect trimisa");
    require(bileteVandute < nrTotalBilete, "Nu mai sunt bilete disponibile");

    uint256 ticketId = nextID;
    _safeMint(msg.sender, ticketId); 
    bileteDetinute[msg.sender].push(ticketId); 

    console.log("bilet %d mintat pt %s", ticketId, msg.sender);

    require(ownerOf(ticketId) == msg.sender, "Bilet mintat pe o alta adresa!");

    emit BiletCumparat(msg.sender, ticketId);
    payable(eventContract).transfer(msg.value);

    nextID++;
    bileteVandute++;
}



function transferBilet(address to, uint256 ticketId) external {
    console.log("Transf bilet %d catre %s", ticketId, to);
    console.log("Proprietar: %s", ownerOf(ticketId));
    console.log("cn trimite: %s", msg.sender);

    uint256[] storage bilete = bileteDetinute[msg.sender];
    bool found = false;
    for (uint256 i = 0; i < bilete.length; i++) {
        console.log("Bilet %d la idx %d", bilete[i], i);
        if (bilete[i] == ticketId) {
            found = true;
            console.log("Bilet gasit in mapping!");
            bilete[i] = bilete[bilete.length - 1];
            bilete.pop();
            break;
        }
    }
    require(found, "Biletul nu a fost gasit!");

    console.log("bilet -> %s", to);
    bileteDetinute[to].push(ticketId);
    _transfer(msg.sender, to, ticketId);
    emit TransferBilet(msg.sender, to, ticketId);
}
function refundTransfer(address from, address to, uint256 ticketId) external {
    uint256[] storage bilete = bileteDetinute[from];
    bool found = false;
    for (uint256 i = 0; i < bilete.length; i++) {
        if (bilete[i] == ticketId) {
            found = true;
            bilete[i] = bilete[bilete.length - 1];
            bilete.pop();
            break;
        }
    }
    require(found, "Biletul nu a fost gasit!");
    bileteDetinute[to].push(ticketId);
    _transfer(from, to, ticketId);
    emit TransferBilet(from, to, ticketId);
}



}
