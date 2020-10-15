var dameId = -1;
var sireId = -1;

$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    await getBirdsOfOwner();
});



//Listener for buttons
$('#Dame').click(async ()=>{
}

$('#breed').click(async ()=>{
    if (dameId != sireId && dameId >= 0 && sireId >= 0) {
        await breedBird(dameId, sireId);
        window.location.href = "./catalog.html";
    } else {
        alert("Dame and Sire must be selected and may not be the same bird");
    }
})

