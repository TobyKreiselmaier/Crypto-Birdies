var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network

var instance;
var user;
var contractAddress = "0x2B34fB3CFdEfC6F326bB0AF30E682f2eCc5c974d";

$('#connectbutton').click( async ()=>{
    await window.ethereum.enable().then(function(accounts){
        user = accounts[0];
        connectWallet(user);
        instance.events.Birth()
            .on('data', function(event){
                console.log(event);
                let owner = event.returnValues.owner;
                let birdId = event.returnValues.birdId;
                let mumId = event.returnValues.mumId;
                let dadId = event.returnValues.dadId;
                let genes = event.returnValues.genes;
                $('#birdCreation').css("display", "block");
                $('#birdCreation').text("Bird successfully created on the blockchain! Owner: " + owner 
                                    + " | BirdID: " + birdId 
                                    + " | MumID: " + mumId 
                                    + " | DadID: " + dadId
                                    + " | Genes: " + genes);
            })
            .on('error', console.error);
    })
});

function sendBirdToBlockchain() {
    instance.methods.createBirdGen0(getDna()).send({}, function(error, txHash){
        if(error) {
            alert("Error: " + error);
        }
    })
}

async function connectWallet(user) {
    instance = await new web3.eth.Contract(abi, contractAddress, user);
}

async function getBirdsOfOwner() {
    var arrayOfIds = [];
    var birdy;
    try {
        arrayOfIds = await instance.methods.getAllBirdsOfOwner(user).call();
    } catch (error) {
        console.log(error);
    }
    for (let i = 0; i < arrayOfIds.length; i++) {
        birdy = await instance.methods.getBird(arrayOfIds[i]).call();
        console.log(arrayOfIds[i]);
        console.log(birdy);
        appendBird(birdy, i)
    }
    console.log(birdy);
    return birdy;
}