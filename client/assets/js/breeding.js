var dameId;
var sireId;
var ids;

$(document).ready(async () => { //when page is loaded, get latest instance of blockchain
    await connectWallet(); //connect MetaMask (if not already connected)
    await onlyOwnerAccess();
    ids = await getBirdsOfOwner(); //fill array with ids for all birds of this address
    dameId = ids[0];
    sireId = ids[1];
    if (ids.length == 2) { //user must own at least two birds to continue
        await renderDameAndSire(dameId, sireId);
        $('#swapButton').css("display", "block");
        $('#swapButton').click(async function() { //swap dame and sire if only 2 birds in array
            var helper = dameId;
            dameId = sireId;
            sireId = helper;
            await renderDameAndSire(dameId, sireId);
        })
    } else if (ids.length > 2) {
        $('#swapButton').css("display", "none");
        await buildModal(ids); //iterates through array and returns full info from blockchain
        await renderDameAndSire(ids[0], ids[1]);
    }
});

function appendBirdToModal(dna, id) {
    modalBox(id);
    renderBird(`#BirdBox${id}`, birdDna(dna), id);
}

async function setUpModal() {
    $('.row').empty(); //clear modal content
    ids = await getBirdsOfOwner(); //get a fresh array from the blockcahin
    var index = ids.findIndex(bird => bird == dameId); //search for dame
    if (index >= 0) { //make sure element is in array
        ids.splice(index, 1); //remove current dame from array
    };
    index = ids.findIndex(bird => bird == sireId);
    if (index >= 0) { //make sure element is in array
        ids.splice(index, 1); //remove current sire from array
    };
    await buildModal(ids); //iterates through array and returns full info from blockchain
    $('#birdSelection').modal('show'); //open modal
}

async function renderDameAndSire(dameId, sireId) {
    dameBox(dameId);
    var dna = await getBirdDna(dameId);//returns bird instance from blockchain
    var obj = birdDna(dna, dameId);//creates dna object for rendering
    renderBird(`#dameBox`, obj, dameId);//renders bird
    sireBox(sireId);
    dna = await getBirdDna(sireId)
    obj = birdDna(dna, sireId);
    renderBird(`#sireBox`, obj, sireId);
}

async function renderChild(id) {
    childBox(id);
    var dna = await getBirdDna(id);
    var obj = birdDna(dna, id);
    renderBird(`#childBox`, obj, id);
}

//Listeners for buttons
$('#dameButton').on("click", async function() {
    await setUpModal();
    selectDame(); //functionality when dame is to be selected
})

$('#sireButton').on("click", async function() {
    await setUpModal();
    selectSire();//modal functionality when sire is to be selected
})

$('#breedButton').click(async ()=>{ //sends parent IDs to blockchain with request to breed child
    await breedBird(sireId, dameId);
})

//Listeners for selections
function selectDame(){
    $(`[id^='BirdBox']`).off("click");
    $(`[id^='BirdBox']`).on("click", async function() { //arrow function ES6 doesn't work with $(this)
        dameId = $(this).attr("id").substring(7); //works after removing arrow function.
        dameBox(dameId);//render box
        var dna = await getBirdDna(dameId)
        var obj = birdDna(dna, dameId);
        renderBird(`#dameBox`, obj, dameId);//render bird
        $('#birdSelection').modal('toggle'); //close modal
    });
}

function selectSire(){
    $(`[id^='BirdBox']`).off("click");
    $(`[id^='BirdBox']`).on("click", async function() { //arrow function ES6 doesn't work with $(this)
        sireId = $(this).attr("id").substring(7); //works after removing arrow function.
            sireBox(sireId);//render box
            var dna = await getBirdDna(sireId)
            var obj = birdDna(dna, sireId);
            renderBird(`#sireBox`, obj, sireId);//render bird
            $('#birdSelection').modal('toggle'); //close modal
    });
}

//dynamic elements for breeding page
function dameBox(id) {
    var boxDiv =    `<div id="dameBox" class="col-lg-6 m-2 light-b-shadow">
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
                                <div align="center">DAME</div>
                            </b>
                        </div>
                    </div>`
    $('#dameDisplay').empty();
    $('#dameDisplay').append(boxDiv);
}

function sireBox(id) {
    var boxDiv =    `<div id="sireBox" class="col-lg-4 m-2 light-b-shadow">
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
                                    <div align="center">SIRE</div>
                            </b>
                        </div>
                    </div>`
    $('#sireDisplay').empty();
    $('#sireDisplay').append(boxDiv);
}

function childBox(id) {
    var boxDiv =    `<div style='transform: scaleX(0.8)' id="childBox" class="col-lg-6 m-2 light-b-shadow">
                        <div style='transform: scale(0.8) scaleX(1.2)' class="bird">
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
                                <div align="center">NEWBORN!</div>
                            </b>
                        </div>
                    </div>`
    $('#childDisplay').empty();
    $('#childDisplay').append(boxDiv);
}

function modalBox(id) {
    var boxDiv =    `<div id="BirdBox` + id + `" class="col-lg-3 catalogBox m-2 light-b-shadow">
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
                            </b>
                        </div>
                    </div>`
    $('.row').append(boxDiv);
}