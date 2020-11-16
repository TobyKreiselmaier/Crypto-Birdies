var web3 = new Web3(Web3.givenProvider);//Wallet will inject the selected network
ethereum.autoRefreshOnNetworkChange = false;

var birdInstance;
var marketInstance;
var user;
var access = false;
var birdAddress = "0x70e2324ccf7a76e201dff26d4749ed1bb821c305"; //Ropsten: 0x70e2324ccf7a76e201dff26d4749ed1bb821c305
var marketAddress = "0x78ad2f9c3924278692125a23ed05d4e5facfd97c"; // Ropsten: 0x78ad2f9c3924278692125a23ed05d4e5facfd97c

async function connectWallet() {
    return window.ethereum.enable().then(function(accounts){
        user = accounts[0];
        birdInstance = new web3.eth.Contract(abi.birdContract, birdAddress, {from: user});
        marketInstance = new web3.eth.Contract(abi.marketContract, marketAddress, {from: user});

        birdInstance.events.Birth()
            .on('data', async function (event) {
                let owner = event.returnValues.owner;
                let birdId = event.returnValues.birdId;
                let mumId = event.returnValues.mumId;
                let dadId = event.returnValues.dadId;
                let genes = event.returnValues.genes;

                //check if the event belongs to one of the currently connected addresses
                access = await isCurrentUserOwner(owner);

                //birth events
                if (location.href.includes("breeding") && (access)) {
                    $('#birdCreation').text(
                    "A new bird is born! Your baby bird will appear in the catalog after confirmation from the blockchain. Owner: "
                        + owner 
                        + " | BirdID: " + birdId 
                        + " | MumID: " + mumId 
                        + " | DadID: " + dadId
                        + " | Genes: " + genes);
                    await renderChild(birdId);
                    $('#breedAgainButton').css("display", "block");
                    $('#breedFooter').css("top", "-65.5em");
                    $('#breedAgainButton').on("click", () => {
                        location.reload();
                    });
                } else if (location.href.includes("studio") && (access)) {
                    $('#birdCreation').css("display", "block");
                    $('#birdCreation').text(
                    "Bird successfully created! After confirmation from the blockchain, your new bird will appear in the catalog. Owner: "
                        + owner 
                        + " | BirdID: " + birdId 
                        + " | MumID: " + mumId 
                        + " | DadID: " + dadId
                        + " | Genes: " + genes);
                };
            })
            .on('error', console.error);

        marketInstance.events.MarketTransaction()
            .on('data', async function (event) {
                let eventType = event.returnValues.TxType;
                let owner = event.returnValues.owner;
                let tokenId = event.returnValues.tokenId;

                //check if the event belongs to one of the currently connected addresses
                access = await isCurrentUserOwner(owner);
                
                //events
                if ((eventType == "Offer created") && (access)) {
                    $('#offerCreated').css("display", "block");
                    $('#offerCreated').text(
                    "Offer successfully created! After confirmation from the blockchain, your new offer will appear in the market place. Owner: " 
                    + owner + " | BirdID: " + tokenId);
                };
                if ((eventType == "Offer removed") && (access)) {
                    $('#offerRemoved').css("display", "block");
                    $('#offerRemoved').text(
                    "Offer successfully removed! After confirmation from the blockchain, your bird will again appear in the catalog. Owner: " 
                    + user + " | BirdID: " + tokenId);
                };
                if ((eventType == "Bird successfully purchased") && (access)) {
                    $('#birdPurchased').css("display", "block");
                    $('#birdPurchased').text(
                    "Bird successfully purchased! After confirmation from the blockchain, your new bird will appear in the catalog. Owner: " 
                    + user + " | BirdID: " + tokenId);
                };
            })
            .on('error', console.error);
    });
};

async function isCurrentUserOwner(eventOwner) {
    var currentUsers = await web3.eth.getAccounts();
    for (let i = 0; i < currentUsers.length; i++) {
        if (currentUsers[i] == eventOwner) {
            return true;
        } else {
            return false;
        };
    };
};

async function checkPause() {
    return await marketInstance.methods.isPaused().call();
};

async function pauseResumeContract() {
    $('#pauseMessage').show();
    $('#pauseMessage').text("Waiting for confirmations from blockchain...");
    if(!await checkPause()){
        await marketInstance.methods.pause().send({}, function(error){
            if (error) {
                console.log(error);
            }});
    } else {
        await marketInstance.methods.resume().send({}, function(error){
            if (error) {
                console.log(error);
            };
        });
    };
    window.location.reload();
};

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
};

