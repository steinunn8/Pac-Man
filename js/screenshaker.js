var screenshaker = {
	xOffset: 0,
	yOffset: 0,
	velX: 0,
	velY: 0,
	drag: 0.1,
	elasticity: 1,
	rotationTimer: 0,
	rotation: 0,

	update: function(du) {
		this.rotation = this.rotationTimer;
		this.rotationTimer -= du * 0.25;

		if (this.rotationTimer < 0) {
			this.rotationTimer = 0;
		}

		this.velX -= this.velX * this.drag * this.elasticity;
		this.velY -= this.velY * this.drag * this.elasticity;

		this.velX -= this.xOffset * this.elasticity;
		this.velY -= this.yOffset * this.elasticity;

		this.xOffset += this.velX;
		this.yOffset += this.velY;
	},

	render: function(ctx) {
		ctx.save();
		this.rotate(ctx, this.rotation);
		ctx.translate(this.xOffset, this.yOffset);
	},

	rotate: function(ctx, rotation) {
		ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
		ctx.rotate(this.rotation);
		ctx.translate(-ctx.canvas.width/2, -ctx.canvas.height/2);
	},

	fixTranslate: function(ctx) {
		ctx.restore();
	},

	shake: function(power) {
		this.velX = power*(Math.random()*2-1);
		this.velY = power*(Math.random()*2-1);
	},

	rotateScreen: function() {
		this.rotationTimer = Math.PI * 2;
	}
}
