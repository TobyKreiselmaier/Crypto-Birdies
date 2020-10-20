var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network
ethereum.autoRefreshOnNetworkChange = false;

var birdInstance;
var marketInstance;
var user;
var contractAddress = "0xE8433C8E647F1a017aB3489B29730E1f8CCB6b76";//update after contract is deployed
var marketAddress = "0xc5937769c13134988B136c0Aca9c33a8f9043D07";//update after contract is deployed

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];

        birdInstance = new web3.eth.Contract(abi.birdContract, contractAddress, user, {from: user});
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
                $('#birdCreation').text("Bird successfully created! Owner: " + owner 
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
                    $('#offerCreated').text("Offer successfully created! Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
                if (eventType == "Offer removed") {
                    $('#offerRemoved').css("display", "block");
                    $('#offerRemoved').text("Offer successfully removed! Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
                if (eventType == "Bird successfully purchased") {
                    $('#birdPurchased').css("display", "block");
                    $('#birdPurchased').text("Bird successfully purchased! Owner: " + user 
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

async function sellBird(price, id) {
    if (parseInt(price) > 0) {
        var inWei = web3.utils.toWei(price, "ether");
    } else {
        alert("Please enter a number")
    };
    await marketInstance.methods.setOffer(inWei, id).send({}, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
        };
    })
}

async function cancelOffer(id) {
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
    if (parseInt(price) > 0) {
        var inWei = web3.utils.toWei(price, "ether");
    } else {
        alert("Please enter a number")
    };
    await marketInstance.methods.buyBird(id).send({ value: inWei }, function(error, txHash){
        if (error) {
            console.log(error);
        };
        if (txHash) {
            console.log(txHash);
        };
    })
}

async function onSale(id) {
    var result;
    try {
        result = await marketInstance.methods.getOffer(id).call();
        if (result.price > 0 && result.active == true) {
            ethPrice = web3.utils.fromWei(result.price, "ether");
            return { seller: result.seller, price: ethPrice, onsale: result.active };
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
}

async function buildOffers(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        console.log(bird);
        await appendBirdToOffers(bird, arrayOfIds[i]);
    }
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