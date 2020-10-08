$(document).ready( async () => {//when page is loaded, get latest instance of blockchain
    await connectWallet();
});

//Randomize color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}

function genColors(){
    var colors = [];
    for(var i = 0; i <= 99; i ++){
      var color = getColor();
      colors[i] = color;
    }
    return colors;
}

function topFeatherColor(color,code) {
    $('.feather_top, .feather_bottom').css('background', '#' + color) //This changes the color of the bird
    $('#topfeatherstext').html('Code: '+ code) //This updates text of the badge above the slider
    $('#dnaTopFeather').html(code) //This updates the DNA that is displayed below the bird
}

function bodyFeatherColor(color,code) {
    $('.bird_body_inner').css('background', '#' + color)
    $('#bodyfeatherstext').html('Code: '+ code)
    $('#dnaBodyFeather').html(code)
}

function topBeakColor(color,code) {
    $('.beak_upper').css('background', '#' + color)
    $('#topbeaktext').html('Code: '+ code)
    $('#dnaTopBeak').html(code)
}

function bottomBeakColor(color,code) {
    $('.beak_lower').css('background', '#' + color)
    $('#bottombeaktext').html('Code: '+ code)
    $('#dnaBottomBeak').html(code)
}

function eyesVariation(num) {
    $('#dnaEyesShape').html(num)
    switch (num) {
        case 0:
            basicEyes();
            $('#eyesshapetext').html('Basic');
            break;
        case 1:    
            basicEyes();
            $('#eyesshapetext').html('Chilled');
            eyesType1();
            break;
        case 2:    
            basicEyes();
            $('#eyesshapetext').html('Up');
            eyesType2();
            break;
        case 3:    
            basicEyes();
            $('#eyesshapetext').html('Right');
            eyesType3();
            break;    
        case 4:    
            basicEyes();
            $('#eyesshapetext').html('Left');
            eyesType4();
            break;    
        case 5:    
            basicEyes();
            $('#eyesshapetext').html('Dazzled');
            eyesType5();
            break;    
        case 6:    
            basicEyes();
            $('#eyesshapetext').html('Slit');
            eyesType6();
            break;    
        case 7:    
            basicEyes();
            $('#eyesshapetext').html('Mask');
            eyesType7();
            break;    
        default:
            basicEyes();
            $('#eyesshapetext').html('Basic');
    }
}

function basicEyes() {
    $('.eye').css('border-top', 'none');
    $('.eye').css('border-bottom', 'none');
    $('.eye').css('border-left', 'none');
    $('.eye').css('border-right', 'none');
    $('.eye').css('border', '0.9em black solid');
    $('.eye_right .eyebrow').css('left', '-1em');
    $('.eye_left .eyebrow').css('left', '-3em');
    $('.eye .eyebrow').css('top', '-3em');
    $('.eye_right .pupil').css('left', '1.5em','top', '3em');
    $('.eye_left .pupil').css('left', '5em','top', '3em');
}

function eyesType1() {//Chilled
    $('.eye').css('border-top', '4em solid');
    $('.eye .eyebrow').css('top', '-5em');
}

function eyesType2() {//Up
    $('.eye').css('border-bottom', '4em solid');
    $('.eye .eyebrow').css('top', '-4em');
    $('.pupil').css('top', '1em');
}

function eyesType3() {//Right
    $('.eye').css('border-left', '2.5em solid');
    $('.eye_right .pupil').css('left', '4em');
    $('.eye_left .pupil').css('left', '4em');
}

function eyesType4() {//Left
    $('.eye').css('border-right', '2.5em solid');
    $('.pupil').css('left', '-1.2em');
}

function eyesType5() {//Dazzled
    $('.eye').css('border-top', '4em solid');
    $('.eye').css('border-bottom', '4em solid');
    $('.pupil').css('top', '0em');
    $('.eye .eyebrow').css('top', '-5em');
}

function eyesType6() {//Slit
    $('.eye').css('border-top', '4em solid');
    $('.eye').css('border-left', '4em solid');
    $('.eye').css('border-right', '4em solid');
    $('.eye_right .pupil').css('left', '0em','top', '-2em');
    $('.eye_left .pupil').css('left', '0em','top', '-2em');
    $('.eye_right .eyebrow').css('left', '-3em');
    $('.eye_left .eyebrow').css('left', '-5em');
    $('.eye .eyebrow').css('top', '-6em');
}

