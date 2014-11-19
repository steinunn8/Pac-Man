var backgroundManager = {
	colors: ["#004B91", "#006B04", "#6B0C00"],
	currentColor: "#004B91",
	timer: 0,
	duration: 10,
	fastDuration: 1,
	resetDuration: 10,
	burstColor: "#FFFFFF",
	burstDuration: 0,
	burstMaxDuration: 0,

	update: function(du) {
		this.timer += du;
		this.burstDuration -= du;
		this.duration = entityManager.isFrightenedOn() ? 
						this.fastDuration : this.resetDuration;
		var index = (this.timer / (NOMINAL_UPDATE_INTERVAL * this.duration)) % this.colors.length;
		this.currentColor = this.mixColors(this.colors[Math.floor(index)], 
										   this.colors[Math.ceil(index) % this.colors.length],
										   index % 1);

		if (this.burstDuration > 0) {
			this.currentColor = this.mixColors(this.currentColor,
											   this.burstColor,
											   this.burstDuration / this.burstMaxDuration);
		}
	},

	burst: function(duration, color) {
		this.burstColor = color;
		this.burstDuration = duration * SECS_TO_NOMINALS;
		this.burstMaxDuration = duration * SECS_TO_NOMINALS;
	},

	render: function(ctx) {
		util.fillBox(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, this.currentColor);
	},

	mixColors: function(color1, color2, ratio) {
		var rgb1 = this.getRGBValues(color1);
		var rgb2 = this.getRGBValues(color2);
		var newRgb = {
			r: Math.floor((1 - ratio)*rgb1.r + ratio*rgb2.r),
			g: Math.floor((1 - ratio)*rgb1.g + ratio*rgb2.g),
			b: Math.floor((1 - ratio)*rgb1.b + ratio*rgb2.b)
		};

		return "#" + this.getHexString(newRgb.r) 
				   + this.getHexString(newRgb.g) 
				   + this.getHexString(newRgb.b);
	},

	getRGBValues: function(string) {
		return {
			r: parseInt(string.substring(1, 3), 16),
			g: parseInt(string.substring(3, 5), 16),
			b: parseInt(string.substring(5, 7), 16)
		};
	},

	getHexString: function(i) {
		var s = "00" + i.toString(16);
		return s.substr(s.length-2, 2);
	}
}