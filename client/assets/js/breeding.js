var dameId;
var sireId;
var arrayOfIdsOfOwner;

$(document).ready(async () => { //when page is loaded, get latest instance of blockchain
    await connectWallet(); //connect MetaMask (if not already connected)
    arrayOfIdsOfOwner = await getBirdsOfOwner(); //fill array with ids for all birds of this address
    if (arrayOfIdsOfOwner.length > 1) {//address must own at least two birds to continue
        await buildModal(arrayOfIdsOfOwner); //iterates through array and returns full info from blockchain
        dameId = arrayOfIdsOfOwner[0];//automatically set to first bird in array
        dameBox(dameId);
        var dna = await getBirdDna(dameId);//returns bird instance from blockchain
        var obj = birdDna(dna, dameId);//creates dna object for rendering
        renderBird(`#dameBox`, obj, dameId);//render bird
        sireId = arrayOfIdsOfOwner[1];
        sireBox(sireId);
        dna = await getBirdDna(sireId)
        obj = birdDna(dna, sireId);
        renderBird(`#sireBox`, obj, sireId);//render bird
    } else {
        alert("Please revisit this section once you own at least two birds.");
        window.location.href = "./market.html";
    }
});

function appendBirdToModal(dna, id) {
    modalBox(id);
    renderBird(`#BirdBox${id}`, birdDna(dna), id);
}

//Listeners for buttons
$('#dameButton').click(()=>{
    $('#birdSelection').modal('show'); //open modal
    selectDame(); //modal functionality when dame is to be selected
})

$('#sireButton').click(()=>{
    $('#birdSelection').modal('show'); //open modal
    selectSire();//modal functionality when sire is to be selected
})

$('#breedButton').click(async ()=>{ //sends mum and dad IDs to blockchain with request to breed child
    await breedBird(sireId, dameId);
})

//Listeners for selections
function selectDame(){
    $(`[id^='BirdBox']`).on("click", async function() { //arrow function ES6 doesn't work with $(this)
        dameId = $(this).attr("id").substring(7); //works after removing arrow function.
        if (dameId == sireId) {
            alert("Dame and Sire can not be the same. Please select a different bird");
        } else {
            index = arrayOfIdsOfOwner.findIndex(bird => bird === dameId);
            if (index >= 0) { //make sure element is in array
                arrayOfIdsOfOwner.splice(index, 1); //remove selected bird from array
            };
            $('#birdSelection').modal('toggle'); //close modal
            $('.row').empty(); //clear modal content
            var dameBoxId = $(`[id^='dameBoxId']`).attr("id").substring(9);//return ID of previous bird
            $('.dameDisplay').empty();//clear dameBox
            arrayOfIdsOfOwner.push(dameBoxId);//previously selected bird is returned to list when replaced
            await buildModal(arrayOfIdsOfOwner);//build modal with new array
            dameBox(dameId);//render box
            var dna = await getBirdDna(dameId)
            var obj = birdDna(dna, dameId);
            renderBird(`#dameBox`, obj, dameId);//render bird
        }
    });
}

function selectSire(){
    $(`[id^='BirdBox']`).on("click", async function() { //arrow function ES6 doesn't work with $(this)
        sireId = $(this).attr("id").substring(7); //works after removing arrow function.
        if (sireId == dameId) {
            alert("Dame and Sire can not be the same. Please select a different bird");
        } else {
            index = arrayOfIdsOfOwner.findIndex(bird => bird === sireId);
            if (index >= 0) { //make sure element is in array
                arrayOfIdsOfOwner.splice(index, 1); //remove selected bird from array
            };
            $('#birdSelection').modal('toggle'); //close modal
            $('.row').empty(); //clear modal content
            var sireBoxId = $(`[id^='sireBoxId']`).attr("id").substring(9);//return ID of previous bird
            $('.sireDisplay').empty();//clear sireBox
            arrayOfIdsOfOwner.push(sireBoxId);//previously selected bird is returned to list when replaced
            await buildModal(arrayOfIdsOfOwner);//build modal with new array
            sireBox(sireId);//render box
            var dna = await getBirdDna(sireId)
            var obj = birdDna(dna, sireId);
            renderBird(`#sireBox`, obj, sireId);//render bird
        }
    });
}

//dynamic elements for breeding page
function dameBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7);display:block;" id="dameBox" class="col-lg-6 catalogBox m-2 light-b-shadow">
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
                                ID:
                                <span id="dameBoxId` + id + `">` + id + `</span><br>
                                GEN:
                                <span id="generation` + id + `"></span><br>
                                MUM:
                                <span id="mum` + id + `"></span><br>
                                DAD:
                                <span id="dad` + id + `"></span><br>
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
                                <div align="center">DAME</div>
                            </b>
                        </div>
                    </div>`
    $('#dameDisplay').empty();
    $('#dameDisplay').append(boxDiv);
}

function sireBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7);display:block;" id="sireBox" class="col-lg-4 catalogBox m-2 light-b-shadow">
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
                                ID:
                                <span id="sireBoxId` + id + `">` + id + `</span><br>
                                GEN:
                                <span id="generation` + id + `"></span><br>
                                MUM:
                                <span id="mum` + id + `"></span><br>
                                DAD:
                                <span id="dad` + id + `"></span><br>
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
                                    <div align="center">SIRE</div>
                            </b>
                        </div>
                    </div>`
    $('#sireDisplay').empty();
    $('#sireDisplay').append(boxDiv);
}

function modalBox(id) {
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
                        </div>
                    </div>`
    $('.row').append(boxDiv);
}