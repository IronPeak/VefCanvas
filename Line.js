var Line = Shape.extend ({

	constructor: function() {
		this.base("Line");
	},

	draw: function(canvas) {

		canvas.lineWidth = this.brush;
		canvas.strokeStyle = this.color;
		canvas.beginPath();
		canvas.moveTo(this.size.x, this.size.y);
		canvas.lineTo(this.pos.x, this.pos.y);
		canvas.stroke();
		this.base(canvas);
	},

	startDrawing:function(point) {
		this.size.x = this.pos.x;
		this.size.y = this.pos.y;
	},


	drawing:function(point) {
		this.size.x = point.x;
		this.size.y = point.y;
	},

	stopDrawing:function(point) {
		this.size.x = point.x;
		this.size.y = point.y;
	},
});