import "./IERC721.sol";
import "./Safemath.sol";
import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract Birdcontract is Ownable, Destroyable, IERC721 {

    using SafeMath for uint256;

    string private _name;
    string private _symbol;

    struct Bird {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Bird[] birdies;

    mapping(uint256 => address) public birdOwner;
    mapping(address => uint256) ownsNumberOfTokens;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    constructor (string memory name, string memory symbol) public {
        _name = name;
        _symbol = symbol;
    }

    function balanceOf(address owner) external view returns (uint256 balance) {
        return ownsNumberOfTokens[owner];
    }

    function totalSupply() external view returns (uint256 total) {
        return birdies.length;
    }

    function name() public view returns (string memory){
        return _name;
    }

    function symbol() public view returns (string memory){
        return _symbol;
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        return birdOwner[tokenId];
    }

    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "Use the burn function to burn tokens!");
        require(to != address(this), "Wrong address, try again!");
        require(birdOwner[tokenId] == msg.sender);
        birdOwner[tokenId] = to;
        ownsNumberOfTokens[msg.sender] = ownsNumberOfTokens[msg.sender].sub(1);
        ownsNumberOfTokens[to] = ownsNumberOfTokens[to].add(1);
        emit Transfer(msg.sender, to, tokenId);
    }
}