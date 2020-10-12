var colors = Object.values(allColors());

$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
    getBirdsOfOwner();
});

//Listeners for the two buttons
$('#catalogBox').click(()=>{
    console.log("dameBox clicked")
    var birdId = $(this).attr('id');//extract id
    console.log(birdId);
    var id = parseInt(birdId.substring(7));
    //render Dame
  });


function appendBird(dna, id) {
    var BirdyDna = birdDna(dna, id); //convert dna back into string
    birdBox(id); //build box in HTML
    renderBird(BirdyDna, id);
}

function birdDna(dna, id) {
    var internalDna = {
        "topFeatherColor": dna.genes.substring(0, 2),
        "bodyFeatherColor": dna.genes.substring(2, 4),
        "topBeakColor": dna.genes.substring(4, 6),
        "bottomBeakColor": dna.genes.substring(6, 8),
        "eyesShape": dna.genes.substring(8, 9),
        "decorationPattern": dna.genes.substring(9, 10),
        "decorationColor": dna.genes.substring(10, 12),
        "decorationMidColor": dna.genes.substring(12, 14),
        "decorationSmallColor": dna.genes.substring(14, 16),
        "animation": dna.genes.substring(16, 17),
        "generation": dna.generation,
        "mum": dna.mumId,
        "dad": dna.dadId
    }
    return internalDna;
}

function birdBox(id) {
    var boxDiv =    `<div style="transform:scale(0.7)" id="BirdBox` + id + `" class="col-sm-9 catalogBox light-b-shadow">
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
    $('.row').append(boxDiv);
}

function renderBird(dna, id){
    topFeatherColor(colors[dna.topFeatherColor], dna.topFeatherColor, id);
    bodyFeatherColor(colors[dna.bodyFeatherColor],dna.bodyFeatherColor, id);
    topBeakColor(colors[dna.topBeakColor],dna.topBeakColor, id);
    bottomBeakColor(colors[dna.bottomBeakColor],dna.bottomBeakColor, id);
    eyesVariation(parseInt(dna.eyesShape), id);
    decorationVariation(parseInt(dna.decorationPattern), id);
    decorationMainColor(colors[dna.decorationColor],dna.decorationColor, id);
    middleColor(colors[dna.decorationMidColor],dna.decorationMidColor, id);
    smallColor(colors[dna.decorationSmallColor],dna.decorationSmallColor, id);
    animationVariation(parseInt(dna.animation), id);
    printGeneration(dna.generation, id);
    printMum(dna.mum, id);
    printDad(dna.dad, id);
}

function topFeatherColor(color, code, id) {//works
$(`#BirdBox${id} .feather_top`).css('background', '#' + color) //This changes the color of the bird
$(`#BirdBox${id} .feather_bottom`).css('background', '#' + color) //This changes the color of the bird
$('#dnaTopFeather' + id).html(code) //This updates the DNA line that is displayed below the bird
}

function bodyFeatherColor(color, code, id) {//works
    $(`#BirdBox${id} .bird_body_inner`).css('background', '#' + color)
    $('#dnaBodyFeather' + id).html(code)
}

function topBeakColor(color, code, id) {//works
    $(`#BirdBox${id} .beak_upper`).css('background', '#' + color)
    $('#dnaTopBeak' + id).html(code)
}

function bottomBeakColor(color, code, id) {//works
    $(`#BirdBox${id} .beak_lower`).css('background', '#' + color)
    $('#dnaBottomBeak' + id).html(code)
}

function eyesVariation(num, id) {
    $('#dnaEyesShape' + id).html(num)
    var test = parseInt(num)
    switch (test) {
        case 0:
            basicEyes(id);
            $('#bottomeyetext' + id).html('Basic Eyes');
            break;
        case 1:    
            basicEyes(id);
            $('#bottomeyetext' + id).html('Chilled Eyes');
            eyesType1(id);
            break;
        case 2:    
            basicEyes(id);
            $('#bottomeyetext' + id).html('Eyes Turned Upwards');
            eyesType2(id);
            break;
        case 3:    
            basicEyes(id);
            $('#bottomeyetext' + id).html('Eyes Turned Right');
            eyesType3(id);
            break;    
        case 4:    
            basicEyes(id);
            $('#bottomeyetext' + id).html('Eyes Turned Left');
            eyesType4(id);
            break;    
        case 5:    
            basicEyes(id);
            $('#bottomeyetext' + id).html('Dazzled Eyes');
            eyesType5(id);
            break;    
        case 6:    
            //basicEyes(id);
            $('#bottomeyetext' + id).html('Eye Slits');
            eyesType6(id);
            break;    
        case 7:    
            basicEyes(id);
            $('#bottomeyetext' + id).html('Masked Eyes');
            eyesType7(id);
            break;    
        default:
            basicEyes(id);
            $('#bottomeyetext' + id).html('Basic Eyes');
    }
}

