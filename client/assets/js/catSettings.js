var colors = Object.values(allColors())

var defaultDNA = {
    //Colors
    "headColor" : 57,
    "mouthColor" : 28,
    "eyesColor" : 83,
    "earsColor" : 73,
    //Cattributes
    "eyesShape" : 1,
    "decorationPattern" : 4,
    "decorationMidcolor" : 35,
    "decorationSidescolor" : 13,
    "animation" :  1,
    "lastNum" :  1
    }

// populate DNA when page loads
$(document).ready(function() {
  $('#dnabody').html(defaultDNA.headColor);
  $('#dnamouth').html(defaultDNA.mouthColor);
  $('#dnaeyes').html(defaultDNA.eyesColor);
  $('#dnaears').html(defaultDNA.earsColor);
  $('#dnashape').html(defaultDNA.eyesShape);
  $('#dnadecoration').html(defaultDNA.decorationPattern);
  $('#dnadecorationMid').html(defaultDNA.decorationMidcolor);
  $('#dnadecorationSides').html(defaultDNA.decorationSidescolor);
  $('#dnaanimation').html(defaultDNA.animation);
  $('#dnaspecial').html(defaultDNA.lastNum);
  renderCat(defaultDNA);
});

function getDna(){
    var dna = '';
    dna += $('#dnabody').html();
    dna += $('#dnamouth').html();
    dna += $('#dnaeyes').html();
    dna += $('#dnaears').html();
    dna += $('#dnashape').html();
    dna += $('#dnadecoration').html();
    dna += $('#dnadecorationMid').html();
    dna += $('#dnadecorationSides').html();
    dna += $('#dnaanimation').html();
    dna += $('#dnaspecial').html();
    return parseInt(dna);
}

function renderCat(dna){
    headColor(colors[dna.headColor],dna.headColor);
    $('#bodycolor').val(dna.headColor);
    mouthColor(colors[dna.mouthColor],dna.mouthColor);
    $('#mouthcolor').val(dna.mouthColor);
    eyesColor(colors[dna.eyesColor],dna.eyesColor);
    $('#eyescolor').val(dna.eyesColor);
    earsColor(colors[dna.earsColor],dna.earsColor);
    $('#earscolor').val(dna.earsColor);
    eyesVariation(dna.eyesShape);
    $('#eyesStyle').val(dna.eyesShape);
    decorationVariation(dna.decorationPattern);
    $('#decorationStyle').val(dna.decorationPattern);
    middleDecorationColor(colors[dna.decorationMidcolor],dna.decorationMidcolor);
    $('#middledecorationcolor').val(dna.decorationMidcolor);
    sidesDecorationColor(colors[dna.decorationSidescolor],dna.decorationSidescolor);
    $('#middledecorationcolor').val(dna.decorationSidescolor);

}

// Event listeners
$('#bodycolor').change(()=>{
    var colorVal = $('#bodycolor').val();
    headColor(colors[colorVal],colorVal);
});

$('#mouthcolor').change(()=>{
  var colorVal = $('#mouthcolor').val();
  mouthColor(colors[colorVal],colorVal);
});

$('#eyescolor').change(()=>{
  var colorVal = $('#eyescolor').val();
  eyesColor(colors[colorVal],colorVal);
});

$('#earscolor').change(()=>{
  var colorVal = $('#earscolor').val();
  earsColor(colors[colorVal],colorVal);
});

$('#eyesStyle').change(()=>{
  var shape = parseInt($('#eyesStyle').val());
  eyesVariation(shape);
});

$('#decorationStyle').change(()=>{
  var shape = parseInt($('#decorationStyle').val());
  decorationVariation(shape);
});

$('#middledecorationcolor').change(()=>{
  var colorVal = $('#middledecorationcolor').val();
  middleDecorationColor(colors[colorVal],colorVal);
});

$('#sidesdecorationcolor').change(()=>{
  var colorVal = $('#sidesdecorationcolor').val();
  sidesDecorationColor(colors[colorVal],colorVal);
});