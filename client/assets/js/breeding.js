var dameId = -1; //must be set to 0 or higher in order to allow breeding
var sireId = -1; //must be set to 0 or higher in order to allow breeding
var arrayOfIds;

$(document).ready(async () => { //when page is loaded, get latest instance of blockchain
    await connectWallet(); //connect MetaMask (if not already connected)
    arrayOfIds = await getBirdsOfOwner(); //fill array with ids for all birds of this address
    if (arrayOfIds.length > 1) {//address must own at least two birds to continue
        await buildBirdList(arrayOfIds); //iterates through array and returns full info from blockchain
    } else {
        alert("Please revisit this section once you own at least two birds.");
        window.location.href = "./market.html";
    }
    
});

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
    if (dameId >= 0 && sireId >= 0) { //mum and dad need to be selected. They are automatically different from each other
        if(await breedBird(dameId, sireId)){
            alert("Bird successfully created on blockchain. Please allow up to a couple of minutes for it to appear in your catalog.");
        };
        window.location.href = "./catalog.html"; //return to catalog site, ideally child is already displayed
    } else {
        alert("Dame and Sire must be selected");
    }
})

//Listeners for selections
function selectDame(){
    $(`[id^='BirdBox']`).on("click", async function() { //arrow function ES6 doesn't work with $(this)
        if (dameId == -1) {//no dame selected yet
            dameId = parseInt($(this).attr("id").substring(7)); //extract bird ID from HTML.
            arrayOfIds.splice(dameId,1); //remove selected bird from array
            $('#birdSelection').modal('toggle'); //close modal
            $('.row').empty(); //clear modal content
            await buildBirdList(arrayOfIds); //repopulates modal with remaining birds
            dameBox(dameId);//render box
            var dna = await getBirdDna(dameId);//returns bird instance from blockchain
            var obj = birdDna(dna, dameId);//creates dna object for rendering
            renderBird(`#dameBox`, obj, dameId);//render bird
        } else {//a dame was selected before
            dameId = parseInt($(this).attr("id").substring(7)); //works after removing arrow function.
            arrayOfIds.splice(dameId,1); //remove selected bird from array
            $('#birdSelection').modal('toggle'); //close modal
            $('.row').empty(); //clear modal content
            var dameBoxId = parseInt($('.dameBox').attr("id").substring(7));
            $('.dameDisplay').empty();//clear dameBox
            arrayOfIds.push(dameBoxId);//previously selected bird is returned to list when replaced
            await buildBirdList(arrayOfIds);//work on this
            dameBox(dameId);//render box
            var dna = await getBirdDna(dameId)
            var obj = birdDna(dna, dameId);
            renderBird(`#dameBox`, obj, dameId);//render bird
        }
    });
}

function selectSire(){
    $(`[id^='BirdBox']`).on("click", async function() { //arrow function ES6 doesn't work with $(this)
        if (sireId == -1) {//no sire selected yet
            sireId = parseInt($(this).attr("id").substring(7)); //works after removing arrow function.
            arrayOfIds.splice(sireId,1); //remove selected bird from array
            $('#birdSelection').modal('toggle'); //close modal
            $('.row').empty(); //clear modal content
            await buildBirdList(arrayOfIds); //work on this
            sireBox(sireId);//render box
            var dna = await getBirdDna(sireId)
            var obj = birdDna(dna, sireId);
            renderBird(`#sireBox`, obj, sireId);//render bird
        } else {//a sire was selected before
            sireId = parseInt($(this).attr("id").substring(7)); //works after removing arrow function.
            arrayOfIds.splice(sireId,1); //remove selected bird from array
            $('#birdSelection').modal('toggle'); //close modal
            $('.row').empty(); //clear modal content
            var sireBoxId = parseInt($('.sireBox').attr("id").substring(7));
            $('.sireDisplay').empty();//clear sireBox
            arrayOfIds.push(sireBoxId);//previously selected bird is returned to list when replaced
            await buildBirdList(arrayOfIds);//work on this
            sireBox(sireId);//render box
            var dna = await getBirdDna(sireId)
            var obj = birdDna(dna, sireId);
            renderBird(`#sireBox`, obj, sireId);//render bird
        }
    });
}

//dynamic elements for breeding page
function dameBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7)" id="dameBox" class="col-lg-6 catalogBox m-2 light-b-shadow">
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
                                <div align="center">DAME</div>
                            </b>
                        </div>
                    </div>`
    $('#dameDisplay').empty();
    $('#dameDisplay').append(boxDiv);
}

function sireBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7)" id="sireBox" class="col-lg-4 catalogBox m-2 light-b-shadow">
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
                                    <div align="center">SIRE</div>
                            </b>
                        </div>
                    </div>`
    $('#sireDisplay').empty();
    $('#sireDisplay').append(boxDiv);
}
