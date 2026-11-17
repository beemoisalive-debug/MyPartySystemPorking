class ParticleSystem {
    constructor(position) {
        this.origin = position.copy();
        this.particles = [];
    }

    // 위치를 넘기면 그 지점에서, 없으면 origin에서 생성
    addParticle(position) {
        this.particles.push(new Particle(position ? position : this.origin));
    }

    run() {
        for (let i = this.particles.length-1; i >= 0; i--) {
            let p = this.particles[i];
            p.run();
            if (p.isDead()) {
            this.particles.splice(i, 1);
            }
        }
    }

}


// let ParticleSystem = function(position) {
//   this.origin = position.copy();
//   this.particles = [];
// };

// ParticleSystem.prototype.addParticle = function() {
//   this.particles.push(new Particle(this.origin));
// };

// ParticleSystem.prototype.run = function() {
//   for (let i = this.particles.length-1; i >= 0; i--) {
//     let p = this.particles[i];
//     p.run();
//     if (p.isDead()) {
//       this.particles.splice(i, 1);
//     }
//   }
// };
