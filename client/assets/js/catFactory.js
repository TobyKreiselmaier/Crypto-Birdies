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

function headColor(color,code) {
    $('.cat__head, .cat__chest').css('background-color', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function mouthColor(color,code) {
    $('.cat__mouth-contour, .cat__chest, .cat__tail').css('background-color', '#' + color)  //This changes the color of the cat
    $('#mouthcode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnamouth').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function eyesColor(color,code) {
    $('.pupil-left, .pupil-right').css('background-color', '#' + color)  //This changes the color of the cat
    $('#eyescode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnaeyes').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function earsColor(color,code) {
    $('#leftEar, #rightEar, .cat__paw-left, .cat__paw-left_inner, .cat__paw-right, .cat__paw-right_inner').css('background-color', '#' + color)  //This changes the color of the cat
    $('#earscode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnaears').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function eyesVariation(num) {
    $('#dnashape').html(num)
    switch (num) {
        case 0:
            basicEyes();
            $('#eyeDesign').html('Basic');
            break;
        case 1:    
            basicEyes();
            $('#eyeDesign').html('Chilled');
            eyesType1();
            break;
        case 2:    
            basicEyes();
            $('#eyeDesign').html('Up');
            eyesType2();
            break;
        case 3:    
            basicEyes();
            $('#eyeDesign').html('Right');
            eyesType3();
            break;    
        case 4:    
            basicEyes();
            $('#eyeDesign').html('Left');
            eyesType4();
            break;    
        case 5:    
            basicEyes();
            $('#eyeDesign').html('Bottom Left');
            eyesType5();
            break;    
        case 6:    
            basicEyes();
            $('#eyeDesign').html('Top Right');
            eyesType6();
            break;    
        case 7:    
            basicEyes();
            $('#eyeDesign').html('Bottom Right');
            eyesType7();
            break;    
        case 8:    
            basicEyes();
            $('#eyeDesign').html('Top Left');
            eyesType8();
            break;    
        case 9:    
            basicEyes();
            $('#eyeDesign').html('Special');
            eyesType9();
            break;    
        default:
            basicEyes();
            $('#eyeDesign').html('Basic');
    }
}

function basicEyes() {
    $('.cat__eye').find('span').css('border', 'none');
    $('.cat__eye').find('span').css('transform', 'none');
    $('.cat__eye').find('span').css('background-image', 'none');
}

function eyesType1() {
    $('.cat__eye').find('span').css('border-top', '15px solid');
}

function eyesType2() {
    $('.cat__eye').find('span').css('border-bottom', '15px solid');
}

function eyesType3() {
    $('.cat__eye').find('span').css('border-left', '15px solid');
}

function eyesType4() {
    $('.cat__eye').find('span').css('border-right', '15px solid');
}

function eyesType5() {
    $('.cat__eye').find('span').css('border-top', '15px solid');
    $('.cat__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType6() {
    $('.cat__eye').find('span').css('border-bottom', '15px solid');
    $('.cat__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType7() {
    $('.cat__eye').find('span').css('border-left', '15px solid');
    $('.cat__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType8() {
    $('.cat__eye').find('span').css('border-right', '15px solid');
    $('.cat__eye').find('span').css('transform', 'rotate(30deg)');
}

function eyesType9() {
    $('.cat__eye').find('span').css('background-image', 'linear-gradient(to right, rgb(114, 108, 29) , rgb(31, 31, 61), rgb(114, 108, 29))');

}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 0:
            $('#decorationDesign').html('Basic');
            basicDecoration();
            break;
        case 1:
            basicDecoration();
            $('#decorationDesign').html('Large');
            decorationType1();
            break;
        case 2:
            basicDecoration();
            $('#decorationDesign').html('Max');
            decorationType2();
            break;
        case 3:
            basicDecoration();
            $('#decorationDesign').html('Left Twist');
            decorationType3();
            break;
        case 4:
            basicDecoration();
            $('#decorationDesign').html('Right Twist');
            decorationType4();
            break;
        case 5:
            basicDecoration();
            $('#decorationDesign').html('W-Shape');
            decorationType5();
            break;
        case 6:
            basicDecoration();
            $('#decorationDesign').html('Inverse W');
            decorationType6();
            break;
        case 7:
            basicDecoration();
            $('#decorationDesign').html('Cross');
            decorationType7();
            break;
        default:
            basicDecoration();
            $('#decorationDesign').html('Basic');
    }
}

function basicDecoration() {
    $('.cat__head-dots').css({ 'transform': 'rotate(0deg)', 'height': '48px', 'width': '14px' })
    $('.cat__head-dots_first').css({ 'transform': 'rotate(0deg)', 'height': '35px', 'width': '14px', 'top': '1px', 'left': '-20px' })
    $('.cat__head-dots_second').css({ 'transform': 'rotate(0deg)', 'height': '35px', 'width': '14px', 'top': '1px', 'left': '20px' })
}

function decorationType1() {//Large
    $('.cat__head-dots').css({ 'height': '68px' })
    $('.cat__head-dots_first').css({ 'height': '55px' })
    $('.cat__head-dots_second').css({ 'height': '55px' })
}

function decorationType2() {//Max
    $('.cat__head-dots').css({ 'height': '88px' })
    $('.cat__head-dots_first').css({ 'height': '75px' })
    $('.cat__head-dots_second').css({ 'height': '75px' })
}

function decorationType3() {//Left Twist
    $('.cat__head-dots').css({ 'height': '68px' })
    $('.cat__head-dots_first').css({ 'transform': 'rotate(60deg)', 'height': '55px', 'top': '-12px', 'left': '-38px'})
    $('.cat__head-dots_second').css({ 'height': '55px', })
}

function decorationType4() {//Right Twist
    $('.cat__head-dots').css({ 'height': '68px' })
    $('.cat__head-dots_first').css({ 'height': '55px', })
    $('.cat__head-dots_second').css({ 'transform': 'rotate(-60deg)', 'height': '55px', 'top': '-12px', 'left': '40px'})
}

function decorationType5() {//W-Shape
    $('.cat__head-dots').css({ 'height': '68px' })
    $('.cat__head-dots_first').css({ 'transform': 'rotate(-45deg)', 'height': '55px', 'width': '14px', 'top': '15px', 'left': '-40px' })
    $('.cat__head-dots_second').css({ 'transform': 'rotate(45deg)', 'height': '55px', 'width': '14px', 'top': '15px', 'left': '40px' })
}

function decorationType6() {//Inverse W
    $('.cat__head-dots').css({ 'height': '68px' })
    $('.cat__head-dots_first').css({ 'transform': 'rotate(60deg)', 'height': '55px', 'width': '14px', 'top': '-11px', 'left': '-40px' })
    $('.cat__head-dots_second').css({ 'transform': 'rotate(-60deg)', 'height': '55px', 'width': '14px', 'top': '-11px', 'left': '40px' })
}

function decorationType7() {//Cross
    $('.cat__head-dots').css({ 'height': '68px' })
    $('.cat__head-dots_first').css({ 'transform': 'rotate(90deg)', 'height': '55px', 'width': '14px', 'top': '0px', 'left': '-40px' })
    $('.cat__head-dots_second').css({ 'transform': 'rotate(-90deg)', 'height': '55px', 'width': '14px', 'top': '0px', 'left': '40px' })
}

function middleDecorationColor(color,code) {
    $('.cat__head-dots').css('background-color', '#' + color)  //This changes the color of the middle decoration
    $('#middledecorationcode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnadecorationMid').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function sidesDecorationColor(color,code) {
    $('.cat__head-dots_first, .cat__head-dots_second').css('background-color', '#' + color)  //This changes the color of the side decoration
    $('#sidesdecorationcode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnadecorationSides').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function animationVariation(num) {
    $('#dnaanimation').html(num)
    switch (num) {
        case 0:
            resetAnimation();
            $('#animationType').html('None');
            break;
        case 1:    
            resetAnimation();
            $('#animationType').html('Moving Head');
            animationType1();
            break;
        case 2:    
            resetAnimation();
            $('#animationType').html('Wagging Tail');
            animationType2();
            break;
        case 3:    
            resetAnimation();
            $('#animationType').html('Clapping Paws');
            animationType3();
            break;
        case 4:    
            resetAnimation();
            $('#animationType').html('Twitching Ear');
            animationType4();
            break;
        case 5:    
            resetAnimation();
            $('#animationType').html('Nodding Head');
            animationType5();
            break;
        case 6:    
            resetAnimation();
            $('#animationType').html('Twinkling Eye');
            animationType6();
            break;
        case 7:    
            resetAnimation();
            $('#animationType').html('Wrinkling Nose');
            animationType7();
            break;
        case 8:    
            resetAnimation();
            $('#animationType').html('Laughter');
            animationType8();
            break;
        case 9:    
            resetAnimation();
            $('#animationType').html('Attention');
            animationType9();
            break;
        default:
            resetAnimation();
            $('#animationType').html('None');
    }
}

function resetAnimation() {
    $('*').removeClass('movingHead waggingTail clappingPaws twitchingEar noddingHead twinklingEye wrinklingNose laughingMouth attentiveEars');
}

function animationType1() {
    $('#head').addClass('movingHead');
}

function animationType2() {
    $('#tail').addClass('waggingTail');
}

function animationType3() {
    $('.cat__paw-left_inner, cat__paw-right_inner').addClass('clappingPaws');
}

function animationType4() {
    $('#leftEar').addClass('twitchingEar');
}

function animationType5() {
    $('#head').addClass('noddingHead');
}

function animationType6() {
    $('.cat__eye--right').addClass('twinklingEye');
}

function animationType7() {
    $('.cat__nose').addClass('wrinklingNose');
}

function animationType8() {
    $('.cat__mouth-left, .cat__mouth-right').addClass('laughingMouth');
}

function animationType9() {
    $('.cat__ear').addClass('attentiveEars');
}