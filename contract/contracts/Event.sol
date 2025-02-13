// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./BiletNFT.sol";
import "hardhat/console.sol";

//https://stackoverflow.com/questions/71646570/how-to-implement-onerc721received-function
//pt a folosi _safeMint in loc de _mint
contract Event is Ownable,IERC721Receiver {
    string public eveniment;
    uint256 public pretBilet;
    uint256 public disponibilitateBilete;
    bool public anulat;
    BiletNFT public bilet;
    mapping(uint256 => uint256) public escrow;
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    constructor(
        string memory _eveniment, 
        uint256 _pretBilet, 
        uint256 _disponibilitateBilete
    ) Ownable(msg.sender) {
        eveniment = _eveniment;
        pretBilet = _pretBilet;
        disponibilitateBilete = _disponibilitateBilete;
        anulat = false;
        bilet = new BiletNFT(_eveniment, "BILET", _pretBilet, _disponibilitateBilete, address(this));
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

    uint256 ticketId = bilet.nextID();
    bilet.cumparaBilet{value: msg.value}();
    bilet.transferBilet(msg.sender, ticketId);
    escrow[ticketId] = msg.value; 
    emit BiletCumparatEvent(msg.sender);
}
    

    function anuleazaEvent() external onlyOwner {
        anulat = true;
        emit EventAnulat();
    }
    
function refundBilet(uint256 ticketId) external {
    require(anulat, "Evenimentul nu este anulat");
    console.log("ID bilet: %s", ticketId);
    console.log("cn detine: %s", bilet.ownerOf(ticketId));
    console.log("cn trimite: %s", msg.sender);
    console.log("%s", bilet.ownerOf(ticketId) == msg.sender);
    console.log("owner event: %s", owner());
    bilet.getBileteDetinute(msg.sender);
    require(bilet.ownerOf(ticketId) == msg.sender, "Nu esti detinatorul acestui bilet");
    require(address(this).balance >= pretBilet, "Fonduri insuficiente pentru refund");

    bilet.refundTransfer(msg.sender, owner(), ticketId);
    payable(msg.sender).transfer(pretBilet); 

    emit RefundCerut(msg.sender, ticketId);
}

    receive() external payable {}

    function withdraw() external onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "Nu sunt fonduri de retras");
    
    payable(owner()).transfer(balance);
    }


}