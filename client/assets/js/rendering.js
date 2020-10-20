var colors = Object.values(allColors());

function birdDna(dna) {
    var dnaObject = {
        "topFeatherColor": dna.genes.substring(0, 2),
        "bodyFeatherColor": dna.genes.substring(2, 4),
        "topBeakColor": dna.genes.substring(4, 6),
        "bottomBeakColor": dna.genes.substring(6, 8),
        "eyesShape": parseInt(dna.genes.substring(8, 9)),
        "decorationPattern": parseInt(dna.genes.substring(9, 10)),
        "decorationColor": dna.genes.substring(10, 12),
        "decorationMidColor": dna.genes.substring(12, 14),
        "decorationSmallColor": dna.genes.substring(14, 16),
        "animation": parseInt(dna.genes.substring(16, 17)),
        "generation": dna.generation,
        "mum": dna.mumId,
        "dad": dna.dadId
    }
    return dnaObject;
}

function renderBird(boxId, dna, id){
    topFeatherColor(boxId, colors[dna.topFeatherColor], dna.topFeatherColor, id);
    bodyFeatherColor(boxId, colors[dna.bodyFeatherColor],dna.bodyFeatherColor, id);
    topBeakColor(boxId, colors[dna.topBeakColor],dna.topBeakColor, id);
    bottomBeakColor(boxId, colors[dna.bottomBeakColor],dna.bottomBeakColor, id);
    eyesVariation(boxId, dna.eyesShape, id);
    decorationVariation(boxId, dna.decorationPattern, id);
    decorationMainColor(boxId, colors[dna.decorationColor],dna.decorationColor, id);
    middleColor(boxId, colors[dna.decorationMidColor],dna.decorationMidColor, id);
    smallColor(boxId, colors[dna.decorationSmallColor],dna.decorationSmallColor, id);
    animationVariation(boxId, dna.animation, id);
    printGeneration(dna.generation, id);
    printMum(dna.mum, id);
    printDad(dna.dad, id);
}

function topFeatherColor(boxId, color, code, id) {
    $(`${boxId} .feather_top`).css('background', '#' + color)//This changes the color of the bird
    $(`${boxId} .feather_bottom`).css('background', '#' + color)//This changes the color of the bird
    $('#dnaTopFeather' + id).html(code)//This updates the DNA line that is displayed below the bird
}

function bodyFeatherColor(boxId, color, code, id) {
    $(`${boxId} .bird_body_inner`).css('background', '#' + color)
    $('#dnaBodyFeather' + id).html(code)
}

function topBeakColor(boxId, color, code, id) {
    $(`${boxId} .beak_upper`).css('background', '#' + color)
    $('#dnaTopBeak' + id).html(code)
}

function bottomBeakColor(boxId, color, code, id) {
    $(`${boxId} .beak_lower`).css('background', '#' + color)
    $('#dnaBottomBeak' + id).html(code)
}

function eyesVariation(boxId, num, id) {
    $('#dnaEyesShape' + id).html(num)
    switch (num) {
        case 0:
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Basic Eyes');
            break;
        case 1:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Chilled Eyes');
            eyesType1(boxId);
            break;
        case 2:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Eyes Turned Upwards');
            eyesType2(boxId);
            break;
        case 3:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Eyes Turned Right');
            eyesType3(boxId);
            break;    
        case 4:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Eyes Turned Left');
            eyesType4(boxId);
            break;    
        case 5:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Dazzled Eyes');
            eyesType5(boxId);
            break;    
        case 6:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Eye Slits');
            eyesType6(boxId);
            break;    
        case 7:    
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Masked Eyes');
            eyesType7(boxId);
            break;    
        default:
            basicEyes(boxId);
            $('#bottomeyetext' + id).html('Basic Eyes');
    }
}

function basicEyes(boxId) {
    $(`${boxId} .eye`).css({'border-top': 'none', 'border-bottom': 'none', 'border-left': 'none', 'border-right': 'none', 'border': '0.9em black solid'});
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-1em', 'top': '-1.5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-3em', 'top': '-1.5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '1.5em', 'top': '3em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '5em', 'top': '3em'});
}

function eyesType1(boxId) {//Chilled
    $(`${boxId} .eye`).css('border-top', '4em solid');
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-1em', 'top': '-4.5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-3em', 'top': '-4.5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '1.5em', 'top': '1em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '5em', 'top': '1em'});
}

function eyesType2(boxId) {//Up
    $(`${boxId} .eye`).css('border-bottom', '4em solid');
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-1em', 'top': '-2em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-3em', 'top': '-2em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '1.5em', 'top': '2em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '5em', 'top': '2em'});
}

