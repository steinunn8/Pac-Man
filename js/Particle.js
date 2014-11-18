function Particle(descr) {
	for (var property in descr) {
		this[property] = descr[property];
	}
	this.cx = this.originX + Math.random()*2-1;
	this.cy = this.originY + Math.random()*2-1;
	if (this.xVel === undefined) {
		this.xVel = this.cx - this.originX > 0 ? 1 : -1;
	}
	if (this.yVel === undefined) {
		this.yVel = this.cy - this.originY > 0 ? 1 : -1;
	}
	this.angle = Math.random()*2*Math.PI;
	this.angleVel = Math.random()*0.1-0.05;
	this.lifetime = 40;
	this.remove = false;
}

Particle.prototype.update = function(du) {
	this.lifetime -= du;
	if(this.lifetime <= 0) {
		this.remove = true;
	}
	this.xVel -= this.xVel * du * 0.1;
	this.yVel -= this.yVel * du * 0.1;

	this.cx += this.xVel * du;
	this.cy += this.yVel * du;
	this.angle += this.angleVel * du;
}

Particle.prototype.render = function(ctx) {
	ctx.translate(this.cx, this.cy);
	ctx.rotate(this.angle);
	util.fillBox(ctx, -this.sidelength/2,
				 -this.sidelength/2,
				 this.sidelength,
				 this.sidelength,
				 this.colorStyle, 0.2);
	ctx.rotate(-this.angle);
	ctx.translate(-this.cx, -this.cy);
}