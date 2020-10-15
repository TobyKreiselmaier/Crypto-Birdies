var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network

var instance;
var user;
var contractAddress = "0xf2AFcEb59f87488127e5302a388CaB496D184DA2";//update after contract is deployed

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];
        instance = new web3.eth.Contract(abi, contractAddress, user, {from: user});
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
};

async function sendBirdToBlockchain() {
    await instance.methods.createBirdGen0(getDna()).send({}, function(error, txHash){
        if(error) {
            alert(error);
        }
    })
};

async function getBirdsOfOwner() {
    var arrayOfIds = [];
    var bird;
    try {
        arrayOfIds = await instance.methods.getAllBirdsOfOwner(user).call();
        console.log(arrayOfIds);
    } catch (error) {
        console.log(error);
    }
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await instance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        appendBird(bird, i)
    }
    return bird;
};

async function breedBird(mumId, dadId) {
    await instance.methods.breed(mumId, dadId).send({}, function(error, txHash){
        if(error) {
            alert(error);
        }
    })
};