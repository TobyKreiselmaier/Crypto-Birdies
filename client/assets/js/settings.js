var colors = Object.values(allColors())

const defaultDNA = {
    "topFeatherColor": 57,
    "bodyFeatherColor": 57,
    "topBeakColor": 83,
    "bottomBeakColor": 73,
    "eyesShape": 0,
    "decorationPattern": 0,
    "decorationColor": 35,
    "decorationMidColor": 35,
    "decorationSmallColor": 35,
    "animation": 0,
    }

// populate default DNA and show Color Screen only when page loads
$(document).ready(function() {
  $('.colorscreen').show();
  $('.attributes').hide();
  setDefaultDna();
});

function setDefaultDna(){
  $('#dnaTopFeather').html(defaultDNA.topFeatherColor);
  $('#dnaBodyFeather').html(defaultDNA.bodyFeatherColor);
  $('#dnaTopBeak').html(defaultDNA.topBeakColor);
  $('#dnaBottomBeak').html(defaultDNA.bottomBeakColor);
  $('#dnaEyesShape').html(defaultDNA.eyesShape);
  $('#dnadecorationPattern').html(defaultDNA.decorationPattern);
  $('#dnaDecorationAtEyes').html(defaultDNA.decorationColor);
  $('#dnaDecorationMid').html(defaultDNA.decorationMidColor);
  $('#dnaDecorationSmall').html(defaultDNA.decorationSmallColor);
  $('#dnaAnimation').html(defaultDNA.animation);
  renderBird(defaultDNA);
}

function getDna(){
    var dna = '';
    dna += $('#dnaTopFeather').html();
    dna += $('#dnaBodyFeather').html();
    dna += $('#dnaTopBeak').html();
    dna += $('#dnaBottomBeak').html();
    dna += $('#dnaEyesShape').html();
    dna += $('#dnaDecorationPattern').html();
    dna += $('#dnaDecorationAtEye').html();
    dna += $('#dnaDecorationMid').html();
    dna += $('#dnaDecorationSmall').html();
    dna += $('#dnaAnimation').html();
    return dna;
}

function setRandomDna(){
  var randomDna = {
    "topFeatherColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "bodyFeatherColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "topBeakColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "bottomBeakColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "eyesShape": Math.floor(Math.random()*8),// number from 0 to 7
    "decorationPattern": Math.floor(Math.random()*8),// number from 0 to 7
    "decorationColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "decorationMidColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "decorationSmallColor": Math.floor(Math.random()*90) + 10,// number from 10 to 99
    "animation": Math.floor(Math.random()*9),// number from 0 to 8
    //this will always return 17 digits for the Dna of a bird.
    };
  renderBird(randomDna);
}

function renderBird(dna){
    topFeatherColor(colors[dna.topFeatherColor],dna.topFeatherColor);
    $('#topfeatherscolor').val(dna.topFeatherColor);
    bodyFeatherColor(colors[dna.bodyFeatherColor],dna.bodyFeatherColor);
    $('#bodyfeatherscolor').val(dna.bodyFeatherColor);
    topBeakColor(colors[dna.topBeakColor],dna.topBeakColor);
    $('#topbeakcolor').val(dna.topBeakColor);
    bottomBeakColor(colors[dna.bottomBeakColor],dna.bottomBeakColor);
    $('#bottombeakcolor').val(dna.bottomBeakColor);
    eyesVariation(dna.eyesShape);
    $('#eyesstyle').val(dna.eyesShape);
    decorationVariation(dna.decorationPattern);
    $('#decorationstyle').val(dna.decorationPattern);
    decorationMainColor(colors[dna.decorationColor],dna.decorationColor);
    $('#ateyescolor').val(dna.decorationColor);
    middleColor(colors[dna.decorationMidColor],dna.decorationMidColor);
    $('#middlecolor').val(dna.decorationMidColor);
    smallColor(colors[dna.decorationSmallColor],dna.decorationSmallColor);
    $('#smallcolor').val(dna.decorationSmallColor);
    animationVariation(dna.animation);
    $('#animationstyle').val(dna.animation);
}

// Event listeners
$('#colorsButton').click(()=>{
  $('.colorscreen').show();
  $('.attributes').hide();
  $('.angryBird_Red').css('top', '15em');
});

$('#attributesButton').click(()=>{
  $('.colorscreen').hide();
  $('.attributes').show();
  $('.angryBird_Red').css('top', '25em');
});

$('#topfeatherscolor').change(()=>{
  var colorVal = $('#topfeatherscolor').val();
  topFeatherColor(colors[colorVal],colorVal);
});

$('#bodyfeatherscolor').change(()=>{
  var colorVal = $('#bodyfeatherscolor').val();
  bodyFeatherColor(colors[colorVal],colorVal);
});

$('#topbeakcolor').change(()=>{
  var colorVal = $('#topbeakcolor').val();
  topBeakColor(colors[colorVal],colorVal);
});

$('#bottombeakcolor').change(()=>{
  var colorVal = $('#bottombeakcolor').val();
  bottomBeakColor(colors[colorVal],colorVal);
});

$('#eyesstyle').change(()=>{
  var shape = parseInt($('#eyesstyle').val());
  eyesVariation(shape);
});

$('#decorationstyle').change(()=>{
  var shape = parseInt($('#decorationstyle').val());
  decorationVariation(shape);
});

$('#ateyescolor').change(()=>{
  var colorVal = $('#ateyescolor').val();
  decorationMainColor(colors[colorVal],colorVal);
});

$('#middlecolor').change(()=>{
  var colorVal = $('#middlecolor').val();
  middleColor(colors[colorVal],colorVal);
});

$('#smallcolor').change(()=>{
  var colorVal = $('#smallcolor').val();
  smallColor(colors[colorVal],colorVal);
});

$('#animationstyle').change(()=>{
  var variation = parseInt($('#animationstyle').val());
  animationVariation(variation);
});

$('#randomizeButton').click(()=>{
  setRandomDna();
});

$('#defaultButton').click(()=>{
  setDefaultDna();
});

$('#blockchainButton').click(()=>{
  sendBirdToBlockchain();
});