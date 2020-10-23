var arrayOfIdsOfOwner;
var arrayOfIdsOnSale;
var arrayOfIdsToDisplayInCatalog;

$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    await initializeMarketplace();//allow Marketplace contract to handle offers.
    arrayOfIdsOfOwner = await getBirdsOfOwner();
    arrayOfIdsOnSale = await getBirdsOnSale();
    if (arrayOfIdsOfOwner == "") {
        alert("You currently don't own any birds. Please get some in the market place.");
        window.location.href = "./market.html";
    } else {
        if (arrayOfIdsOnSale == "") {
            arrayOfIdsToDisplayInCatalog = arrayOfIdsOfOwner;
        } else {
            arrayOfIdsToDisplayInCatalog = arrayOfIdsOfOwner.filter(x => !arrayOfIdsOnSale.includes(x));//all birds of this user not on sale
        }
        await buildCatalog(arrayOfIdsToDisplayInCatalog);
    }
})

function appendBirdToCatalog(dna, id) {
    catalogBox(id);
    renderBird(`#BirdBox${id}`, birdDna(dna), id);
}

function catalogBox(id) {
    var boxDiv =    `<div id="BirdBox` + id + `" class="col-lg-3 catalogBox m-2 light-b-shadow">
                        <div class="angryBird_Red">
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
                                        <li class="bottomList"><span id="bottomeyetext` + id + `"></span></li>
                                        <li class="bottomList"><span id="bottomdecorationpatterntext` + id + `"></span></li>
                                        <li class="bottomList"><span id="bottomanimationtext` + id + `"></span></li>
                                    </ul>
                            </b>
                            <div class="input-group mb-3">
                                <input id="birdPrice` + id + `" type="text" class="form-control" placeholder="Amount in ETH" aria-label="Amount in ETH" aria-describedby="button-addon2">
                                <div class="input-group-append">
                                    <button id="offerButton` + id + `" class="btn btn-success submitButton" type="button" id="button-addon2">Submit Offer</button>
                                </div>
                            </div>
                        </div>
                    </div>`
    $('.row').append(boxDiv);
}

//Listener for offer buttons
function activateClickListener() {
    $(`[id^='offerButton']`).on("click", async function() {
        var id = $(this).attr("id").substring(11);//extract id from HTML.
        var price = $(`#birdPrice${id}`).val();//get price of the bird with the same id as the button
        await sellBird(price, id);
        $('.row').empty();//clear catalog content
        arrayOfIdsOnSale = await getBirdsOnSale();
        arrayOfIdsToDisplayInCatalog = arrayOfIdsOfOwner.filter(x => !arrayOfIdsOnSale.includes(x));//all birds of this user not on sale
        await buildCatalog(arrayOfIdsToDisplayInCatalog);//repopulate catalog with remaining birds
    })
}