function basicEyes(id) {
    $(`#BirdBox${id} .eye`).css('border-top', 'none');
    $(`#BirdBox${id} .eye`).css('border-bottom', 'none');
    $(`#BirdBox${id} .eye`).css('border-left', 'none');
    $(`#BirdBox${id} .eye`).css('border-right', 'none');
    $(`#BirdBox${id} .eye`).css('border', '0.9em black solid');
    $(`#BirdBox${id} .eye_right .eyebrow`).css('left', '-1em');
    $(`#BirdBox${id} .eye_left .eyebrow`).css('left', '-3em');
    $(`#BirdBox${id} .eye .eyebrow`).css('top', '-3em');
    $(`#BirdBox${id} .pupil`).css('top', '3em');
    $(`#BirdBox${id} .eye_right .pupil`).css('left', '1.5em','top', '3em');
    $(`#BirdBox${id} .eye_left .pupil`).css('left', '5em','top', '3em');
}

function eyesType1(id) {//Chilled
    $(`#BirdBox${id} .eye`).css('border-top', '4em solid');
    $(`#BirdBox${id} .eye .eyebrow`).css('top', '-5em');
}

function eyesType2(id) {//Up
    $(`#BirdBox${id} .eye`).css('border-bottom', '4em solid');
    $(`#BirdBox${id} .eye .eyebrow`).css('top', '-4em');
    $(`#BirdBox${id} .pupil`).css('top', '1em');
}

function eyesType3(id) {//Right
    $(`#BirdBox${id} .eye`).css('border-left', '2.5em solid');
    $(`#BirdBox${id} .eye_right .pupil`).css('left', '4em');
    $(`#BirdBox${id} .eye_left .pupil`).css('left', '4em');
}

function eyesType4(id) {//Left
    $(`#BirdBox${id} .eye`).css('border-right', '2.5em solid');
    $(`#BirdBox${id} .pupil`).css('left', '-1.2em');
}

function eyesType5(id) {//Dazzled
    $(`#BirdBox${id} .eye`).css('border-top', '4em solid');
    $(`#BirdBox${id} .eye`).css('border-bottom', '4em solid');
    $(`#BirdBox${id} .pupil`).css('top', '0em');
    $(`#BirdBox${id} .eye .eyebrow`).css('top', '-5em');
}

function eyesType6(id) {//Slit
    $(`#BirdBox${id} .eye`).css('border-top', '4em solid');
    $(`#BirdBox${id} .eye`).css('border-left', '4em solid');
    $(`#BirdBox${id} .eye`).css('border-right', '4em solid');
    $(`#BirdBox${id} .eye_right .pupil`).css('left', '0em','top', '-2em');
    $(`#BirdBox${id} .eye_left .pupil`).css('left', '0em','top', '-2em');
    $(`#BirdBox${id} .eye_right .eyebrow`).css('left', '-3em');
    $(`#BirdBox${id} .eye_left .eyebrow`).css('left', '-5em');
    $(`#BirdBox${id} .eye .eyebrow`).css('top', '-6em');
}

function eyesType7(id) {//Mask
    $(`#BirdBox${id} .eye`).css('border', '3em solid');
    $(`#BirdBox${id} .pupil`).css('top', '1em');
    $(`#BirdBox${id} .eye_right .pupil`).css('left', '1em');
    $(`#BirdBox${id} .eye_left .pupil`).css('left', '1em');
    $(`#BirdBox${id} .eye_right .eyebrow`).css('left', '-3em');
    $(`#BirdBox${id} .eye_left .eyebrow`).css('left', '-5em');
    $(`#BirdBox${id} .eye .eyebrow`).css('top', '-6em');
}