async function onlyOwnerAccess() {//limits access to studio and pause/resume to contract owner
    var owner = await birdInstance.methods.getContractOwner().call();
    var currentUser = await web3.eth.getAccounts();
    for (let i = 0; i < currentUser.length; i++) {

        //logic for owner
        if (currentUser[i] == owner) {
            $('#designStudio').show();
            if(await checkPause()) {
                $('#pauseButton').text('Resume Contract');
                $('#pauseButton').show();
            } else {
                $('#pauseButton').text('Pause Contract');
                $('#pauseButton').show();
            };
            $('#pauseButton').show();

        //logic for other users
        } else {
            $('#designStudio').hide();
            $('#pauseButton').hide();
            if (location.href.replace(location.origin,'') == "/client/studio.html") {
                window.location.href = "./index.html";
            };
        };
    };
 
    //Pause message applies to all users
    if(await checkPause()) {
        $('#pauseMessage').show();
        $('#withdrawBox').hide();
    } else {
        $('#pauseMessage').hide();
        $('#withdrawBox').show();
    };

    //event listener for pause button
    $('#pauseButton').click(async ()=>{
        if(await checkPause()) {
            alert('Are you sure you want to RESUME withdrawFunds() and buyBird() for all users?');
        } else {
            alert('Are you sure you want to PAUSE withdrawFunds() and buyBird() for all users?');
        };
        await pauseResumeContract();
    });
};

async function withdraw() {
    await marketInstance.methods.withdrawFunds().send({}, function(error){
        if (error) {
            $('#withdrawButton').show();
            console.log(error);
        };
    });
};

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
    };
};

async function sellBird(price, id) {
    $('#offerCreated').css("display", "block");
    $('#offerCreated').text("Waiting for confirmations from blockchain...");
    var inWei = web3.utils.toWei(price, "ether");
    if (inWei < 0) {alert("Please enter a valid amount")};
    await marketInstance.methods.setOffer(inWei, id).send({}, function(error){
        if (error) {
            $(`#birdPrice${id}`).show();
            $(`#offerButton${id}`).show();
            console.log(error);
        };
    });
};

async function removeOffer(id) {
    $('#offerRemoved').css("display", "block");
    $('#offerRemoved').text("Waiting for confirmations from blockchain...");
    await marketInstance.methods.removeOffer(id).send({}, function(error){
        if (error) {
            $(`#cancelButton${id}`).show();
            console.log(error);
        };
    });
};

async function buyBird(price, id) {
    $('#birdPurchased').css("display", "block");
    $('#birdPurchased').text("Waiting for confirmations from blockchain...");
    var inWei = web3.utils.toWei(price, "ether");
    await marketInstance.methods.buyBird(id).send({ value: inWei }, function(error){
        if (error) {
            $(`#buyButton${id}`).show();
            console.log(error);
        };
    });
};

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
    };
};

async function createBird() {
    await birdInstance.methods.createBirdGen0(getDna()).send({}, function(error){
        if (error) {
            console.log(error);
        };
    });
};

async function getBirdsOfOwner() {
    var ids = [];
    try {
        ids = await birdInstance.methods.getAllBirdsOfOwner(user).call();
    } catch (error) {
        console.log(error);
    };
    return ids;
};

async function getBirdsOnSale() {
    var ids = [];
    try {
        ids = await marketInstance.methods.getAllTokensOnSale().call();
    } catch (error) {
        console.log(error);
    };
    return ids;
};

async function buildCatalog(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        appendBirdToCatalog(bird, ids[i]);
    };
    activateCatalogEventListeners();//must be activated after all buttons are rendered.
};

async function buildModal(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        appendBirdToModal(bird, ids[i]);
    };
};

async function buildMarket(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        await appendBirdToMarket(bird, ids[i]);
    };
    await activateBuyButtonListeners();//must be activated after all buttons are rendered.
};

async function buildOffers(ids){
    for (let i = 0; i < ids.length; i++) {
        bird = await birdInstance.methods.getBird(ids[i]).call();
        await appendBirdToOffers(bird, ids[i]);
    };
    activateCancelButtonListeners();
};

async function getBirdDna(id) {
    return await birdInstance.methods.getBird(id).call();
};

async function breedBird(dadId, mumId) {
    $('#birdCreation').show();
    $('#birdCreation').text("Waiting for confirmations from blockchain...");
    $('.evolvingHeart').show();
    $('#breedButton').hide();
    $('#dameButton').hide();
    $('#sireButton').hide();
    $('#swapButton').hide();
    $('#breedFooter').css("top", "-99em");
    await birdInstance.methods.breed(dadId, mumId).send({}, function(error){
        if (error) {
            $('#birdCreation').hide();
            $('.evolvingHeart').hide();
            $('#breedButton').show();
            $('#dameButton').show();
            $('#sireButton').show();
            $('#breedFooter').css("top", "-33em");
            if(ids.length == 2) {
                $('#swapButton').show();
            };
            console.log(error);
        };
    });
};