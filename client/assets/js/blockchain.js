var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network
ethereum.autoRefreshOnNetworkChange = false;

var birdInstance;
var marketInstance;
var user;
var birdAddress = "0xD666b2c74EaD8Fb45208B86732C9eD61C4f5e5aC";//update after AngryBirds is deployed
var marketAddress = "0xcd5fEB9CC97A2Fada429ac87094CaC90c248EC97";//update after Marketplace is deployed

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];

        birdInstance = new web3.eth.Contract(abi.birdContract, birdAddress, user, {from: user});
        marketInstance = new web3.eth.Contract(abi.marketContract, marketAddress, user, {from: user});

        birdInstance.events.Birth()
            .on('data', async function (event) {
                //console.log(event);
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
                    $('#birdCreation').text("Bird successfully created! After confirmation from the blockchain, your new bird will appear in the catalog in a few moments. Owner: " + owner 
                                        + " | BirdID: " + birdId 
                                        + " | MumID: " + mumId 
                                        + " | DadID: " + dadId
                                        + " | Genes: " + genes);
                    await renderChild(birdId);
                    $('#breedFooter').css("top", "-67em");
                } else if (location.href.replace(location.origin,'') == "/client/studio.html") {
                    $('#birdCreation').css("display", "block");
                    $('#birdCreation').text("Bird successfully created! After confirmation from the blockchain, your new bird will appear in the catalog in a few moments. Owner: " + owner 
                                        + " | BirdID: " + birdId 
                                        + " | MumID: " + mumId 
                                        + " | DadID: " + dadId
                                        + " | Genes: " + genes);
                }
            })
            .on('error', console.error);

        marketInstance.events.MarketTransaction()
            .on('data', (event) => {
                //console.log(event);
                var eventType = event.returnValues.TxType;
                var tokenId = event.returnValues.tokenId;
                if (eventType == "Offer created") {
                    $('#offerCreated').css("display", "block");
                    $('#offerCreated').text("Offer successfully created! After confirmation from the blockchain, your new offer will appear in the market place. Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
                if (eventType == "Offer removed") {
                    $('#offerRemoved').css("display", "block");
                    $('#offerRemoved').text("Offer successfully removed! After confirmation from the blockchain, your bird will again appear in the catalog. Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
                if (eventType == "Bird successfully purchased") {
                    $('#birdPurchased').css("display", "block");
                    $('#birdPurchased').text("Bird successfully purchased! After confirmation from the blockchain, your new bird will appear in the catalog. Owner: " + user 
                                        + " BirdID: " + tokenId);
                };
            })
            .on('error', console.error);
    })
};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initializeMarketplace() {
    var marketplaceApprovedOperator = await birdInstance.methods.isApprovedForAll(user, marketAddress).call();
    if (marketplaceApprovedOperator == false) {
        await birdInstance.methods.setApprovalForAll(marketAddress, true).send({}, function(error){
            if (error) {
                console.log(error);
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
    var arrayOfIds = [];
    try {
        arrayOfIds = await birdInstance.methods.getAllBirdsOfOwner(user).call();
    } catch (error) {
        console.log(error);
    }
    return arrayOfIds;
};

async function getBirdsOnSale() {
    var arrayOfIds = [];
    try {
        arrayOfIds = await marketInstance.methods.getAllTokensOnSale().call();
        //console.log(arrayOfIds);
    } catch (error) {
        console.log(error);
    }
    return arrayOfIds;
}

async function buildCatalog(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        //console.log(bird);
        appendBirdToCatalog(bird, arrayOfIds[i]);
    }
    activateCatalogEventListeners();//must be activated after all buttons are rendered.
}

async function buildModal(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        //console.log(bird);
        appendBirdToModal(bird, arrayOfIds[i]);
    }
}

async function buildMarket(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        //console.log(bird);
        await appendBirdToMarket(bird, arrayOfIds[i]);
    }
    activateBuyButtonListener();//must be activated after all buttons are rendered.
}

async function buildOffers(arrayOfIds){
    for (let i = 0; i < arrayOfIds.length; i++) {
        bird = await birdInstance.methods.getBird(arrayOfIds[i]).call();
        //console.log(bird);
        await appendBirdToOffers(bird, arrayOfIds[i]);
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