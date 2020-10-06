var web3 = new Web3(Web3.givenProvider);//MetaMask will inject the selected network

var instance;
var user;
var contractAddress = "0x2B34fB3CFdEfC6F326bB0AF30E682f2eCc5c974d";

$(document).ready(function(){
    window.ethereum.enable().then(function(accounts){//will ask user to connect MetaMask
        instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
        //abi = Application Binary Interface (var created from contract.json as separate js file.
        //It contains the sum of everything the contract does)
        user = accounts[0];                          //almost always there will be only one account
        console.log(instance);

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

})

function sendBirdToBlockchain() {
    instance.methods.createBirdGen0(getDna()).send({}, function(error, txHash){//web3 sends to smart contract
        if(error) {
            alert("Error: " + error);
        } //success handled in birth event.
    })
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