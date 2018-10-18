
var song;
var fftSong, fftMic;
var buttonSong, buttonMic;
var mic;
// var recStatus = "rec";
var scorehtml = document.getElementById('score'), score = 0;
var volhistory = [];
var w;
var filter;
var link;
 
   
jQuery(document).ready(function() {

    // inner variables
    var tracker = $('.tracker');
    var volume = $('.volume');


    function initAudio(elem) {
        var url = elem.attr('audiourl');
        var title = elem.text();
        var cover = elem.attr('cover');
        var artist = elem.attr('artist');

        $('.player .title').text(title);
        $('.player .artist').text(artist);
        $('.player .cover').css('background-image','url(data/' + cover+')');;

        song = new Audio('data/' + url);
        link = $(song).attr('src');
        // timeupdate event listener
        song.addEventListener('timeupdate',function (){
            var curtime = parseInt(song.currentTime, 10);
            tracker.slider('value', curtime);
        });

        $('.playlist li').removeClass('active');
        elem.addClass('active');

        song = loadSound(link);
    }
    function playAudio() {
        song.play();

        tracker.slider("option", "max", song.duration);

        $('.play').addClass('hidden');
        $('.pause').addClass('visible');
    }

    function stopAudio() {
        song.pause();
        
        $('.play').removeClass('hidden');
        $('.pause').removeClass('visible');
    }

    // play click
    $('.play').click(function (e) {
        e.preventDefault();

        playAudio();
    });

    // pause click
    $('.pause').click(function (e) {
        e.preventDefault();

        stopAudio();
    });

    // forward click
    $('.fwd').click(function (e) {
        e.preventDefault();
        score = 0;
        scorehtml.innerHTML = score;


        stopAudio();

        var next = $('.playlist li.active').next();
        if (next.length == 0) {
            next = $('.playlist li:first-child');
        }
        initAudio(next);
    });

    // rewind click
    $('.rew').click(function (e) {
        e.preventDefault();

        stopAudio();

        var prev = $('.playlist li.active').prev();
        if (prev.length == 0) {
            prev = $('.playlist li:last-child');
        }
        initAudio(prev);
    });

    // show playlist
    $('.pl').click(function (e) {
        e.preventDefault();

        $('.playlist').fadeIn(300);
    });

    // playlist elements - click
    $('.playlist li').click(function () {
        score = 0;
        scorehtml.innerHTML = score;

        stopAudio();
        initAudio($(this));
    });

    // initialization - first element in playlist
    initAudio($('.playlist li:first-child'));

    // set volume
    song.volume = 0.8;

    // initialize the volume slider
    volume.slider({
        range: 'min',
        min: 1,
        max: 100,
        value: 80,
        start: function(event,ui) {},
        slide: function(event, ui) {
            song.volume = ui.value / 100;
        },
        stop: function(event,ui) {},
    });

    // empty tracker slider
    tracker.slider({
        range: 'min',
        min: 0, max: 10,
        start: function(event,ui) {},
        slide: function(event, ui) {
            song.currentTime = ui.value;
        },
        stop: function(event,ui) {}
    });
});

window.onload = function(){
  preload();
}

function preload(){
  var path = 'data/';
  var url = $('#song1').attr('audiourl');
  song = loadSound(link);
}


// function toggleSong(){
//   if(song.isPlaying()){
//     song.pause();
//     buttonSong.html('Play');
//   }else{
//     song.play();
//     buttonSong.html('Pause');
//   }
// }

// function toggleRecord(){
//   if(recStatus == "rec"){
//     mic.stop();
//     recStatus = "stop";
//   }
//   else{
//     mic.start();
//     recStatus = "rec";
//   }
// }


function setup(){
  scorehtml.innerHTML = score;

  var cnv = createCanvas(512,400);
  cnv.parent('canvasPlayer');

  noFill();
  mic = new p5.AudioIn();
  mic.start();
  mic.amp(0.8); // set mic gain

  // buttonSong = createButton('Pause');
  // buttonSong.mousePressed(toggleSong);

  // buttonMic = createButton('Rec/Stop');
  // buttonMic.mousePressed(toggleRecord);
  filter = new p5.BandPass();

  // song.play();
  fftMic  = new p5.FFT(0.7, 512);
  fftMic.setInput(mic);
  
  fftSong = new p5.FFT(0.7, 512);
  
  w = width / 128;
}

function draw(){
  background(0);
  var spectrumSong = fftSong.analyze();
  var spectrumMic = fftMic.analyze();
  //console.log(spectrumMic);
  // console.log(spectrumMic[0] + " " + spectrumSong[0]);

  // draw fft sound
  strokeWeight(3);
  for(var i=0; i<spectrumSong.length; i++){

    //map( whoMap, MIN, MAX, minVal, maxVal)
    
    // song spectrum
    var ampSong = spectrumSong[i];
    var ySong = map(ampSong, 0, 512, height, 0);

    
    //mic spectrum
    var ampMic = spectrumMic[i];
    var yMic = map(ampMic, 0, 1024, height, 0);
    var x = map(i, 0, spectrumMic.length, 0, width);
    var h = map(ampMic, 0, 1024, height, 0);
  
    if(ampMic == ampSong && ampSong >= 100){
      stroke(0,255,0);
      line(i*w, height, i*w , h);
      score += 0.5;

      scorehtml.innerHTML = score;
    }else{
      // warna untuk Suara
      stroke(255,224,2);
      line(i*w, height, i*w, ySong);

      // Warna untuk mic
      stroke(255);
      line(i*w, height, i*w , h);

    }
  }
}

/**
 *
 * HTML5 Audio player with playlist
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */
