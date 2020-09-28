import "./IERC721.sol";
import "./Safemath.sol";
import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract Birdcontract is Ownable, Destroyable, IERC721 {

    using SafeMath for uint256;

    string public constant name = "AngryBirdsontheBlock";
    string public constant symbol = "ABBX";

    struct Bird {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Bird[] birdies;

    mapping(uint256 => address) public birdIndexToOwner;
    mapping(address => uint256) addressOwnsNumberOfTokens;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);




    function balanceOf(address owner) external view returns (uint256 balance) {
        return addressOwnsNumberOfTokens[owner];
    };

    /*
     * @dev Returns the total number of tokens in circulation.
     */
    function totalSupply() external view returns (uint256 total);

    /*
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory tokenName);

    /*
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory tokenSymbol);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);


     /* @dev Transfers `tokenId` token from `msg.sender` to `to`.
     *
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `to` can not be the contract address.
     * - `tokenId` token must be owned by `msg.sender`.
     *
     * Emits a {Transfer} event.
     */


    function name() public view returns (string memory){
        return _name;
    }
    
    function symbol() public view returns (string memory){
        return _symbol;
    }
    
    function decimals() public view returns (uint8){
        return _decimals;
    }
    
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view returns (uint256){
        return _balances[account];
    }
    
    function mint(address account, uint256 amount) public onlyOwner{
        require(account != address(0), "You can't mint to the burn address!");
        _balances[account] = _balances[account].add(amount);
        _totalSupply = _totalSupply.add(amount);
    }
    
    function transfer(address recipient, uint256 amount) public returns (bool){
        require(recipient != address(0), "Use the burn function for burning!");
        require(_balances[msg.sender] >= amount, "Insufficient Funds!");
        _balances[msg.sender] -= _balances[msg.sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        return true;
    }

}