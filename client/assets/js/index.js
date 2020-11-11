$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    await onlyOwnerAccess();
});