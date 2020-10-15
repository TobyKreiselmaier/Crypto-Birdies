var dameId = -1; //must be set to 0 or higher in order to allow breeding
var sireId = -1; //must be set to 0 or higher in order to allow breeding
var arrayOfIds;

$(document).ready(async () => { //when page is loaded, get latest instance of blockchain
    await connectWallet(); //connect MetaMask (if not already connected)
    arrayOfIds = await getBirdsOfOwner(); //fill array with ids for all birds of this address
    await buildBirdList(arrayOfIds); //iterates through array and returns full info from blockchain
});

//Listeners for buttons
$('#dameButton').click(()=>{
    $('#birdSelection').modal('show'); //open modal
    selectDame(); //modal functionality when dame is selected
})

$('#sireButton').click(()=>{
    $('#birdSelection').modal('show'); //open modal
    selectSire();//modal functionality when sire is selected
})

$('#breedButton').click(async ()=>{ //sends mum and dad IDs to blockchain with request to breed child
    if (dameId != sireId && dameId >= 0 && sireId >= 0) { //mum and dad need to be selected and different from each other
        await breedBird(dameId, sireId);
        window.location.href = "./catalog.html"; //return to catalog site, ideally child is already displayed
    } else {
        alert("Dame and Sire must be selected and may not be the same bird");
    }
})

//Listeners for selections
function selectDame(){
    $(`[id^='BirdBox']`).click(() =>{ //when element with id beginning with BirdBox... is clicked - works
        dameId = parseInt($(`[id^='BirdBox']`).attr("id").substring(7)); // -doesn't work. always returns '0'. why?
        delete arrayOfIds[dameId]; //tried all this: https://love2dev.com/blog/javascript-remove-from-array/, but couldn't delete element.
        $('#birdSelection').modal('toggle'); //close modal
        document.getElementsByClassName("row").innerHTML=""; //clear modal content - doesn't work. why?
        buildBirdList(arrayOfIds); //build modal content with reduced array - doesn't work bc of above errors
        dameBox(dameId); //draw box on breeding page - seems to work when tested with Bird0
        renderBird(birdDna(getBirdDna(dameId), dameId));//draw bird inside box - seems to work when tested with Bird0
    });
}

function selectSire(){
//add code once selectDame() works.
}

//dynamic elements for breeding page
function dameBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7)" id="BirdBox` + id + `" class="col-lg-6 dameBox catalogBox m-2 light-b-shadow">
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
                                        <li><span id="bottomeyetext` + id + `"></span></li>
                                        <li><span id="bottomdecorationpatterntext` + id + `"></span></li>
                                        <li><span id="bottomanimationtext` + id + `"></span></li>
                                    </ul>
                            </b>
                        </div>
                    </div>`
    $('#dameDisplay').append(boxDiv);
}

function sireBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7)" id="BirdBox` + id + `" class="col-lg-4 sireBox catalogBox m-2 light-b-shadow">
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
                                        <li><span id="bottomeyetext` + id + `"></span></li>
                                        <li><span id="bottomdecorationpatterntext` + id + `"></span></li>
                                        <li><span id="bottomanimationtext` + id + `"></span></li>
                                    </ul>
                            </b>
                        </div>
                    </div>`
    $('#sireDisplay').append(boxDiv);
}