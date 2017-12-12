var _s = function(sketch) {


var speed = 0.1;
var maxSize = 20;
var falloff = 200;
var steps = 13;


 sketch.setup = function() {
	sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

	sketch.textAlign(sketch.CENTER);

	sketch.noStroke();
}


 sketch.draw = function() {
	//sketch.background(0);
  sketch.clear();
	for (let x = 0; x < sketch.width; x+=steps) {
		for (let y = 0; y < sketch.height; y+=steps) {
			let mult = 0.1;

			let d = sketch.dist(sketch.mouseX, sketch.mouseY, x, y);
			if (d < falloff) {
				mult = sketch.map(d, 0, falloff, 1, 0.1);
			}

			let sw = sketch.sin((x*y+sketch.frameCount)*speed)*maxSize*mult;

			sketch.textSize(sketch.abs(sw));

			if (sw > 0) {
				sketch.fill(255);
				sketch.ellipse(x,y,0.1,0.1);
			} else {
				sketch.fill(200, 255, 200);
				sketch.ellipse(x,y,0.3,0.3);
			}
		}
	}
}
}

var myp5 = new p5(_s, 'p5Canvas3');