function eyesType3(boxId) {//Right
    $(`${boxId} .eye`).css('border-left', '2.5em solid');
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-1em', 'top': '-1.5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-3em', 'top': '-1.5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '5em', 'top': '3em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '5em', 'top': '3em'});
}

function eyesType4(boxId) {//Left
    $(`${boxId} .eye`).css('border-right', '2.5em solid');
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-1em', 'top': '-1.5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-3em', 'top': '-1.5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '0em', 'top': '3em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '0em', 'top': '3em'});
}

function eyesType5(boxId) {//Dazzled
    $(`${boxId} .eye`).css({'border-top': '4em solid', 'border-bottom': '4em solid'});
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-1em', 'top': '-5.5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-3em', 'top': '-5.5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '3em', 'top': '0em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '3em', 'top': '0em'});
}

function eyesType6(boxId) {//Slit
    $(`${boxId} .eye`).css({'border-top': '4em solid', 'border-left': '4em solid', 'border-right': '4em solid'});
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-4em', 'top': '-5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-6em', 'top': '-5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '-0.1em', 'top': '1em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '-0.1em', 'top': '1em'});
}

function eyesType7(boxId) {//Mask
    $(`${boxId} .eye`).css('border', '3em solid');
    $(`${boxId} .eye_right .eyebrow`).css({'left': '-3em', 'top': '-5em'});
    $(`${boxId} .eye_left .eyebrow`).css({'left': '-5em', 'top': '-5em'});
    $(`${boxId} .eye_right .pupil`).css({'left': '1em', 'top': '1em'});
    $(`${boxId} .eye_left .pupil`).css({'left': '1em', 'top': '1em'});
}

function decorationVariation(boxId, num, id) {
    $('#dnaDecorationPattern' + id).html(num)
    switch (num) {
        case 0:
            $('#bottomdecorationpatterntext' + id).html('Basic Decoration');
            resetDecoration(boxId);
            break;
        case 1:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Large Spots');
            decorationType1(boxId);
            break;
        case 2:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Maximum Spots');
            decorationType2(boxId);
            break;
        case 3:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Decoration only at Eyes');
            decorationType3(boxId);
            break;
        case 4:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Decoration on Back only');
            decorationType4(boxId);
            break;
        case 5:
            resetDecoration(id);
            $('#bottomdecorationpatterntext' + id).html('No Decoration');
            decorationType5(boxId);
            break;
        case 6:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Cross Decoration');
            decorationType6(boxId);
            break;
        case 7:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Cross & Eyes Decoration');
            decorationType7(boxId);
            break;
        default:
            resetDecoration(boxId);
            $('#bottomdecorationpatterntext' + id).html('Basic Decoration');
    }
}

function resetDecoration(boxId) {
    $(`${boxId} .deco_1`).css({'display': 'initial', 'transform': 'rotate(-25deg) scaleY(1) translateX(0em) translateY(0em)'});
    $(`${boxId} .deco_2`).css({'display': 'initial', 'transform': 'rotate(-15deg) scaleY(1) translateX(0em) translateY(0em)'});
    $(`${boxId} .deco_3`).css({'display': 'initial', 'transform': 'rotate(-10deg) scaleY(1) translateY(0em)'});
    $(`${boxId} .deco_4`).css({'display': 'initial', 'transform': 'rotate(-10deg) scaleY(1) translateY(0em)'});
}

