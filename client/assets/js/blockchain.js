var web3 = new Web3(Web3.givenProvider);//MetaMask will inject the selected network

var instance;
var user;
var contractAddress = "0x1aD1aF3121d65d92E981bc9B8522AB6850f38f40";

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
                $('#birdCreation').text("Owner: " + owner 
                                    + " | BirdID: " + birdId 
                                    + " | MumID: " + mumId 
                                    + " | DadID: " + dadId
                                    + " | Genes: " + genes);
                alert("Bird created successfully on blockchain!");
            })
            .on('error', console.error);
    });
});

function sendBirdToBlockchain() {
    instance.methods.createBirdGen0(getDna()).send({}, function(error, txHash){//web3 sends to smart contract
        if(error) {
            alert("Error: " + error);
        } else {
            alert("Success! tx Hash = " + txHash);
        }
    })
};