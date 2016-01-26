var Circle = Shape.extend ({

	constructor: function() {
		this.base("Circle");
		
	},

	draw: function(canvas) {
		canvas.lineWidth = this.brush;
		canvas.strokeStyle = this.color;
		canvas.beginPath();
		if(this.size.x < 0) {
			this.size.x = Math.abs(this.size.x);

		}
		if(this.size.y < 0) {
			this.size.y = Math.abs(this.size.y);

		}
		canvas.arc(this.pos.x, this.pos.y, this.size.x, 0, 2*Math.PI);
		canvas.stroke();
		this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x - this.pos.x;
		this.size.y = point.y - this.pos.y;
	},

});