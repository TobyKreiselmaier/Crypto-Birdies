import "./IERC721.sol";
import "./Safemath.sol";
import "./Ownable.sol";
import "./Destroyable.sol";

pragma solidity 0.5.12;

contract Birdcontract is Ownable, Destroyable, IERC721 {

    using SafeMath for uint256;

    string private _name;
    string private _symbol;
    uint8 private _decimals;
    
    uint256 private _totalSupply;
    
    mapping (address => uint256) private _balances;

    constructor(string memory name, string memory symbol, uint8 decimals) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

interface IERC721 {
    /**
     * @dev Emitted when `tokenId` token is transfered from `from` to `to`.
     */
    

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

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
    function transfer(address to, uint256 tokenId) external;
}


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