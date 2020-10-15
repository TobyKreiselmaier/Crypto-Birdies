var dameId = -1;
var sireId = -1;
var arrayofIds;

$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    arrayofIds = await getBirdsOfOwner();
    await buildBirdList(arrayofIds);
});

//Listeners for buttons
$('#dameButton').click(()=>{
    $('#birdSelection').modal('show'); //open modal
    selectDame();
})

$('#sireButton').click(()=>{
    $('#birdSelection').modal('show'); //open modal
    selectSire();
})

$('#breedButton').click(async ()=>{
    if (dameId != sireId && dameId >= 0 && sireId >= 0) {
        await breedBird(dameId, sireId);
        window.location.href = "./catalog.html";
    } else {
        alert("Dame and Sire must be selected and may not be the same bird");
    }
})

//Listeners for selections
function selectDame(){
    $(`[id^='BirdBox']`).click(async() =>{
        dameId = parseInt($(`[id^='BirdBox']`).attr("id").substring(7)); //selected bird becomes dame
        arrayofIds.splice(dameId,1); //remove this bird from array
        $('#birdSelection').modal('toggle'); //close modal
        dameBox(dameId); //draw box on breeding page
        renderBird(birdDna(await getBirdDna(dameId), dameId));//draw bird inside box
    });
}

function selectSire(){
    $(`[id^='BirdBox']`).click(async() =>{
        sireId = parseInt($(`[id^='BirdBox']`).attr("id").substring(7)); //selected bird becomes sire
        arrayofIds.splice(sireId,1); //remove this bird from array
        $('#birdSelection').modal('toggle'); //close modal
        sireBox(sireId); //draw box on breeding page
        renderBird(birdDna(await getBirdDna(sireId), sireId));//draw bird inside box
    });
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