var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network
ethereum.autoRefreshOnNetworkChange = false;

var birdInstance;
var marketInstance;
var user;
var birdAddress = "0x0e5384260679144dD838d8C126365148748E1b2c";//update after CryptoBirdies is deployed
var marketAddress = "0x6835d70466eC15BD505B4F299aa8AABc329b2287";//update after Marketplace is deployed

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];
        birdInstance = new web3.eth.Contract(abi.birdContract, birdAddress, user, 
            {from: user});
        marketInstance = new web3.eth.Contract(abi.marketContract, marketAddress, 
            user, {from: user});

        birdInstance.events.Birth()
            .on('data', async function (event) {
                let owner = event.returnValues.owner;
                let birdId = event.returnValues.birdId;
                let mumId = event.returnValues.mumId;
                let dadId = event.returnValues.dadId;
                let genes = event.returnValues.genes;
                if (location.href.replace(location.origin,'') == "/client/breeding.html") {
                    $('.evolvingHeart').css("display", "block");
                    $('#breedButton').css("display", "none");
                    $('#dameButton').css("display", "none");
                    $('#sireButton').css("display", "none");
                    $('#swapButton').css("display", "none");
                    await timeout(6000);
                    $('#birdCreation').css("display", "block");
                    $('#birdCreation').text(
                    "Bird successfully created! After confirmation from the blockchain, your new bird will appear in the catalog. Owner: "
                        + owner 
                        + " | BirdID: " + birdId 
                        + " | MumID: " + mumId 
                        + " | DadID: " + dadId
                        + " | Genes: " + genes);
                    await renderChild(birdId);
                    $('#breedFooter').css("top", "-67em");
                } else if (location.href.replace(location.origin,'') == "/client/studio.html") {
                    $('#birdCreation').css("display", "block");
                    $('#birdCreation').text(
                    "Bird successfully created! After confirmation from the blockchain, your new bird will appear in the catalog. Owner: "
                        + owner 
                        + " | BirdID: " + birdId 
                        + " | MumID: " + mumId 
                        + " | DadID: " + dadId
                        + " | Genes: " + genes);
                }
            })
            .on('error', console.error);

        marketInstance.events.MarketTransaction()
            .on('data', (event) => {
                var eventType = event.returnValues.TxType;
                var tokenId = event.returnValues.tokenId;
                if (eventType == "Offer created") {
                    $('#offerCreated').css("display", "block");
                    $('#offerCreated').text(
                    "Offer successfully created! After confirmation from the blockchain, your new offer will appear in the market place. Owner: " 
                    + user + " | BirdID: " + tokenId);
                };
                if (eventType == "Offer removed") {
                    $('#offerRemoved').css("display", "block");
                    $('#offerRemoved').text(
                    "Offer successfully removed! After confirmation from the blockchain, your bird will again appear in the catalog. Owner: " 
                    + user + " | BirdID: " + tokenId);
                };
                if (eventType == "Bird successfully purchased") {
                    $('#birdPurchased').css("display", "block");
                    $('#birdPurchased').text(
                    "Bird successfully purchased! After confirmation from the blockchain, your new bird will appear in the catalog. Owner: " 
                    + user + " | BirdID: " + tokenId);
                };
            })
            .on('error', console.error);
    })
};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkPause() {
    return await marketInstance.methods.isPaused().call();
}

async function pauseResumeContract() {
    if(!await checkPause()){
        await marketInstance.methods.pause().send({}, function(error){
            if (error) {
                console.log(error);
            }});
    } else {
        await marketInstance.methods.resume().send({}, function(error){
            if (error) {
                console.log(error);
            }});
    }
    window.location.reload();
}

async function initializeMarketplace() {
    var marketplaceApprovedOperator = await birdInstance.methods.isApprovedForAll(
        user, marketAddress).call();
    if (marketplaceApprovedOperator == false) {
        await birdInstance.methods.setApprovalForAll(marketAddress, true).send(
            {}, function(error){
            if (error) {
                console.log(error);
            };
        });
    };
}

