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

function eyeVariation(num) {

    $('#dnashape').html(num)
    switch (num) {
        case 0:
            normalEyes();
            $('#eyeDesign').html('Basic');
            break;
        case 1:    
            normalEyes();
            $('#eyeDesign').html('Chilled');
            eyesType1();
            break;
        case 2:    
            normalEyes();
            $('#eyeDesign').html('Up');
            eyesType2();
            break;
        case 3:    
            normalEyes();
            $('#eyeDesign').html('Right');
            eyesType3();
            break;    
        case 4:    
            normalEyes();
            $('#eyeDesign').html('Left');
            eyesType4();
            break;    
        case 5:    
            normalEyes();
            $('#eyeDesign').html('Bottom Left');
            eyesType5();
            break;    
        case 6:    
            normalEyes();
            $('#eyeDesign').html('Top Right');
            eyesType6();
            break;    
        case 7:    
            normalEyes();
            $('#eyeDesign').html('Bottom Right');
            eyesType7();
            break;    
        case 8:    
            normalEyes();
            $('#eyeDesign').html('Top Left');
            eyesType8();
            break;    
        case 9:    
            normalEyes();
            $('#eyeDesign').html('Special');
            eyesType9();
            break;    

    }
}

function normalEyes() {
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

function normaldecoration() {
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#decorationName').html('Basic');
            normaldecoration();
            break;













            
    }
}
