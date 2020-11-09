$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    $('#pauseMessage').hide();//making sure the message is not displayed by accident
    await connectWallet();
    await onlyOwnerAccess();
})