async function onlyOwnerAccess() {//limits access to studio and pause/resume to contract owner
    $('#pauseMessage').hide();//making sure the message is not displayed by accident
    var owner = await birdInstance.methods.getContractOwner().call();
    var currentUser = await web3.eth.getAccounts();
    for (let i = 0; i < currentUser.length; i++) {

        //logic for owner
        if (currentUser[i] == owner) {
            $('#designStudio').show();
            if(await checkPause()) {
                $('#pauseButton').text('Resume Contract');
            } else {
                $('#pauseButton').text('Pause Contract');
            }
            $('#pauseButton').show();


        //logic for other users
        } else {
            $('#designStudio').hide();
            $('#pauseButton').hide();
            if (location.href.replace(location.origin,'') == "/client/studio.html") {
                window.location.href = "./index.html";
            }
        }
    }
 
    //Pause message applies to all users
    if(await checkPause()) {
        $('#pauseMessage').show();
        $('#withdrawBox').hide();
    } else {
        $('#pauseMessage').hide();
        $('#withdrawBox').show();
    }

    //event listener for pause button
    $('#pauseButton').click(async ()=>{
        if(await checkPause()) {
            alert('Are you sure you want to RESUME withdrawFunds() and buyBird() for all users?');
        } else {
            alert('Are you sure you want to PAUSE withdrawFunds() and buyBird() for all users?');
        }
        await pauseResumeContract();
    })
}

async function withdraw() {
    await marketInstance.methods.withdrawFunds().send({}, function(error){
        if (error) {
            console.log(error);
        };
    })
}

async function returnBalance() {
    var balance;
    try {
        balance = await marketInstance.methods.getBalance().call();
        if (balance >= 0) {
            return web3.utils.fromWei(balance);
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

async function sellBird(price, id) {
    var inWei = web3.utils.toWei(price, "ether");
    if (inWei < 0) {alert("Please enter a valid amount")};
    await marketInstance.methods.setOffer(inWei, id).send({}, function(error){
        if (error) {
            console.log(error);
        };
    })
}

async function removeOffer(id) {
    await marketInstance.methods.removeOffer(id).send({}, function(error){
        if (error) {
            console.log(error);
        };
    })
}

async function buyBird(price, id) {
    var inWei = web3.utils.toWei(price, "ether");
    await marketInstance.methods.buyBird(id).send({ value: inWei }, function(error){
        if (error) {
            console.log(error);
        };
    })
}

async function getPrice(id) {
    var result;
    try {
        result = await marketInstance.methods.getOffer(id).call();
        if (result.price > 0 && result.active == true) {
            ethPrice = web3.utils.fromWei(result.price, "ether");
            return ethPrice;
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

async function createBird() {
    await birdInstance.methods.createBirdGen0(getDna()).send({}, function(error){
        if (error) {
            console.log(error);
        };
    })
};

async function getBirdsOfOwner() {
    var ids = [];
    try {
        ids = await birdInstance.methods.getAllBirdsOfOwner(user).call();
    } catch (error) {
        console.log(error);
    }
    return ids;
};

async function getBirdsOnSale() {
    var ids = [];
    try {
        ids = await marketInstance.methods.getAllTokensOnSale().call();
    } catch (error) {
        console.log(error);
    }
    return ids;
}

async function buildCatalog(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        appendBirdToCatalog(bird, ids[i]);
    }
    activateCatalogEventListeners();//must be activated after all buttons are rendered.
}

async function buildModal(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        //console.log(bird);
        appendBirdToModal(bird, ids[i]);
    }
}

async function buildMarket(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        //console.log(bird);
        await appendBirdToMarket(bird, ids[i]);
    }
    await activateBuyButtonListener();//must be activated after all buttons are rendered.
}

async function buildOffers(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        //console.log(bird);
        await appendBirdToOffers(bird, ids[i]);
    }
    activateCancelButtonListener();
}

async function getBirdDna(id) {
    return await birdInstance.methods.getBird(id).call();
}

async function breedBird(dadId, mumId) {
    await birdInstance.methods.breed(dadId, mumId).send({}, function(error){
        if (error) {
            console.log(error);
        };
    })
};