import "./IERC721.sol";
import "./SafeMath.sol";
import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract AngryBirds is Ownable, Destroyable, IERC721 {

    using SafeMath for uint256;

    uint256 public constant maxGen0Birds = 16;
    uint256 public gen0Counter = 0;

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
    mapping(uint256 => address) public _Approval;//which bird is approved to be transfered by an address other than the owner
    mapping(address => mapping (address => bool)) private _operatorApprovals;//approval to handle all tokens of an address by another
    //_operatorApprovals[myaddress][operatoraddress] = true/false;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    event Birth(address owner, uint256 birdId, uint256 mumId, uint256 dadId, uint256 genes);

    constructor(string memory name, string memory symbol) public {
        _name = name;
        _symbol = symbol;
    }

    function createBirdGen0(uint256 genes) public onlyOwner returns (uint256) {
        require(gen0Counter <= maxGen0Birds, "Maximum number of Birds is reached. No new birds allowed!");
        gen0Counter = gen0Counter.add(1);
        return _createBird(0, 0, 0, genes, msg.sender);
    }

    function _createBird(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        Bird memory _bird = Bird({
            genes: _genes,
            birthTime: uint64(now),
            mumId: uint32(_mumId),  //easier to input 256 and later convert to 32.
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });
        uint256 newBirdId = birdies.push(_bird).sub(1);//want to start with zero.
        emit Birth(_owner, newBirdId, _mumId, _dadId, _genes);
        _transfer(address(0), _owner, newBirdId);//transfer from nowhere. Creation event.
        return newBirdId;
    }

    function getBird(uint256 tokenId) external view returns (
        uint256 genes,
        uint256 birthTime,
        uint256 mumId,
        uint256 dadId,
        uint256 generation) //code looks cleaner when the params appear here vs. in the return statement.
        {
            require(tokenId < birdies.length, "Token ID doesn't exist.");
            Bird storage bird = birdies[tokenId];//saves space over using memory, which would make a copy
            
            genes = bird.genes;
            birthTime = uint256(bird.birthTime);
            mumId = uint256(bird.mumId);
            dadId = uint256(bird.dadId);
            generation = uint256(bird.generation);
        }

    function getAllBirdsOfOwner(address owner) external view returns(uint256[] memory) {
        uint256[] memory allBirdsOfOwner = new uint[](ownsNumberOfTokens[owner]);
        uint256 j = 0;
        for (uint256 i = 0; i < birdies.length; i++) {
            if (birdOwner[i] == owner) {
                allBirdsOfOwner[j] = i;
                j = j.add(1);
            }
        }
        return allBirdsOfOwner;
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
        require(tokenId < birdies.length, "Token ID doesn't exist.");
        return birdOwner[tokenId];
    }

    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "Use the burn function to burn tokens!");
        require(to != address(this), "Wrong address, try again!");
        require(birdOwner[tokenId] == msg.sender);
        _transfer(msg.sender, to, tokenId);
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        ownsNumberOfTokens[_to] = ownsNumberOfTokens[_to].add(1);
        birdOwner[_tokenId] = _to;
        
        if (_from != address(0)) {
            ownsNumberOfTokens[_from] = ownsNumberOfTokens[_from].sub(1);
        }

        emit Transfer(_from, _to, _tokenId);
    }
}