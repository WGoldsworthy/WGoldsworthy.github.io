// Particle Audio Visualiser based on Perlin noise fields
// William Goldsworthy

// Initialise Variables
var song;
var button;
var amp;
var width, height;
var volhistory = [];
var peaks;
var count = 0;
var prespeed = 3;
var cols, rows;
var scl = 40;
var fr;
var zoff=0;
var particles = [];
var flowfield;

// Control for visualiser variables
var speed_input = 1.5;
var noise_input = 2;
var num_particles = 800;

// Ensure audio is loaded previous to starting the visuals
function preload() {
  song = loadSound('audio/BeginByLettingGo.mp3');
}

// Create canvas and begin the perlin noise field.
// Additional setup for audio.
function setup() {
  width = $(window).innerWidth();
  height = $(window).innerHeight();
  createCanvas(width, height);

  // Begin audio stream
  song.setVolume(1);
  song.play();
  button = createButton("pause");
  button.mousePressed(togglePlaying);

  // Start P5 amplitude object
  amp = new p5.Amplitude();

  pixelDensity(1);

  // Start Perlin Noise field
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);

  // Add custom particles into the Noise field
  for(var i = 0; i < 800; i++) {
    particles[i] = new Particle();
  }

  background(20);

  // Control for speed of particles based on screen width
  // Larger screens benefit from a higher particle speed.
  if (width > 1300) {
    prespeed = 5;
  }

}

// Control for pause/play audio
function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(1);
    document.getElementById('pause').innerHTML = "pause";
  } else {
    song.pause();
    document.getElementById('pause').innerHTML = "play";
  }
}

// After load of audio, ensure the song plays.
function loaded() {
  song.play();
}

// Draw particles
function draw() {

  perlin();

  fr.html(floor(frameRate()));
}


var inc = 0.1;
var prevol = 0;

// Function for initialising and controlling perlin noise field
function perlin(){
  background(10, 20);

  var vol = amp.getLevel();

  var diff = Math.abs(vol - prevol);

  var ndiff = vol - prevol;
  var nval = ndiff/100;
  var val = diff / 100;

  var yoff = 0;
  for(var y=0; y < rows; y++) {
    var xoff = 0;
    for(var x=0; x < cols; x++) {
      var vindex = (x+y*width) * 4;

      var index = x + y * cols;
      
      // Direction of noise field is based off audio input
      var angle = noise(xoff/2 * noise_input, yoff/2 * noise_input, zoff/2 * noise_input) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);

      stroke(255);
      push();
      translate(x*scl, y*scl);
      rotate(v.heading());
      pop();

      v.setMag(1);

      flowfield[index] = v
      xoff -= 0.01 ;

      stroke(0, 1000);

    }
    yoff += 0.01;
    zoff += 0.0004

    prevol = vol;
  }

  // Update particle speed based on audio volume
  var speed = speed_input + (vol * 35)
  stroke(255);

  for(var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update(speed);
    particles[i].edges();
    particles[i].show(speed);
  }

  // Control for continually adding and removing particles to maintain variation in effect
  if (particles.length !== num_particles) {

    diff_num = num_particles - particles.length;

    if (diff_num > 0){
      i = 0;
      while (i <= diff_num) {
        particles.push(new Particle());
        i++;
      }
    } else {
      i = 0
      while (i >= diff_num) {
        particles.shift();
        i--;
      }
    }
  }

  if (count == 50) {
    particles.shift();
    particles.push(new Particle());
    count = 0;
  } else {
    count++;
  }


}

// Maintain a general volume limit
function volumeLimit(v) {
  var max = 10;
  var vol = 0;
  if (v > max) {
    var times = v / max;
    vol = v - (Math.floor(times) * max);
    return vol;
  } else {
    vol = v;
    return vol;
  }
}

// Calculate square sizes for the noise field based on screen size
function squares() {
  stroke(255)

  var centreX = width/2;
  var centreY = height/2;

  var randomY = Math.random() * height;
  var randomX = Math.random() * width;

  line(centreX, centreY, randomX, randomY);
}


// Add event listeners for in DOM sliders.
document.addEventListener("DOMContentLoaded", function() {

  document.getElementById('pause').addEventListener("click", function() {
    togglePlaying();
  });

  document.getElementById('noise_slider').oninput = function(){
    noise_input = this.value
    console.log(noise_input)
  }

  document.getElementById('particles_slider').oninput = function(){
    num_particles = this.value
  }

})

