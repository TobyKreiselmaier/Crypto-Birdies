var ids;
var onSale;
var inMarket;
var inOffers;

$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    await onlyOwnerAccess();
    ids = await getBirdsOfOwner();
    onSale = await getBirdsOnSale();
    inMarket = onSale.filter(x => !ids.includes(x));//offers of other users
    inMarket = inMarket.filter(x => !["0"].includes(x));//remove Bird0
    inOffers = onSale.filter(x => ids.includes(x));//user's offers
    await buildMarket(inMarket);//build market
    await buildOffers(inOffers);//build offers
    activateMouseListeners();
});

async function appendBirdToMarket(dna, id) {
    var price = await getPrice(id);
    marketBox(price, id);
    renderBird(`#BirdBox${id}`, birdDna(dna), id);
};

async function appendBirdToOffers(dna, id) {
    var price = await getPrice(id);
    offerBox(price, id);
    renderBird(`#BirdBox${id}`, birdDna(dna), id);
};

function marketBox(price, id) {//used for offers of other users
    var boxDiv =    `<div id="BirdBox` + id + `" class="col-lg-3 buyBox CatalogBox m-2 light-b-shadow">
                        <div class="bird">
                            <div class="tail">
                                <div class="tail_top"></div>
                                <div class="tail_middle"></div>
                                <div class="tail_bottom"></div>
                            </div>
                            <div class="feather">
                                <div class="feather_top"></div>
                                <div class="feather_bottom"></div>
                            </div>
                            <div class="bird_body">
                                <div class="bird_body bird_body_inner"></div>
                                <div class="deco_1"></div>
                                <div class="deco_2"></div>
                                <div class="deco_3"></div>
                                <div class="deco_4"></div>
                            </div>
                            <div class="belly"></div>
                            <div class="face">
                                <div class="eye eye_right">
                                    <div class="eyebrow"></div>
                                    <div class="pupil"></div>
                                </div>
                                <div class="eye eye_left">
                                    <div class="eyebrow"></div>
                                    <div class="pupil"></div>
                                </div>
                                <div class="beak">
                                    <div class="beak_upper"></div>
                                    <div class="beak_lower"></div>
                                </div>
                            </div>
                        </div>
                        
                        <br>
                        <div class="dnaDiv">
                            <b>
                                <div id="idData">
                                    ID:
                                    <span>` + id + `</span>
                                </div>
                                <div id="genData">
                                    GEN:
                                    <span id="generation` + id + `"></span>
                                </div><br>
                                <div id="mumData">
                                    MUM:
                                    <span id="mum` + id + `"></span>
                                </div>
                                <div id="dadData">
                                    DAD:
                                    <span align="right" id="dad` + id + `"></span><br>
                                </div><br>    
                                DNA:
                                        <span id="dnaTopFeather` + id + `"></span>
                                        <span id="dnaBodyFeather` + id + `"></span>
                                        <span id="dnaTopBeak` + id + `"></span>
                                        <span id="dnaBottomBeak` + id + `"></span>
                                        <span id="dnaEyesShape` + id + `"></span>
                                        <span id="dnaDecorationPattern` + id + `"></span>
                                        <span id="dnaDecorationAtEye` + id + `"></span>
                                        <span id="dnaDecorationMid` + id + `"></span>
                                        <span id="dnaDecorationSmall` + id + `"></span>
                                        <span id="dnaAnimation` + id + `"></span><br>
                                    <ul class="ml-4">
                                        <li class="bottomList"><span id="bottomeyetext` 
                                            + id + `"></span></li>
                                        <li class="bottomList"><span id="bottomdecorationpatterntext` 
                                            + id + `"></span></li>
                                        <li class="bottomList"><span id="bottomanimationtext` 
                                            + id + `"></span></li>
                                    </ul>
                                <div align="center">
                                    ASKING PRICE: ` + price + ` ETH
                                </div>
                            </b>
                            <div class="input-group mb-3">
                                <div class="input-group-append">
                                    <button id="buyButton` + id + `" 
                                        class="btn btn-success buyButton rounded-lg" 
                                        type="button" id="button-addon2">Buy Bird</button>
                                </div>
                            </div>
                        </div>
                    </div>`
    $('.marketOffers').append(boxDiv);
};

