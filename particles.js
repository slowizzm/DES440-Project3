var _s = function(sketch) {

var MAX_PARTICLES = 170;
var COLORS = [ 'rgba(242,43,43,.1)', 'rgba(96,0,40,.1)', 'rgba(55,43,255,.1)', 'rgba(242,0,55,.1)', 'rgba(242,0,33,.1)' ];

//ARRAYS
var particles = [];
var pool = [];

//VARIABLES
var wander1 = 0.5;
var wander2 = 2.0;
var drag1 = .9;
var drag2 = .99;
var force1 = 2;
var force2 = 8;
var theta1 = -0.5;
var theta2 = 0.5;
var size1 = 5;
var size2 = 180;
var sizeScalar = 0.97;


// ----------------------------------------
// Particle Functions
// ----------------------------------------

 sketch.Particle = function(x,y,size) {
    this.alive = true;
    this.size = size || 10;
    this.wander = 0.15;
    this.theta = sketch.random( sketch.TWO_PI );
    this.drag = 0.92;
    this.color = '#fff';
  	this.location = sketch.createVector(x || 0.0, y || 0.0);
	this.velocity = sketch.createVector(0.0, 0.0);
}
sketch.Particle.prototype.move = function() {
    this.location.add(this.velocity);
  	this.velocity.mult(this.drag);
    this.theta += sketch.random( theta1, theta2 ) * this.wander;
    this.velocity.x += sketch.sin( this.theta ) * 0.1;
    this.velocity.y += sketch.cos( this.theta ) * 0.1;
    this.size *= sizeScalar;
    this.alive = this.size > 1;
}
sketch.Particle.prototype.show = function() {
  //arc( this.location.x, this.location.y, this.size, 0, TWO_PI );
  sketch.fill(this.color);
  sketch.noStroke();
  sketch.ellipse(this.location.x,this.location.y, this.size, this.size);
}

sketch.spawn = function(x,y) {
    var particle, theta, force;
    if ( particles.length >= MAX_PARTICLES ) {
        // pool.push( particles.shift() );
        pool.push( particles.splice( i, 1 )[0] );
    }
    particle = new sketch.Particle(sketch.mouseX, sketch.mouseY, sketch.random(size1,size2));
    particle.wander = sketch.random( wander1, wander2 );
    particle.color = sketch.random( COLORS );
    particle.drag = sketch.random( drag1, drag2 );
    theta = sketch.random( sketch.TWO_PI );
    force = sketch.random( force1, force2 );
  	particle.velocity.x = sketch.sin( theta ) * force;
    particle.velocity.y = sketch.cos( theta ) * force;
    particles.push( particle );
}
sketch.update = function() {
    var i, particle;
    for ( var i = particles.length - 1; i >= 0; i-- ) {
        particle = particles[i];
        if ( particle.alive ) {
          particle.move();
        } else {
          pool.push( particles.splice( i, 1 )[0] );
        }
    }
}
sketch.moved = function() {
    var particle, max, i;
    max = sketch.random( 1, 4 );
    for ( i = 0; i < max; i++ ) {
      sketch.spawn( sketch.mouseX, sketch.mouseY );
    }
}


// ----------------------------------------
// Runtime
// ----------------------------------------

sketch.setup = function() {
	sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
}

sketch.draw = function() {
	sketch.update();
    sketch.drawingContext.globalCompositeOperation = 'normal';
  	//sketch.background(0,0);
    sketch.clear();
 	sketch.drawingContext.globalCompositeOperation = 'lighter';
	for (var i = particles.length - 1; i >= 0; i--) {
    	particles[i].show();
    }
}

sketch.mouseMoved = function() {
   sketch.moved();
}

sketch.touchMoved = function() {
    sketch.moved();
}

sketch.windowResized = function() {
  sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
}
}
var myp5 = new p5(_s, 'p5Canvas');