function decorationVariation(num, id) {
    $('#dnaDecorationPattern' + id).html(num)
    switch (num) {
        case 0:
            $('#bottomdecorationpatterntext' + id).html('Basic Decoration');
            resetDecoration(id);
            break;
        case 1:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Large Spots');
            decorationType1(id);
            break;
        case 2:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Maximum Spots');
            decorationType2(id);
            break;
        case 3:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Decoration only at Eyes');
            decorationType3(id);
            break;
        case 4:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Decoration on Back only');
            decorationType4(id);
            break;
        case 5:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('No Decoration');
            decorationType5(id);
            break;
        case 6:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Cross Decoration');
            decorationType6(id);
            break;
        case 7:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Cross & Eyes Decoration');
            decorationType7(id);
            break;
        default:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Basic Decoration');
    }
}

function resetDecoration(id) {
    $(`#BirdBox${id} .deco_1`).css('display', 'initial');
    $(`#BirdBox${id} .deco_2`).css('display', 'initial');
    $(`#BirdBox${id} .deco_3`).css('display', 'initial');
    $(`#BirdBox${id} .deco_4`).css('display', 'initial');
    $(`#BirdBox${id} .deco_1`).css('transform', 'rotate(-25deg) scaleY(1) translateX(0em) translateY(0em)');
    $(`#BirdBox${id} .deco_2`).css('transform', 'rotate(-15deg) scaleY(1) translateX(0em) translateY(0em)');
    $(`#BirdBox${id} .deco_3`).css('transform', 'rotate(-10deg) scaleY(1) translateY(0em)');
    $(`#BirdBox${id} .deco_4`).css('transform', 'rotate(-10deg) scaleY(1) translateY(0em)');
}

