var colors = Object.values(allColors());
var dameId = -1;
var sireId = 0;

$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    getBirdsOfOwner();//calls appendBird with all ids of owner.
});

//Listener for the privacy button
$('#privacyButton').click(async ()=>{
    if (dameId != sireId && dameId >= 0 && sireId >= 0) {
        await breedBird(dameId, sireId);
        window.location.href = "./catalog.html";
    } else {
        alert("Dame and Sire must be selected and may not be the same bird");
    }
})

function appendBird(dna, id) {//add bird to list
    var BirdyDna = birdDna(dna, id); //convert dna back into string
    var boxDiv;
    boxDiv = dameBox(id); //build box in HTML for dame
    $('.damerow').append(boxDiv);
    boxDiv = sireBox(id);
    $('.sirerow').append(boxDiv);
    renderBird(BirdyDna, id);
    
    $(`#dameBox${id}`).click(()=>{
        dameId = id;
        boxDiv = dameBox(id);
        $('#dame').append(boxDiv);
        renderBird(BirdyDna, id);
    });

    $(`#sireBox${id}`).click(()=>{
        sireId = id;
        boxDiv = sireBox(id);
        $('#sire').append(boxDiv);
        renderBird(BirdyDna, id);
    });
}

function dameBox(id) {//build dameBox
    var boxDiv =    `<div style="transform:scale(0.7)" id="dameBox` + id + `" class="col-sm-9 catalogBox light-b-shadow">
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
    return boxDiv;
}

function sireBox(id) {//build sireBox
    var boxDiv =    `<div style="transform:scale(0.7)" id="sireBox` + id + `" class="col-sm-9 catalogBox light-b-shadow">
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
}

//all rendering functions are taken from catalog.js