function eyesType7() {//Mask
    $('.eye').css('border', '3em solid');
    $('.pupil').css('top', '1em');
    $('.eye_right .pupil').css('left', '1em');
    $('.eye_left .pupil').css('left', '1em');
    $('.eye_right .eyebrow').css('left', '-3em');
    $('.eye_left .eyebrow').css('left', '-5em');
    $('.eye .eyebrow').css('top', '-6em');
}

function decorationVariation(num) {
    $('#dnaDecorationPattern').html(num)
    switch (num) {
        case 0:
            $('#decorationpatterntext').html('Basic');
            basicDecoration();
            break;
        case 1:
            basicDecoration();
            $('#decorationpatterntext').html('Large');
            decorationType1();
            break;
        case 2:
            basicDecoration();
            $('#decorationpatterntext').html('Max');
            decorationType2();
            break;
        case 3:
            basicDecoration();
            $('#decorationpatterntext').html('Eyes Only');
            decorationType3();
            break;
        case 4:
            basicDecoration();
            $('#decorationpatterntext').html('Back Only');
            decorationType4();
            break;
        case 5:
            basicDecoration();
            $('#decorationpatterntext').html('None');
            decorationType5();
            break;
        case 6:
            basicDecoration();
            $('#decorationpatterntext').html('Cross');
            decorationType6();
            break;
        case 7:
            basicDecoration();
            $('#decorationpatterntext').html('Cross & Eyes');
            decorationType7();
            break;
        default:
            basicDecoration();
            $('#decorationpatterntext').html('Basic');
    }
}

function basicDecoration() {
    $('.bird_body .deco_1').css('display', 'initial');
    $('.bird_body .deco_2').css('display', 'initial');
    $('.bird_body .deco_3').css('display', 'initial');
    $('.bird_body .deco_4').css('display', 'initial');
    $('.bird_body .deco_1').css('transform', 'rotate(-25deg) scaleY(1) translateX(0em) translateY(0em)');
    $('.bird_body .deco_2').css('transform', 'rotate(-15deg) scaleY(1) translateX(0em) translateY(0em)');
    $('.bird_body .deco_3').css('transform', 'rotate(-10deg) scaleY(1) translateY(0em)');
    $('.bird_body .deco_4').css('transform', 'rotate(-10deg) scaleY(1) translateY(0em)');
}

function decorationType1() {//Large
    $('.bird_body .deco_1').css('transform', 'rotate(-25deg) scaleY(2)');
    $('.bird_body .deco_2').css('transform', 'rotate(-15deg) scaleY(2)');
    $('.bird_body .deco_3').css('transform', 'rotate(-10deg) scaleY(2)');
    $('.bird_body .deco_4').css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationType2() {//Max
    $('.bird_body .deco_1').css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_2').css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_3').css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_4').css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType3() {//Eyes Only
    $('.bird_body .deco_1').css('display', 'none');
    $('.bird_body .deco_2').css('display', 'none');
    $('.bird_body .deco_3').css('transform', 'rotate(-10deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_4').css('transform', 'rotate(-10deg) scaleY(3) translateY(-1.8em)');
}

function decorationType4() {//Back Only
    $('.bird_body .deco_1').css('transform', 'rotate(-25deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_2').css('transform', 'rotate(-15deg) scaleY(3) translateY(-2.5em)');
    $('.bird_body .deco_3').css('display', 'none');
    $('.bird_body .deco_4').css('display', 'none');
}

function decorationType5() {//None
    $('.bird_body .deco_1').css('display', 'none');
    $('.bird_body .deco_2').css('display', 'none');
    $('.bird_body .deco_3').css('display', 'none');
    $('.bird_body .deco_4').css('display', 'none');
}

function decorationType6() {//Cross
    $('.bird_body .deco_1').css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $('.bird_body .deco_2').css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $('.bird_body .deco_3').css('display', 'none');
    $('.bird_body .deco_4').css('display', 'none');
}

function decorationType7() {//Cross & Eyes
    $('.bird_body .deco_1').css('transform', 'rotate(90deg) scaleY(3) translateX(-9em) translateY(-0.5em)');
    $('.bird_body .deco_2').css('transform', 'rotate(0deg) scaleY(3) translateX(-3.5em) translateY(-2.5em)');
    $('.bird_body .deco_3').css('transform', 'rotate(-10deg) scaleY(2)');
    $('.bird_body .deco_4').css('transform', 'rotate(-10deg) scaleY(2)');
}

