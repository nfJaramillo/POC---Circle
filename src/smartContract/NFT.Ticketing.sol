// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract NFT_Ticketing is ERC1155, AccessControl, ERC1155Holder  {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping (uint256 => string) private _uris;
    mapping (uint256 => uint256) private _prices;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant COLLECTOR_ROLE = keccak256("COLLECTOR_ROLE");
    bytes32 public constant EDITOR_ROLE = keccak256("EDITOR_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");


    constructor()  ERC1155("NFT_Ticketing") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

   
    
     function mintNFT(uint256 amount, string memory uri, uint256 price) public onlyRole(MINTER_ROLE) returns (uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(address(this), newItemId, amount, "");
        _uris[newItemId] = uri; 
        _prices[newItemId] = price;
        return newItemId;
    }

    function setTokenUri(uint256 tokenId, string memory uri) public onlyRole(EDITOR_ROLE){
        _uris[tokenId] = uri; 
    }

     function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl, ERC1155Receiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function burnAll(uint256 tokenId) public onlyRole(BURNER_ROLE) {
        _burn(address(this),tokenId, balanceOf(address(this),tokenId));
    }

    function purchase(uint256 tokenId, uint256 amount) public payable {
        require (msg.value >= _prices[tokenId] * amount, "Fondos insuficientes");
        ERC1155 token = ERC1155(address(this));
        token.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
    }

    function withdraw () public onlyRole(WITHDRAWER_ROLE) payable {
        payable(msg.sender).transfer(address(this).balance);
    }

    function collect(address owner, uint256 tokenId, uint256 amount) public onlyRole(COLLECTOR_ROLE) {
        _burn(owner, tokenId, amount);
    }


}