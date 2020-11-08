pragma solidity ^0.5.12;

import "./IERC721Receiver.sol"; 

contract TestErc is IERC721Receiver {

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}