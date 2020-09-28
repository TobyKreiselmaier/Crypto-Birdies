import "./IERC721.sol";
import "./Safemath.sol";
import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract Birdcontract is Ownable, Destroyable, IERC721 {

    using SafeMath for uint256;

    string public constant name = "AngryBirdontheBlock";
    string public constant symbol = "ABBX";

    struct Bird {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Bird[] birdies; //actual tokens are in this array;

    mapping(uint256 => address) public birdOwner;//id will return owner of token;
    mapping(address => uint256) ownsNumberOfTokens;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    function balanceOf(address owner) external view returns (uint256 balance) {
        return ownsNumberOfTokens[owner];
    }

    function totalSupply() external view returns (uint256 total) {
        return birdies.length();
    }

    function name() external view returns (string memory tokenName) {
        return name;
    }

    function symbol() external view returns (string memory tokenSymbol) {
        return symbol;
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        return birdOwner[tokenId];
    }

    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "Use the burn function to burn tokens!");
        require(to != address(this), "Wrong address, try again!");
        require(birdOwner[tokenId] == msg.sender);
        birdOwner[tokenID] = to;
        ownsNumberOfTokens[msg.sender] = ownsNumberOfTokens[msg.sender].sub(1);
        ownsNumberOfTokens[to] = ownsNumberOfTokens[to].add(1);
        emit Transfer(msg.sender, to, tokenId);
    }
};