var colors = Object.values(allColors());

$(document).ready( async () => {//when page is loaded, create catalogue
    await connectMetaMask();
    getBirdsOfOwner();
});

function appendBird(dna, id) {
    var BirdyDna = birdDna(dna); //convert dna back into string
    birdBox(id); //build box in HTML
    renderBird(BirdyDna, id);
}

function birdDna(dna) {//DNA sequence must be a 17 digit string at this point.
    var dna = {
        "topFeatherColor": dna.substring(0, 2),
        "bodyFeatherColor": dna.substring(2, 4),
        "topBeakColor": dna.substring(4, 6),
        "bottomBeakColor": dna.substring(6, 8),
        "eyesShape": dna.substring(8, 9),
        "decorationPattern": dna.substring(9, 10),
        "decorationColor": dna.substring(10, 12),
        "decorationMidColor": dna.substring(12, 14),
        "decorationSmallColor": dna.substring(14, 16),
        "animation": dna.substring(16, 17),
    }
    console.log(dna);
    $('#generation' + id).html(dna.substring());//check in console which digits are relevant.
    return dna;
}

function birdBox(id) {

    var boxDiv =    `<div class="row">
                    <div class="col-lg-4 birdBox m-2 light-b-shadow">
                        <div class="angryBird_Red">
                            <div class="tail">
                                <div class="tail tail_top"></div>
                                <div class="tail tail_middle"></div>
                                <div class="tail tail_bottom"></div>
                            </div>
                            <div class="feather">
                                <div class="feather feather_top` + id + `"></div>
                                <div class="feather feather_bottom` + id + `"></div>
                            </div>
                            <div class="bird_body">
                                <div class="bird_body bird_body_inner` + id + `"></div>
                                <div class="bird_body deco_1` + id + `"></div>
                                <div class="bird_body deco_2` + id + `"></div>
                                <div class="bird_body deco_3` + id + `"></div>
                                <div class="bird_body deco_4` + id + `"></div>
                            </div>
                            <div class="belly"></div>
                            <div class="face">
                                <div class="eye` + id + ` eye_right` + id + `">
                                    <div class="eyebrow` + id + `"></div>
                                    <div class="pupil` + id + `"></div>
                                </div>
                                <div class="eye` + id + ` eye_left` + id + `">
                                    <div class="eyebrow` + id + `"></div>
                                    <div class="pupil` + id + `"></div>
                                </div>
                                <div class="beak">
                                    <div class="beak beak_upper` + id + `"></div>
                                    <div class="beak beak_lower` + id + `"></div>
                                </div>
                            </div>
                        </div>
                        
                        <br>
                        <div class="dnaDiv">
                            <b>
                                GEN:
                                    <span id="generation` + id + `"></span><br>
                                DNA:
                                    <span id="dnaTopFeather` + id + `"></span>
                                    <span id="dnaBodyFeather` + id + `"></span>
                                    <span id="dnaTopBeak` + id + `"></span>
                                    <span id="dnaBottomBeak` + id + `"></span>
                                    <span id="dnaBelly` + id + `"></span>
                                    <span id="dnaEyesShape` + id + `"></span>
                                    <span id="dnaDecorationPattern` + id + `"></span>
                                    <span id="dnaDecorationAtEye` + id + `"></span>
                                    <span id="dnaDecorationMid` + id + `"></span>
                                    <span id="dnaDecorationSmall` + id + `"></span>
                                    <span id="dnaAnimation` + id + `"></span><br>
                                <ul class="ml-5">
                                    <li><span id="bottomeyetext` + id + `"></span></li>
                                    <li><span id="bottomdecorationpatterntext` + id + `"></span></li>
                                    <li><span id="bottomanimationtext` + id + `"></span></li>
                                </ul>
                            </b>
                        </div>
                    </div>`
    $('#birdsDiv').append(boxDiv);
}

function renderBird(dna, id){
    topFeatherColor(colors[dna.topFeatherColor], dna.topFeatherColor, id);
    $('#topfeatherscolor' + id).val(dna.topFeatherColor);
    bodyFeatherColor(colors[dna.bodyFeatherColor],dna.bodyFeatherColor, id);
    $('#bodyfeatherscolor' + id).val(dna.bodyFeatherColor);
    topBeakColor(colors[dna.topBeakColor],dna.topBeakColor, id);
    $('#topbeakcolor' + id).val(dna.topBeakColor);
    bottomBeakColor(colors[dna.bottomBeakColor],dna.bottomBeakColor, id);
    $('#bottombeakcolor' + id).val(dna.bottomBeakColor);
    eyesVariation(dna.eyesShape, id);
    $('#eyesstyle' + id).val(dna.eyesShape);
    decorationVariation(dna.decorationPattern, id);
    $('#decorationstyle' + id).val(dna.decorationPattern);
    decorationMainColor(colors[dna.decorationColor],dna.decorationColor, id);
    $('#ateyescolor' + id).val(dna.decorationColor);
    middleColor(colors[dna.decorationMidColor],dna.decorationMidColor, id);
    $('#middlecolor' + id).val(dna.decorationMidColor);
    smallColor(colors[dna.decorationSmallColor],dna.decorationSmallColor, id);
    $('#smallcolor' + id).val(dna.decorationSmallColor);
    animationVariation(dna.animation, id);
    $('#animationstyle' + id).val(dna.animation);
}

