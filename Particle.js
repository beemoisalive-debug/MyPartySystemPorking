class Particle {
    constructor(position) {
        // 눈물이라 아래로 살짝만 가속한다
        this.acceleration = createVector(0, 0.06);
        this.velocity = createVector(random(-0.25, 0.25), random(0.2, 1.2));
        this.position = position.copy();
        this.previous = position.copy();
        this.size = random(3.6, 6.2);
        this.lifespan = 255;
    }

    run() {
        this.update();
        this.display();
    }

    update() {
        this.previous = this.position.copy();
        this.velocity.add(this.acceleration);
        // 볼을 타고 흐르는 속도로 제한
        this.velocity.y = constrain(this.velocity.y, 0.1, 3.4);
        this.position.add(this.velocity);
        this.lifespan -= 1.5;
    }

    display() {
        const a = constrain(this.lifespan, 0, 255);

        // 지나간 자리의 젖은 흔적
        stroke(150, 210, 255, a * 0.22);
        strokeWeight(this.size * 0.9);
        line(this.previous.x, this.previous.y,
             this.position.x, this.position.y);

        noStroke();

        // 물방울: 바깥쪽은 옅게, 안쪽은 진하게
        fill(170, 215, 255, a * 0.45);
        this.tear(this.size * 1.5);

        fill(205, 238, 255, a * 0.85);
        this.tear(this.size * 0.85);

        // 반짝임
        fill(255, 255, 255, a * 0.9);
        ellipse(this.position.x - this.size * 0.3,
                this.position.y + this.size * 0.1,
                this.size * 0.42);
    }

    // 물방울 모양: 위는 뾰족하고 아래는 둥글다
    tear(r) {
        const x = this.position.x;
        const y = this.position.y;
        const steps = 12;

        // 오른쪽 절반: 꼭지점 → 아래
        const curve = (a, b, c, d, t) =>
            pow(1 - t, 3) * a + 3 * pow(1 - t, 2) * t * b +
            3 * (1 - t) * t * t * c + pow(t, 3) * d;

        beginShape();
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            vertex(x + curve(0, 0.95 * r, r, 0, t),
                   y + curve(-1.5 * r, -0.55 * r, r, r, t));
        }
        // 왼쪽 절반: 아래 → 꼭지점
        for (let i = steps - 1; i >= 0; i--) {
            const t = i / steps;
            vertex(x - curve(0, 0.95 * r, r, 0, t),
                   y + curve(-1.5 * r, -0.55 * r, r, r, t));
        }
        endShape(CLOSE);
    }

    isDead() {
        return this.lifespan < 0;
    }
}



// // A simple Particle class
// let Particle = function(position) {
//   this.acceleration = createVector(0, 0.05);
//   this.velocity = createVector(random(-1, 1), random(-1, 0));
//   this.position = position.copy();
//   this.lifespan = 255;
// };

// Particle.prototype.run = function() {
//   this.update();
//   this.display();
// };

// // Method to update position
// Particle.prototype.update = function(){
//   this.velocity.add(this.acceleration);
//   this.position.add(this.velocity);
//   this.lifespan -= 2;
// };

// // Method to display
// Particle.prototype.display = function() {
//   stroke(200, this.lifespan);
//   strokeWeight(2);
//   fill(127, this.lifespan);
//   ellipse(this.position.x, this.position.y, 12, 12);
// };

// // Is the particle still useful?
// Particle.prototype.isDead = function(){
//   return this.lifespan < 0;
// };
