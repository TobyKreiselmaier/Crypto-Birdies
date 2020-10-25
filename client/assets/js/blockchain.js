var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network
ethereum.autoRefreshOnNetworkChange = false;

var birdInstance;
var marketInstance;
var user;
var birdAddress = "0x048088a3285ac27C5C5696feEBab830253346E8E";//update after AngryBirds is deployed
var marketAddress = "0xa77F326A3329349D5F0bB0862B1419937d79fFC6";//update after Marketplace is deployed

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];

        birdInstance = new web3.eth.Contract(abi.birdContract, birdAddress, user, {from: user});
        marketInstance = new web3.eth.Contract(abi.marketContract, marketAddress, user, {from: user});

        birdInstance.events.Birth()
            .on('data', (event) => {
                console.log(event);
                let owner = event.returnValues.owner;
                let birdId = event.returnValues.birdId;
                let mumId = event.returnValues.mumId;
                let dadId = event.returnValues.dadId;
                let genes = event.returnValues.genes;
                $('#birdCreation').css("display", "block");
                $('#birdCreation').text("Bird successfully created! After confirmation from the blockchain, your new bird will appear in the catalog. This may take up to a couple of minutes. Owner: " + owner 
                                    + " | BirdID: " + birdId 
                                    + " | MumID: " + mumId 
                                    + " | DadID: " + dadId
                                    + " | Genes: " + genes);
            })
            .on('error', console.error);
        
        marketInstance.events.MarketTransaction()
            .on('data', (event) => {
                console.log(event);
                var eventType = event.returnValues.TxType;
                var tokenId = event.returnValues.tokenId;
                if (eventType == "Offer created") {
                    $('#offerCreated').css("display", "block");
                    $('#offerCreated').text("Offer successfully created! After confirmation from the blockchain, your new offer will appear in the market place. This may take up to a couple of minutes. Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
                if (eventType == "Offer removed") {
                    $('#offerRemoved').css("display", "block");
                    $('#offerRemoved').text("Offer successfully removed! After confirmation from the blockchain, your bird will again appear in the catalog. This may take up to a couple of minutes. Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
                if (eventType == "Bird successfully purchased") {
                    $('#birdPurchased').css("display", "block");
                    $('#birdPurchased').text("Bird successfully purchased! After confirmation from the blockchain, your new bird will appear in the catalog. This may take up to a couple of minutes. Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
            })
            .on('error', console.error);
    })
};

async function initializeMarketplace() {
    var marketplaceApprovedAsOperator = await birdInstance.methods.isApprovedForAll(user, marketAddress).call();
    if (marketplaceApprovedAsOperator == false) {
        await birdInstance.methods.setApprovalForAll(marketAddress, true).send({}, function(error, txHash){
            if (error) {
                console.log(error);
            };
            if (txHash) {
                console.log(txHash);
            };
        });
    };
}

async function accessStudio() {//limits access to contract owner
    var owner = await birdInstance.methods.getContractOwner().call();
    var currentUser = await web3.eth.getAccounts();
    for (let i = 0; i < currentUser.length; i++) {
        if (currentUser[i] == owner) {
            $('#designStudio').show();
        } else {
            $('#designStudio').hide();
            if (location.href.replace(location.origin,'') == "/client/studio.html") {
                window.location.href = "./index.html";
            }
        }
    }
}

async function sellBird(price, id) {
    var inWei = web3.utils.toWei(price, "ether");
    if (inWei < 0) {alert("Please enter a valid amount")};
    await marketInstance.methods.setOffer(inWei, id).send({}, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
        };
    })
}

async function removeOffer(id) {
    await marketInstance.methods.removeOffer(id).send({}, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
        };
    })
}

async function buyBird(price, id) {
    var inWei = web3.utils.toWei(price, "ether");
    await marketInstance.methods.buyBird(id).send({ value: inWei }, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
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
    await birdInstance.methods.createBirdGen0(getDna()).send({}, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
        };
    })
};

async function getBirdsOfOwner() {
    var arrayOfIds = [];
    try {
        arrayOfIds = await birdInstance.methods.getAllBirdsOfOwner(user).call();
        console.log(arrayOfIds);
    } catch (error) {
        console.log(error);
    }
    return arrayOfIds;
};

async function getBirdsOnSale() {
    var arrayOfIds = [];
    try {
        arrayOfIds = await marketInstance.methods.getAllTokensOnSale().call();
        console.log(arrayOfIds);
    } catch (error) {
        console.log(error);
    }
    return arrayOfIds;
}

async function buildCatalog(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        appendBirdToCatalog(bird, arrayOfIds[i]);
    }
    activateCatalogEventListeners();//must be activated after all buttons are rendered.
}

async function buildModal(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        appendBirdToModal(bird, arrayOfIds[i]);
    }
}

async function buildMarket(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        await appendBirdToMarket(bird, arrayOfIds[i]);
    }
    activateBuyButtonListener();//must be activated after all buttons are rendered.
}

async function buildOffers(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        await appendBirdToOffers(bird, arrayOfIds[i]);
    }
    activateCancelButtonListener();
}

async function getBirdDna(id) {
    return await birdInstance.methods.getBird(id).call();
}

async function breedBird(mumId, dadId) {
    await birdInstance.methods.breed(dadId, mumId).send({}, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
        };
    })
};