function topFeatherColor(color, code, id) {
    $('.feather_top' + id, '.feather_bottom' + id).css('background', '#' + color) //This changes the color of the bird
    $('#dnaTopFeather' + id).html(code) //This updates the DNA that is displayed below the bird
}

function bodyFeatherColor(color, code, id) {
    $('.bird_body_inner' + id).css('background', '#' + color)
    $('#dnaBodyFeather' + id).html(code)
}

function topBeakColor(color, code, id) {
    $('.beak_upper' + id).css('background', '#' + color)
    $('#dnaTopBeak' + id).html(code)
}

function bottomBeakColor(color, code, id) {
    $('.beak_lower' + id).css('background', '#' + color)
    $('#dnaBottomBeak' + id).html(code)
}

function eyesVariation(num, id) {
    $('#dnaEyesShape' + id).html(num)
    switch (num) {
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
            basicEyes(id);
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
    $('.eye' + id).css('border-top', 'none');
    $('.eye' + id).css('border-bottom', 'none');
    $('.eye' + id).css('border-left', 'none');
    $('.eye' + id).css('border-right', 'none');
    $('.eye' + id).css('border', '0.9em black solid');
    $('.eye_right' + id, '.eyebrow' + id).css('left', '-1em');
    $('.eye_left' + id, '.eyebrow'  + id).css('left', '-3em');
    $('.eye .eyebrow' + id).css('top', '-3em');
    $('.pupil' + id).css('top', '3em');
    $('.eye_right .pupil' + id).css('left', '1.5em','top', '3em');
    $('.eye_left .pupil' + id).css('left', '5em','top', '3em');
}

function eyesType1(id) {//Chilled
    $('.eye' + id).css('border-top', '4em solid');
    $('.eye .eyebrow' + id).css('top', '-5em');
}

function eyesType2(id) {//Up
    $('.eye' + id).css('border-bottom', '4em solid');
    $('.eye .eyebrow' + id).css('top', '-4em');
    $('.pupil' + id).css('top', '1em');
}

function eyesType3(id) {//Right
    $('.eye' + id).css('border-left', '2.5em solid');
    $('.eye_right .pupil' + id).css('left', '4em');
    $('.eye_left .pupil' + id).css('left', '4em');
}

function eyesType4(id) {//Left
    $('.eye' + id).css('border-right', '2.5em solid');
    $('.pupil' + id).css('left', '-1.2em');
}

function eyesType5(id) {//Dazzled
    $('.eye' + id).css('border-top', '4em solid');
    $('.eye' + id).css('border-bottom', '4em solid');
    $('.pupil' + id).css('top', '0em');
    $('.eye .eyebrow' + id).css('top', '-5em');
}

function eyesType6(id) {//Slit
    $('.eye' + id).css('border-top', '4em solid');
    $('.eye' + id).css('border-left', '4em solid');
    $('.eye' + id).css('border-right', '4em solid');
    $('.eye_right .pupil' + id).css('left', '0em','top', '-2em');
    $('.eye_left .pupil' + id).css('left', '0em','top', '-2em');
    $('.eye_right .eyebrow' + id).css('left', '-3em');
    $('.eye_left .eyebrow' + id).css('left', '-5em');
    $('.eye .eyebrow' + id).css('top', '-6em');
}

function eyesType7(id) {//Mask
    $('.eye' + id).css('border', '3em solid');
    $('.pupil' + id).css('top', '1em');
    $('.eye_right .pupil' + id).css('left', '1em');
    $('.eye_left .pupil' + id).css('left', '1em');
    $('.eye_right .eyebrow' + id).css('left', '-3em');
    $('.eye_left .eyebrow' + id).css('left', '-5em');
    $('.eye .eyebrow' + id).css('top', '-6em');
}

function decorationVariation(num, id) {
    $('#dnaDecorationPattern' + id).html(num)
    switch (num) {
        case 0:
            $('#bottomdecorationpatterntext' + id).html('Basic Decoration');
            basicDecoration(id);
            break;
        case 1:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Large Spots');
            decorationType1(id);
            break;
        case 2:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Maximum Spots');
            decorationType2(id);
            break;
        case 3:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Decoration only at Eyes');
            decorationType3(id);
            break;
        case 4:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Decoration on Back only');
            decorationType4(id);
            break;
        case 5:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('No Decoration');
            decorationType5(id);
            break;
        case 6:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Cross Decoration');
            decorationType6(id);
            break;
        case 7:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Cross & Eyes Decoration');
            decorationType7(id);
            break;
        default:
            basicDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('Basic Decoration');
    }
}

function basicDecoration(id) {
    $('.bird_body .deco_1' + id).css('display', 'initial');
    $('.bird_body .deco_2' + id).css('display', 'initial');
    $('.bird_body .deco_3' + id).css('display', 'initial');
    $('.bird_body .deco_4' + id).css('display', 'initial');
    $('.bird_body .deco_1' + id).css('transform', 'rotate(-25deg) scaleY(1) translateX(0em) translateY(0em)');
    $('.bird_body .deco_2' + id).css('transform', 'rotate(-15deg) scaleY(1) translateX(0em) translateY(0em)');
    $('.bird_body .deco_3' + id).css('transform', 'rotate(-10deg) scaleY(1) translateY(0em)');
    $('.bird_body .deco_4' + id).css('transform', 'rotate(-10deg) scaleY(1) translateY(0em)');
}

function decorationType1(id) {//Large
    $('.bird_body .deco_1' + id).css('transform', 'rotate(-25deg) scaleY(2)');
    $('.bird_body .deco_2' + id).css('transform', 'rotate(-15deg) scaleY(2)');
    $('.bird_body .deco_3' + id).css('transform', 'rotate(-10deg) scaleY(2)');
    $('.bird_body .deco_4' + id).css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationType2(id) {//Max
    $('.bird_body .deco_1' + id).css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_2' + id).css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_3' + id).css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_4' + id).css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType3(id) {//Eyes Only
    $('.bird_body .deco_1' + id).css('display', 'none');
    $('.bird_body .deco_2' + id).css('display', 'none');
    $('.bird_body .deco_3' + id).css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_4' + id).css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType4(id) {//Back Only
    $('.bird_body .deco_1' + id).css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_2' + id).css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_3' + id).css('display', 'none');
    $('.bird_body .deco_4' + id).css('display', 'none');
}