function decorationType1(id) {//Large
    $(`#BirdBox${id} .deco_1`).css('transform', 'rotate(-25deg) scaleY(2)');
    $(`#BirdBox${id} .deco_2`).css('transform', 'rotate(-15deg) scaleY(2)');
    $(`#BirdBox${id} .deco_3`).css('transform', 'rotate(-10deg) scaleY(2)');
    $(`#BirdBox${id} .deco_4`).css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationType2(id) {//Max
    $(`#BirdBox${id} .deco_1`).css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_2`).css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_3`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_4`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType3(id) {//Eyes Only
    $(`#BirdBox${id} .deco_1`).css('display', 'none');
    $(`#BirdBox${id} .deco_2`).css('display', 'none');
    $(`#BirdBox${id} .deco_3`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_4`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType4(id) {//Back Only
    $(`#BirdBox${id} .deco_1`).css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_2`).css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_3`).css('display', 'none');
    $(`#BirdBox${id} .deco_4`).css('display', 'none');
}

function decorationType5(id) {//None
    $(`#BirdBox${id} .deco_1`).css('display', 'none');
    $(`#BirdBox${id} .deco_2`).css('display', 'none');
    $(`#BirdBox${id} .deco_3`).css('display', 'none');
    $(`#BirdBox${id} .deco_4`).css('display', 'none');
}

function decorationType6(id) {//Cross
    $(`#BirdBox${id} .deco_1`).css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $(`#BirdBox${id} .deco_2`).css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_3`).css('display', 'none');
    $(`#BirdBox${id} .deco_4`).css('display', 'none');
}

function decorationType7(id) {//Cross & Eyes
    $(`#BirdBox${id} .deco_1`).css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $(`#BirdBox${id} .deco_2`).css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $(`#BirdBox${id} .deco_3`).css('transform', 'rotate(-10deg) scaleY(2)');
    $(`#BirdBox${id} .deco_4`).css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationMainColor(color, code, id) {
    $(`#BirdBox${id} .deco_3`, `#BirdBox${id} .deco_4`).css('background', '#' + color)
    $('#dnaDecorationAtEye' + id).html(code)
}

function middleColor(color, code, id) {
    $(`#BirdBox${id} .deco_2`).css('background', '#' + color)
    $('#dnaDecorationMid' + id).html(code)
}

function smallColor(color, code, id) {
    $(`#BirdBox${id} .deco_1`).css('background', '#' + color)
    $('#dnaDecorationSmall' + id).html(code)
}

function animationVariation(num, id) {
    $('#dnaAnimation' + id).html(num)
    switch (num) {
        case 0:
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('No animation');
            break;
        case 1:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Animation: Kick');
            animationType1(id);
            break;
        case 2:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Animation: Float');
            animationType2(id);
            break;
        case 3:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Animation: Compress');
            animationType3(id);
            break;
        case 4:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Animation: Speak');
            animationType4(id);
            break;
        case 5:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Animation: Wag');
            animationType5(id);
            break;
        case 6:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Animation: Attention');
            animationType6(id);
            break;
        case 7:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Combi Animation');
            animationType7(id);
            break;
        case 8:    
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('Eyes Follow Mouse');
            animationType8(id);
            break;
        default:
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('No animation');
    }
}

function resetAnimation(id) {
    $(`#BirdBox${id} .angryBird_Red`).removeClass('slowRotateBird floatingBird compressingBird');
    $(`#BirdBox${id} .beak_upper`).removeClass('upperSpeakingBird');
    $(`#BirdBox${id} .beak_lower`).removeClass('lowerSpeakingBird');
    $(`#BirdBox${id} .tail_top`).removeClass('topWaggingTail');
    $(`#BirdBox${id} .tail_middle`).removeClass('middleWaggingTail');
    $(`#BirdBox${id} .tail_bottom`).removeClass('bottomWaggingTail');
    $(`#BirdBox${id} .feather_top`).removeClass('topAttention');
    $(`#BirdBox${id} .feather_bottom`).removeClass('bottomAttention');
}

function animationType1(id) {
    $(`#BirdBox${id} .angryBird_Red`).addClass('slowRotateBird');
}

function animationType2(id) {
    $(`#BirdBox${id} .angryBird_Red`).addClass('floatingBird');
}

function animationType3(id) {
    $(`#BirdBox${id} .angryBird_Red`).addClass('compressingBird');
}

function animationType4(id) {
    $(`#BirdBox${id} .beak_upper`).addClass('upperSpeakingBird');
    $(`#BirdBox${id} .beak_lower`).addClass('lowerSpeakingBird');
}

function animationType5(id) {
    $(`#BirdBox${id} .tail_top`).addClass('topWaggingTail');
    $(`#BirdBox${id} .tail_middle`).addClass('middleWaggingTail');
    $(`#BirdBox${id} .tail_bottom`).addClass('bottomWaggingTail');
}

function animationType6(id) {
    $(`#BirdBox${id} .feather_top`).addClass('topAttention');
    $(`#BirdBox${id} .feather_bottom`).addClass('bottomAttention');
}

function animationType7(id) {
    $(`#BirdBox${id} .angryBird_Red`).addClass('floatingBird');
    $(`#BirdBox${id} .beak_upper`).addClass('upperSpeakingBird');
    $(`#BirdBox${id} .beak_lower`).addClass('lowerSpeakingBird');
    $(`#BirdBox${id} .tail_top`).addClass('topWaggingTail');
    $(`#BirdBox${id} .tail_middle`).addClass('middleWaggingTail');
    $(`#BirdBox${id} .tail_bottom`).addClass('bottomWaggingTail');
    $(`#BirdBox${id} .feather_top`).addClass('topAttention');
    $(`#BirdBox${id} .feather_bottom`).addClass('bottomAttention');
}

function animationType8(id) {
    basicEyes(id);
    var eyeballs = $(`#BirdBox${id} .pupil`);
    document.onmousemove = function(event) {
        var x = event.clientX * 65 / window.innerWidth + "%";
        var y = event.clientY * 65 / window.innerHeight + "%";
        for (let i = 0; i < 2; i++) {
            eyeballs[i].style.left = x;
            eyeballs[i].style.top = y;
        }}
}

function printGeneration(genNo, id) {
    $('#generation' + id).html(genNo);
}

function printMum(mum, id) {
    var print;
    if (mum == 0) {
        print = 'n/a'
    } else {
        print = mum;
    }
    $('#mum' + id).html(print);
}

function printDad(dad, id) {
    var print;
    if (dad == 0) {
        print = 'n/a'
    } else {
        print = dad;
    }
    $('#dad' + id).html(print);
}