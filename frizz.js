var _s2 = function(sketch) {
  var np = 300;
  var startcol;

  sketch.setup = function() {
  	sketch.createCanvas(window.innerWidth, window.innerHeight);
  	//sketch.background(255);
  	sketch.noFill();
  	sketch.noiseSeed(sketch.random(100));
  	startcol = sketch.random(255);
  }

  sketch.draw = function() {
  	// background(51);
  	sketch.beginShape();
  	var sx, sy;
  	for(var i = 0; i < np; i++) {
  		var angle = sketch.map(i, 0, np, 0, sketch.TWO_PI);
  		var cx = sketch.frameCount * 2 - 200;
  		var cy = sketch.height / 2 + 50 * sketch.sin(sketch.frameCount / 50);
  		var xx = 100 * sketch.cos(angle + cx / 10);
  		var yy = 100 * sketch.sin(angle + cx / 100);
  		var v = sketch.createVector(xx, yy);
  		xx = (xx + cx) / 150; yy = (yy + cy) / 150;
  		v.mult(1 + 1.5 * sketch.noise(xx, yy));
  		sketch.vertex(cx + v.x, cy + v.y);
  		if(i == 0) {
  			sx = cx + v.x;
  			sy = cy + v.y;
  		}
  	}
  	sketch.colorMode(sketch.HSB);
  	var hue = cx / 10 - startcol;
  	if(hue < 0) hue += 255;
  	sketch.stroke(hue, 100, 120);
  	sketch.strokeWeight(0.1);
  	sketch.vertex(sx, sy);
  	sketch.endShape();
  	if(sketch.frameCount > sketch.width + 500) {
  		sketch.noLoop();
  	}
  }
}

var myp5 = new p5(_s2, 'p5canvas2');