function decorationType1(boxId) {//Large
    $(`${boxId} .deco_1`).css('transform', 'rotate(-25deg) scaleY(2)');
    $(`${boxId} .deco_2`).css('transform', 'rotate(-15deg) scaleY(2)');
    $(`${boxId} .deco_3`).css('transform', 'rotate(-10deg) scaleY(2)');
    $(`${boxId} .deco_4`).css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationType2(boxId) {//Max
    $(`${boxId} .deco_1`).css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $(`${boxId} .deco_2`).css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $(`${boxId} .deco_3`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $(`${boxId} .deco_4`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType3(boxId) {//Eyes Only
    $(`${boxId} .deco_1`).css('display', 'none');
    $(`${boxId} .deco_2`).css('display', 'none');
    $(`${boxId} .deco_3`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $(`${boxId} .deco_4`).css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType4(boxId) {//Back Only
    $(`${boxId} .deco_1`).css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $(`${boxId} .deco_2`).css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $(`${boxId} .deco_3`).css('display', 'none');
    $(`${boxId} .deco_4`).css('display', 'none');
}

function decorationType5(boxId) {//None
    $(`${boxId} .deco_1`).css('display', 'none');
    $(`${boxId} .deco_2`).css('display', 'none');
    $(`${boxId} .deco_3`).css('display', 'none');
    $(`${boxId} .deco_4`).css('display', 'none');
}

function decorationType6(boxId) {//Cross
    $(`${boxId} .deco_1`).css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $(`${boxId} .deco_2`).css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $(`${boxId} .deco_3`).css('display', 'none');
    $(`${boxId} .deco_4`).css('display', 'none');
}

function decorationType7(boxId) {//Cross & Eyes
    $(`${boxId} .deco_1`).css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $(`${boxId} .deco_2`).css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $(`${boxId} .deco_3`).css('transform', 'rotate(-10deg) scaleY(2)');
    $(`${boxId} .deco_4`).css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationMainColor(boxId, color, code, id) {
    $(`${boxId} .deco_3`, `${boxId} .deco_4`).css('background', '#' + color)
    $('#dnaDecorationAtEye' + id).html(code)
}

function middleColor(boxId, color, code, id) {
    $(`${boxId} .deco_2`).css('background', '#' + color)
    $('#dnaDecorationMid' + id).html(code)
}

function smallColor(boxId, color, code, id) {
    $(`${boxId} .deco_1`).css('background', '#' + color)
    $('#dnaDecorationSmall' + id).html(code)
}

function animationVariation(boxId, num, id) {
    $('#dnaAnimation' + id).html(num)
    switch (num) {
        case 0:
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('No animation');
            break;
        case 1:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Animation: Kick');
            animationType1(boxId);
            break;
        case 2:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Animation: Float');
            animationType2(boxId);
            break;
        case 3:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Animation: Compress');
            animationType3(boxId);
            break;
        case 4:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Animation: Speak');
            animationType4(boxId);
            break;
        case 5:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Animation: Wag');
            animationType5(boxId);
            break;
        case 6:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Animation: Attention');
            animationType6(boxId);
            break;
        case 7:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Combi Animation');
            animationType7(boxId);
            break;
        case 8:    
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('Eyes Follow Mouse');
            animationType8(boxId);
            break;
        default:
            resetAnimation(boxId);
            $('#bottomanimationtext' + id).html('No animation');
    }
}

function resetAnimation(boxId) {
    $(`${boxId} .angryBird_Red`).removeClass('slowRotateBird floatingBird compressingBird');
    $(`${boxId} .beak_upper`).removeClass('upperSpeakingBird');
    $(`${boxId} .beak_lower`).removeClass('lowerSpeakingBird');
    $(`${boxId} .tail_top`).removeClass('topWaggingTail');
    $(`${boxId} .tail_middle`).removeClass('middleWaggingTail');
    $(`${boxId} .tail_bottom`).removeClass('bottomWaggingTail');
    $(`${boxId} .feather_top`).removeClass('topAttention');
    $(`${boxId} .feather_bottom`).removeClass('bottomAttention');
}

function animationType1(boxId) {
    $(`${boxId} .angryBird_Red`).addClass('slowRotateBird');
}

function animationType2(boxId) {
    $(`${boxId} .angryBird_Red`).addClass('floatingBird');
}

function animationType3(boxId) {
    $(`${boxId} .angryBird_Red`).addClass('compressingBird');
}

function animationType4(boxId) {
    $(`${boxId} .beak_upper`).addClass('upperSpeakingBird');
    $(`${boxId} .beak_lower`).addClass('lowerSpeakingBird');
}

function animationType5(boxId) {
    $(`${boxId} .tail_top`).addClass('topWaggingTail');
    $(`${boxId} .tail_middle`).addClass('middleWaggingTail');
    $(`${boxId} .tail_bottom`).addClass('bottomWaggingTail');
}

function animationType6(boxId) {
    $(`${boxId} .feather_top`).addClass('topAttention');
    $(`${boxId} .feather_bottom`).addClass('bottomAttention');
}

function animationType7(boxId) {
    $(`${boxId} .angryBird_Red`).addClass('floatingBird');
    $(`${boxId} .beak_upper`).addClass('upperSpeakingBird');
    $(`${boxId} .beak_lower`).addClass('lowerSpeakingBird');
    $(`${boxId} .tail_top`).addClass('topWaggingTail');
    $(`${boxId} .tail_middle`).addClass('middleWaggingTail');
    $(`${boxId} .tail_bottom`).addClass('bottomWaggingTail');
    $(`${boxId} .feather_top`).addClass('topAttention');
    $(`${boxId} .feather_bottom`).addClass('bottomAttention');
}

function animationType8(boxId) {
    basicEyes(boxId);
    var eyeballs = $(`${boxId} .pupil`);
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