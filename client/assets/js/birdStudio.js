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
            $('#eyesshapetext').html('Top Right');
            eyesType6();
            break;    
        case 7:    
            basicEyes();
            $('#eyesshapetext').html('Bottom Right');
            eyesType7();
            break;    
        case 8:    
            basicEyes();
            $('#eyesshapetext').html('Top Left');
            eyesType8();
            break;    
        case 9:    
            basicEyes();
            $('#eyesshapetext').html('Tight');
            eyesType9();
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
    $('.eye .eyebrow').css('top', '-1.5em');
    $('.pupil').css('top', 'none');
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
}

function eyesType3() {//Right
    $('.eye').css('border-left', '2.5em solid');
}

function eyesType4() {//Left
    $('.eye').css('border-right', '2.5em solid');
    $('.pupil').css('left', '-1.2em');
}

function eyesType5() {//Dazzled - doesn't reset properly
    $('.eye').css('border-top', '4em solid');
    $('.eye').css('border-bottom', '4em solid');
    $('.pupil').css('top', '-1.2em');
    $('.eye .eyebrow').css('top', '-5em');
}

function eyesType6() {//Top Right
    $('.bird__eye').find('span').css('border-bottom', '15px solid');
    $('.bird__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType7() {//Bottom Right
    $('.bird__eye').find('span').css('border-left', '15px solid');
    $('.bird__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType8() {//Top Left
    $('.bird__eye').find('span').css('border-right', '15px solid');
    $('.bird__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType9() {//Tight
    $('.bird__eye').find('span').css('background-image', 'linear-gradient(to right, rgb(114, 108, 29) , rgb(31, 31, 61), rgb(114, 108, 29))');

}

function decorationVariation(num) {
    $('#dnadecorationPattern').html(num)
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
            $('#decorationpatterntext').html('Left Twist');
            decorationType3();
            break;
        case 4:
            basicDecoration();
            $('#decorationpatterntext').html('Right Twist');
            decorationType4();
            break;
        case 5:
            basicDecoration();
            $('#decorationpatterntext').html('W-Shape');
            decorationType5();
            break;
        case 6:
            basicDecoration();
            $('#decorationpatterntext').html('Inverse W');
            decorationType6();
            break;
        case 7:
            basicDecoration();
            $('#decorationpatterntext').html('Cross');
            decorationType7();
            break;
        default:
            basicDecoration();
            $('#decorationpatterntext').html('Basic');
    }
}

function basicDecoration() {
    $('.bird__head-dots').css({ 'transform': 'rotate(0deg)', 'height': '48px', 'width': '14px' })
    $('.bird__head-dots_first').css({ 'transform': 'rotate(0deg)', 'height': '35px', 'width': '14px', 'top': '1px', 'left': '-20px' })
    $('.bird__head-dots_second').css({ 'transform': 'rotate(0deg)', 'height': '35px', 'width': '14px', 'top': '1px', 'left': '20px' })
}

function decorationType1() {//Large
    $('.bird__head-dots').css({ 'height': '68px' })
    $('.bird__head-dots_first').css({ 'height': '55px' })
    $('.bird__head-dots_second').css({ 'height': '55px' })
}

function decorationType2() {//Max
    $('.bird__head-dots').css({ 'height': '88px' })
    $('.bird__head-dots_first').css({ 'height': '75px' })
    $('.bird__head-dots_second').css({ 'height': '75px' })
}

function decorationType3() {//Left Twist
    $('.bird__head-dots').css({ 'height': '68px' })
    $('.bird__head-dots_first').css({ 'transform': 'rotate(60deg)', 'height': '55px', 'top': '-12px', 'left': '-38px'})
    $('.bird__head-dots_second').css({ 'height': '55px', })
}

function decorationType4() {//Right Twist
    $('.bird__head-dots').css({ 'height': '68px' })
    $('.bird__head-dots_first').css({ 'height': '55px', })
    $('.bird__head-dots_second').css({ 'transform': 'rotate(-60deg)', 'height': '55px', 'top': '-12px', 'left': '40px'})
}

function decorationType5() {//W-Shape
    $('.bird__head-dots').css({ 'height': '68px' })
    $('.bird__head-dots_first').css({ 'transform': 'rotate(-45deg)', 'height': '55px', 'width': '14px', 'top': '15px', 'left': '-40px' })
    $('.bird__head-dots_second').css({ 'transform': 'rotate(45deg)', 'height': '55px', 'width': '14px', 'top': '15px', 'left': '40px' })
}

function decorationType6() {//Inverse W
    $('.bird__head-dots').css({ 'height': '68px' })
    $('.bird__head-dots_first').css({ 'transform': 'rotate(60deg)', 'height': '55px', 'width': '14px', 'top': '-11px', 'left': '-40px' })
    $('.bird__head-dots_second').css({ 'transform': 'rotate(-60deg)', 'height': '55px', 'width': '14px', 'top': '-11px', 'left': '40px' })
}

function decorationType7() {//Cross
    $('.bird__head-dots').css({ 'height': '68px' })
    $('.bird__head-dots_first').css({ 'transform': 'rotate(90deg)', 'height': '55px', 'width': '14px', 'top': '0px', 'left': '-40px' })
    $('.bird__head-dots_second').css({ 'transform': 'rotate(-90deg)', 'height': '55px', 'width': '14px', 'top': '0px', 'left': '40px' })
}

function middleDecorationColor(color,code) {
    $('.bird__head-dots').css('background-color', '#' + color)
    $('#middledecorationcode').html('code: '+ code)
    $('#dnadecorationMid').html(code)
}

function sidesDecorationColor(color,code) {
    $('.bird__head-dots_first, .bird__head-dots_second').css('background-color', '#' + color)
    $('#sidesdecorationcode').html('code: '+ code)
    $('#dnadecorationSides').html(code)
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
            $('#animationtext').html('Moving Bird');
            animationType1();
            break;
        case 2:    
            resetAnimation();
            $('#animationtext').html('Wagging Tail');
            animationType2();
            break;
        case 3:    
            resetAnimation();
            $('#animationtext').html('Clapping Paws');
            animationType3();
            break;
        case 4:    
            resetAnimation();
            $('#animationtext').html('Twitching Ear');
            animationType4();
            break;
        case 5:    
            resetAnimation();
            $('#animationtext').html('Nodding Head');
            animationType5();
            break;
        case 6:    
            resetAnimation();
            $('#animationtext').html('Twinkling Eye');
            animationType6();
            break;
        case 7:    
            resetAnimation();
            $('#animationtext').html('Wrinkling Nose');
            animationType7();
            break;
        case 8:    
            resetAnimation();
            $('#animationtext').html('Laughter');
            animationType8();
            break;
        case 9:    
            resetAnimation();
            $('#animationtext').html('Attention');
            animationType9();
            break;
        default:
            resetAnimation();
            $('#animationtext').html('None');
    }
}

function resetAnimation() {
    $('*').removeClass('movingBird waggingTail clappingPaws twitchingEar noddingHead twinklingEye wrinklingNose laughingMouth attentiveEars');
}

function animationType1() {
    $('.angryBird_Red').addClass('movingBird');
}

function animationType2() {
    $('.tail').addClass('waggingTail');
}

function animationType3() {
    $('.bird__paw-left_inner, bird__paw-right_inner').addClass('clappingPaws');
}

function animationType4() {
    $('#leftEar').addClass('twitchingEar');
}

function animationType5() {
    $('#head').addClass('noddingHead');
}

function animationType6() {
    $('.bird__eye--right').addClass('twinklingEye');
}

function animationType7() {
    $('.bird__nose').addClass('wrinklingNose');
}

function animationType8() {
    $('.beak_upper').addClass('laughingMouth');
}

function animationType9() {
    $('.bird__ear').addClass('attentiveEars');
}

function specialVariation(){
    //code later
}