function offerBox(price, id) {//used for offers of current user
    var boxDiv =    `<div id="BirdBox` + id + `" class="col-lg-3 offerBox CatalogBox m-2 light-b-shadow">
                        <div class="bird">
                            <div class="tail">
                                <div class="tail_top"></div>
                                <div class="tail_middle"></div>
                                <div class="tail_bottom"></div>
                            </div>
                            <div class="feather">
                                <div class="feather_top"></div>
                                <div class="feather_bottom"></div>
                            </div>
                            <div class="bird_body">
                                <div class="bird_body bird_body_inner"></div>
                                <div class="deco_1"></div>
                                <div class="deco_2"></div>
                                <div class="deco_3"></div>
                                <div class="deco_4"></div>
                            </div>
                            <div class="belly"></div>
                            <div class="face">
                                <div class="eye eye_right">
                                    <div class="eyebrow"></div>
                                    <div class="pupil"></div>
                                </div>
                                <div class="eye eye_left">
                                    <div class="eyebrow"></div>
                                    <div class="pupil"></div>
                                </div>
                                <div class="beak">
                                    <div class="beak_upper"></div>
                                    <div class="beak_lower"></div>
                                </div>
                            </div>
                        </div>
                        
                        <br>
                        <div class="dnaDiv">
                            <b>
                                <div id="idData">
                                    ID:
                                    <span>` + id + `</span>
                                </div>
                                <div id="genData">
                                    GEN:
                                    <span id="generation` + id + `"></span>
                                </div><br>
                                <div id="mumData">
                                    MUM:
                                    <span id="mum` + id + `"></span>
                                </div>
                                <div id="dadData">
                                    DAD:
                                    <span align="right" id="dad` + id + `"></span><br>
                                </div><br>
                                DNA:
                                        <span id="dnaTopFeather` + id + `"></span>
                                        <span id="dnaBodyFeather` + id + `"></span>
                                        <span id="dnaTopBeak` + id + `"></span>
                                        <span id="dnaBottomBeak` + id + `"></span>
                                        <span id="dnaEyesShape` + id + `"></span>
                                        <span id="dnaDecorationPattern` + id + `"></span>
                                        <span id="dnaDecorationAtEye` + id + `"></span>
                                        <span id="dnaDecorationMid` + id + `"></span>
                                        <span id="dnaDecorationSmall` + id + `"></span>
                                        <span id="dnaAnimation` + id + `"></span><br>
                                    <ul class="ml-4">
                                        <li class="bottomList"><span id="bottomeyetext` 
                                            + id + `"></span></li>
                                        <li class="bottomList"><span id="bottomdecorationpatterntext` 
                                            + id + `"></span></li>
                                        <li class="bottomList"><span id="bottomanimationtext` 
                                            + id + `"></span></li>
                                    </ul>
                                <div align="center">
                                    ASKING PRICE: ` + price + ` ETH
                                </div>
                            </b>
                            <div class="input-group mb-3">
                                <div class="input-group-append">
                                    <button id="cancelButton` + id + `" 
                                        class="btn btn-danger cancelButton rounded-lg" 
                                        type="button" id="button-addon2">Cancel Offer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`
    $('.myOffers').append(boxDiv);
};

//Listener for eye animation
function activateMouseListeners() {
    $('.CatalogBox').on("mousemove", () => {
        var eyeballs = $('.eyesFollow');
        document.onmousemove = function(event) {
            var x = event.clientX * 65 / window.innerWidth + "%";
            var y = event.clientY * 65 / window.innerHeight + "%";
            for (let i = 0; i < eyeballs.length; i++) {
                eyeballs[i].style.left = x;
                eyeballs[i].style.top = y;
            };
        };
    });
};

//Listeners for buttons
async function activateBuyButtonListeners() {
    if(await checkPause()) {
        $(`[id^='buyButton']`).hide();
    } else {
        $(`[id^='buyButton']`).show();
        $(`[id^='buyButton']`).on("click", async function() {
            await initializeMarketplace();
            //make sure marketplace contract is approved as operator for user
            var id = $(this).attr("id").substring(9);//extract bird ID from HTML
            var price = await getPrice(id);
            $(`#BirdBox${id}`).remove();//remove bird from DOM
            await buyBird(price, id);
        });
    };
};

function activateCancelButtonListeners() {
    $(`[id^='cancelButton']`).on("click", async function() {
        await initializeMarketplace();
        //make sure marketplace contract is approved as operator for user
        var id = $(this).attr("id").substring(12);//extract bird ID from HTML
        $(`#BirdBox${id}`).remove();//remove bird from DOM
        await removeOffer(id);
    });
};