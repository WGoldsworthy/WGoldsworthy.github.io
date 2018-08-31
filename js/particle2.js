var sector_length = 100;

// Custom particles for use in visualiser
function Particle() {

  // Initialise variables
  this.pos = createVector(random(width), random(height));
  this.vel = p5.Vector.random2D();
  this.acc = createVector(0, 0);
  this.maxspeed = 4;

  this.x = []
  this.y = []
  this.segNum = 100,
  this.segLength = 18;

  for (var i = 0; i < this.segNum; i++) {
    this.x[i] = 0;
    this.y[i] = 0;
  }

  this.h = 0;

  this.prevPos = this.pos.copy();

  // Update function to control movement based on audio
  this.update = function(v) {
    this.vel.add(this.acc);
    this.vel.limit(v);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  // Maintain that particles follow the perlin noise vectors
  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function(v) {
    var r = random(255);
  	var g = random(255);
  	var b = random(255);
    stroke(this.h, g, b, (v*20));
    this.h = this.h + 1;
    if (this.h > 255) {
      this.h = 0;
    }
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }

  }

  this.draw = function() {
    background(0);
    this.dragSegment(0, this.pos.x, this.pos.y);
    for( var i=0; i<this.x.length-1; i++) {
      this.dragSegment(i+1, this.x[i], this.y[i]);
    }
  }

  this.dragSegment = function(i, xin, yin) {
    var dx = xin - this.x[i];
    var dy = yin - this.y[i];
    var angle = atan2(dy, dx);
    this.x[i] = xin - cos(angle) * this.segLength;
    this.y[i] = yin - sin(angle) * this.segLength;
    this.segment(this.x[i], this.y[i], angle);
  }

  this.segment= function(x, y, a) {
    push();
    translate(x, y);
    rotate(a);
    line(0, 0, this.segLength, 0);
    pop();
  }

}
