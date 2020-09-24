var colors = Object.values(allColors())

const defaultDNA = {
    //Colors
    "topFeatherColor": 57,
    "bodyFeatherColor": 57,
    "topBeakColor": 83,
    "bottomBeakColor": 73,
    //Attributes
    "eyesShape": 0,
    "decorationPattern": 1,
    "decorationColor": 35,
    "decorationMidColor": 35,
    "decorationSmallColor": 35,
    "animation": 1,
    "special" : 1
    }

// populate default DNA and Color Screen when page loads
$(document).ready(function() {
  $('.colorscreen').show();
  $('.attributes').hide();
  setDefaultDNA();
});

function setDefaultDNA(){
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
  $('#dnaSpecial').html(defaultDNA.special);
  renderBird(defaultDNA);
}

function getDna(){
    var dna = '';
    dna += $('#dnaTopFeather').html();
    dna += $('#dnaBodyFeather').html();
    dna += $('#dnaTopBeak').html();
    dna += $('#dnaBottomBeak').html();
    dna += $('#dnaEyesShape').html();
    dna += $('#dnadecorationPattern').html();
    dna += $('#dnaDecorationAtEyes').html();
    dna += $('#dnaDecorationMid').html();
    dna += $('#dnaDecorationSmall').html();
    dna += $('#dnaAnimation').html();
    dna += $('#dnaSpecial').html();
    return parseInt(dna);
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
    decorationColor(colors[dna.decorationColor],dna.decorationColor);
    $('#ateyescolor').val(dna.decorationColor);
    middleColor(colors[dna.decorationMidColor],dna.decorationMidColor);
    $('#middlecolor').val(dna.decorationMidColor);
    smallColor(colors[dna.decorationSmallColor],dna.decorationSmallColor);
    $('#smallcolor').val(dna.decorationSmallColor);
    animationVariation(dna.animation);
    $('#animationstyle').val(dna.animation);
    specialVariation(dna.special);
    $('#specialtyle').val(dna.special);
}

// Event listeners
$('#colorsButton').click(()=>{
  $('.colorscreen').show();
  $('.attributes').hide();
});

$('#attributesButton').click(()=>{
  $('.colorscreen').hide();
  $('.attributes').show();
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

$('#attopBeakColor').change(()=>{
  var colorVal = $('#attopBeakColor').val();
  middleDecorationColor(colors[colorVal],colorVal);
});

$('#middlecolor').change(()=>{
  var colorVal = $('#middlecolor').val();
  sidesDecorationColor(colors[colorVal],colorVal);
});

$('#smallcolor').change(()=>{
  var colorVal = $('#smallcolor').val();
  sidesDecorationColor(colors[colorVal],colorVal);
});

$('#animationstyle').change(()=>{
  var variation = parseInt($('#animationstyle').val());
  animationVariation(variation);
});

$('#specialstyle').change(()=>{
  var variation = parseInt($('#specialstyle').val());
  specialVariation(variation);
});

$('#randomizeButton').click(()=>{
  genColors();
});

$('#defaultButton').click(()=>{
  setDefaultDNA();
});

$('#blockchainButton').click(()=>{
  //code later.
});