function decorationMainColor(color,code) {
    $('.deco_3, .deco_4').css('background', '#' + color) //This changes the color of the bird
    $('#ateyestext').html('Code: '+ code) //This updates text of the badge above the slider
    $('#dnaDecorationAtEye').html(code) //This updates the DNA that is displayed below the bird
}

function middleColor(color,code) {
    $('.deco_2').css('background', '#' + color) //This changes the color of the bird
    $('#middletext').html('Code: '+ code) //This updates text of the badge above the slider
    $('#dnaDecorationMid').html(code) //This updates the DNA that is displayed below the bird
}

function smallColor(color,code) {
    $('.deco_1').css('background', '#' + color) //This changes the color of the bird
    $('#smalltext').html('Code: '+ code) //This updates text of the badge above the slider
    $('#dnaDecorationSmall').html(code) //This updates the DNA that is displayed below the bird
}

function animationVariation(num) {
    $('#dnaAnimation').html(num)
    switch (num) {
        case 0:
            resetAnimation();
            $('#animationtext').html('None');
            break;
        case 1:    
            resetAnimation();
            $('#animationtext').html('Kick');
            animationType1();
            break;
        case 2:    
            resetAnimation();
            $('#animationtext').html('Float');
            animationType2();
            break;
        case 3:    
            resetAnimation();
            $('#animationtext').html('Compress');
            animationType3();
            break;
        case 4:    
            resetAnimation();
            $('#animationtext').html('Speak');
            animationType4();
            break;
        case 5:    
            resetAnimation();
            $('#animationtext').html('Wag');
            animationType5();
            break;
        case 6:    
            resetAnimation();
            $('#animationtext').html('Attention');
            animationType6();
            break;
        case 7:    
            resetAnimation();
            $('#animationtext').html('Combi');
            animationType7();
            break;
        case 8:    
            resetAnimation();
            $('#animationtext').html('Follow');
            animationType8();
            break;
        default:
            resetAnimation();
            $('#animationtext').html('None');
    }
}

function resetAnimation() {
    $('*').removeClass('slowRotateBird floatingBird compressingBird upperSpeakingBird lowerSpeakingBird topWaggingTail middleWaggingTail bottomWaggingTail topAttention bottomAttention');
    document.onmousemove = function(){};
    $('.eye_right .pupil').css('left', '1.5em');
    $('.eye_left .pupil').css('left', '5em');
    $('.eye_right .pupil').css('top', '3em');
    $('.eye_left .pupil').css('top', '3em');
}

function animationType1() {
    $('.angryBird_Red').addClass('slowRotateBird');
}

function animationType2() {
    $('.angryBird_Red').addClass('floatingBird');
}

function animationType3() {
    $('.angryBird_Red').addClass('compressingBird');
}

function animationType4() {
    $('.beak_upper').addClass('upperSpeakingBird');
    $('.beak_lower').addClass('lowerSpeakingBird');
}

function animationType5() {
    $('.tail_top').addClass('topWaggingTail');
    $('.tail_middle').addClass('middleWaggingTail');
    $('.tail_bottom').addClass('bottomWaggingTail');
}

function animationType6() {
    $('.feather_top').addClass('topAttention');
    $('.feather_bottom').addClass('bottomAttention');
}

function animationType7() {
    $('.angryBird_Red').addClass('floatingBird');
    $('.beak_upper').addClass('upperSpeakingBird');
    $('.beak_lower').addClass('lowerSpeakingBird');
    $('.tail_top').addClass('topWaggingTail');
    $('.tail_middle').addClass('middleWaggingTail');
    $('.tail_bottom').addClass('bottomWaggingTail');
    $('.feather_top').addClass('topAttention');
    $('.feather_bottom').addClass('bottomAttention');
}

function animationType8() {
    basicEyes();
    var eyeballs = document.getElementsByClassName("pupil");
    document.onmousemove = function(event) {
        var x = event.clientX * 65 / window.innerWidth + "%";
        var y = event.clientY * 65 / window.innerHeight + "%";
        for (let i = 0; i < 2; i++) {
            eyeballs[i].style.left = x;
            eyeballs[i].style.top = y;
        }}
}