function decorationType5(id) {//None
    $('.bird_body .deco_1' + id).css('display', 'none');
    $('.bird_body .deco_2' + id).css('display', 'none');
    $('.bird_body .deco_3' + id).css('display', 'none');
    $('.bird_body .deco_4' + id).css('display', 'none');
}

function decorationType6(id) {//Cross
    $('.bird_body .deco_1' + id).css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $('.bird_body .deco_2' + id).css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $('.bird_body .deco_3' + id).css('display', 'none');
    $('.bird_body .deco_4' + id).css('display', 'none');
}

function decorationType7(id) {//Cross & Eyes
    $('.bird_body .deco_1' + id).css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $('.bird_body .deco_2' + id).css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $('.bird_body .deco_3' + id).css('transform', 'rotate(-10deg) scaleY(2)');
    $('.bird_body .deco_4' + id).css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationMainColor(color, code, id) {
    $('.deco_3' + id, '.deco_4' + id).css('background', '#' + color) //This changes the color of the bird
    $('#dnaDecorationAtEye').html(code) //This updates the DNA that is displayed below the bird
}

function middleColor(color, code, id) {
    $('.deco_2' + id).css('background', '#' + color) //This changes the color of the bird
    $('#dnaDecorationMid').html(code) //This updates the DNA that is displayed below the bird
}

function smallColor(color, code, id) {
    $('.deco_1' + id).css('background', '#' + color) //This changes the color of the bird
    $('#dnaDecorationSmall').html(code) //This updates the DNA that is displayed below the bird
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
        default:
            resetAnimation(id);
            $('#bottomanimationtext' + id).html('No animation');
    }
}

function resetAnimation(id) {
    $('.angryBird_Red' + id).removeClass('slowRotateBird floatingBird compressingBird');
    $('.beak_upper' + id).removeClass('upperSpeakingBird');
    $('.beak_lower' + id).removeClass('lowerSpeakingBird');
    $('.tail_top' + id).removeClass('topWaggingTail');
    $('.tail_middle' + id).removeClass('middleWaggingTail');
    $('.tail_bottom' + id).removeClass('bottomWaggingTail');
    $('.feather_top' + id).removeClass('topAttention');
    $('.feather_bottom' + id).removeClass('bottomAttention');
}

function animationType1(id) {
    $('.angryBird_Red' + id).addClass('slowRotateBird');
}

function animationType2(id) {
    $('.angryBird_Red' + id).addClass('floatingBird');
}

function animationType3(id) {
    $('.angryBird_Red' + id).addClass('compressingBird');
}

function animationType4(id) {
    $('.beak_upper' + id).addClass('upperSpeakingBird');
    $('.beak_lower' + id).addClass('lowerSpeakingBird');
}

function animationType5(id) {
    $('.tail_top' + id).addClass('topWaggingTail');
    $('.tail_middle' + id).addClass('middleWaggingTail');
    $('.tail_bottom' + id).addClass('bottomWaggingTail');
}

function animationType6(id) {
    $('.feather_top' + id).addClass('topAttention');
    $('.feather_bottom' + id).addClass('bottomAttention');
}

function animationType7(id) {
    $('.angryBird_Red' + id).addClass('floatingBird');
    $('.beak_upper' + id).addClass('upperSpeakingBird');
    $('.beak_lower' + id).addClass('lowerSpeakingBird');
    $('.tail_top' + id).addClass('topWaggingTail');
    $('.tail_middle' + id).addClass('middleWaggingTail');
    $('.tail_bottom' + id).addClass('bottomWaggingTail');
    $('.feather_top' + id).addClass('topAttention');
    $('.feather_bottom' + id).addClass('bottomAttention');
}