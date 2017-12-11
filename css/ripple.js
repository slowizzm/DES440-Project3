var _s = function(sketch) {

const block_size = 25;
const block_core = 1;
const block_move_distance = 10;
const block_move_range = 70;
const block_scale = 0.02;
const ripple_speed = 0.24;

let show_ripples = false;
let show_info = false;

let mouse_speed;
let fps, avgFps = 0;
let prevFrame = 0;
let prevTime = 0;
let fpsInterval = 1000;

/**
 * @type {Block[][]}
 */
let blocks;

/**
 * @type {Ripple[]}
 */
let ripples = [];

sketch.setup = function() {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
    sketch.noStroke();
    sketch.fill(233, 230);
    sketch.rectMode(sketch.CENTER);
    sketch.noSmooth();

    let left_padding = Math.round(sketch.width % block_size) / 2;
    let top_padding = Math.round(sketch.height % block_size) / 2;

    blocks = Array.from({ length: Math.floor(sketch.height / block_size) }, (v, y) =>
        Array.from({ length: Math.floor(sketch.width / block_size) }, (v, x) =>
            new Block(left_padding + block_size * (x + 0.5), top_padding + block_size * (y + 0.5), y * Math.floor(sketch.width / block_size) + x)
        )
    );
}

sketch.draw = function() {
    if (sketch.keyIsDown(32)) {
        if (sketch.random() < sketch.pow(fps / 60, 3)) {
            ripples.push(new Ripple(sketch.random(sketch.width), sketch.random(sketch.height), 0.4));
        }
    } else {
        if (sketch.random() < sketch.pow(fps / 60, 3) / 16) {
            ripples.push(new Ripple(sketch.random(sketch.width), sketch.random(sketch.height), 0.1));
        }
    }


    fps = sketch.frameRate();

    if (sketch.millis() - prevTime > fpsInterval) {
        avgFps = (sketch.frameCount - prevFrame) / fpsInterval * 1000;
        prevFrame = sketch.frameCount;
        prevTime = sketch.millis();
    }

    mouse_speed = sketch.dist(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);

    sketch.background(100, 140);

    sketch.rectMode(sketch.CENTER);

    ripples.forEach((ripple, i) => {
        ripple.updateRadius();
        ripple.checkKill();
    });

    if (show_ripples) {
        sketch.strokeWeight(2);
        ripples.forEach((ripple, i) => {
            ripple.draw();
        })
    }

    sketch.noStroke();
    blocks.forEach((line, i) =>
        line.forEach((block, j) => {
            block.calcDiff(ripples);
            block.render();
        })
    );
    if (show_info) {
        sketch.rectMode(sketch.CORNER);
        sketch.fill(20, 200);
        sketch.rect(0, 0, 120, 64);
        sketch.fill(220);
        sketch.textFont('monospace', 16);
        sketch.text('Ripples: ' + ripples.length, 10, 24);
        sketch.text('FPS: ' + avgFps, 10, 48);
    }
}

//function mousePressed() {
//    ripples.push(new Ripple(mouseX, mouseY, 1));
//}

 sketch.mouseMoved = function() {
    if (sketch.random() < sketch.pow(fps / 60, 3) * mouse_speed / 30) {
        ripples.push(new Ripple(sketch.mouseX, sketch.mouseY, 0.15 * mouse_speed / 40));
    }
}

 sketch.mouseDragged = function() {
    if (sketch.random() < sketch.pow(fps / 60, 3) * mouse_speed / 20) {
        ripples.push(new Ripple(sketch.mouseX, sketch.mouseY, 0.6 * mouse_speed / 40));
    }
}

 sketch.keyPressed = function() {
    if (sketch.keyCode === 73) {
        show_info = !show_info;
    } else if (sketch.keyCode === 82) {
        show_ripples = !show_ripples;
    }
}


class Block {
    constructor(x, y, id) {
        this.pos = sketch.createVector(x, y);
        this.id = id;
    }

    render() {
        sketch.fill(255, sketch.cubicInOut(this.amp, 60, 240, 15));
        sketch.rect(this.pos.x + this.diff.x, this.pos.y + this.diff.y, (block_core + this.amp * block_scale) * 5, block_core + this.amp * block_scale * 0.5);
        sketch.rect(this.pos.x + this.diff.x, this.pos.y + this.diff.y, block_core + this.amp * block_scale * 0.5, (block_core + this.amp * block_scale) * 5);
    }

    /**
     * @param {Ripple[]} ripples
     */
    calcDiff(ripples) {
        this.diff = sketch.createVector(0, 0);
        this.amp = 0;

        ripples.forEach((ripple, i) => {
            if (!ripple.dists[this.id]) {
                ripple.dists[this.id] = sketch.dist(this.pos.x, this.pos.y, ripple.pos.x, ripple.pos.y);
            };
            let distance = ripple.dists[this.id] - ripple.currRadius;
            if (distance < 0 && distance > -block_move_range * 2) {
                if (!ripple.angles[this.id]) {
                    ripple.angles[this.id] = p5.Vector.sub(this.pos, ripple.pos).heading();
                };
                const angle = ripple.angles[this.id];
                const localAmp = cubicInOut(-abs(block_move_range + distance) + block_move_range, 0, block_move_distance, block_move_range) * ripple.scale;
                this.amp += localAmp;
                const movement = p5.Vector.fromAngle(angle).mult(localAmp);
                this.diff.add(movement);
            }
        });
    }

}

class Ripple {
    constructor(x, y, scale) {
        this.pos = sketch.createVector(x, y);
        this.initTime = sketch.millis();
        this.currRadius = 0;
        this.endRadius = sketch.max(sketch.dist(this.pos.x, this.pos.y, 0, 0), sketch.dist(this.pos.x, this.pos.y, 0, sketch.height), sketch.dist(this.pos.x, this.pos.y, sketch.width, 0), sketch.dist(this.pos.x, this.pos.y, sketch.height, sketch.width)) + block_move_range;
        this.scale = scale;

        this.dists = [];
        this.angles = [];
    }

    checkKill() {
        if (this.currRadius > this.endRadius) {
            ripples.splice(ripples.indexOf(this), 1);
        }
    }

    updateRadius() {
        this.currRadius = (sketch.millis() - this.initTime) * ripple_speed;
        //this.currRadius = 200;
    }

    draw() {
        sketch.stroke(255, sketch.cubicInOut(this.scale, 30, 120, 1));
        sketch.noFill();
        sketch.ellipse(this.pos.x, this.pos.y, this.currRadius * 2, this.currRadius * 2);
    }
}

 sketch.cubicInOut = function(t, b, c, d) {
    if (t <= 0) return b;
    else if (t >= d) return b + c;
    else {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }
}}

var myp5 = new p5(_s, 'p5Canvas');
