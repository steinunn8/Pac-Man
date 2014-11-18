var particleManager = {
	particles: [],

	render: function(ctx) {
		for(var i = 0; i < this.particles.length; i++) {
			this.particles[i].render(ctx);
		}
	},

	update: function(du) {
		for(var i = 0; i < this.particles.length;) {
			this.particles[i].update(du);
			if(this.particles[i].remove) {
				this.particles.splice(i, 1);
			} else {
				i++;
			}
		}
	},

	createParticles: function(x, y, xVel, yVel, colors) {
		var count = Math.floor(Math.random()*2);
		for(var i = 0; i < count; i++) {
			this.particles.push(new Particle({
				originX: x,
				originY: y,
				xVel: xVel,
				yVel: yVel,
				colorStyle: colors[Math.floor(Math.random()*colors.length)],
				sidelength: 2
			}));
		}
	}
}
