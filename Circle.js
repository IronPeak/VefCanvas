var Circle = Shape.extend ({

	constructor: function() {
		this.base("Circle");
		this.centerX = 0;
		this.centerY = 0;
		this.radiusX = 0;
		this.radiusY = 0;
		this.radius = 0;
		this.endPoint = new Point(0,0);
	},

	draw: function(canvas) {
		canvas.lineWidth = this.brush;
		canvas.strokeStyle = this.color;
		
		canvas.beginPath();
		canvas.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
		canvas.stroke();
		this.base(canvas);
	},

	drawing:function(point) {
		this.radiusX = Math.abs(this.pos.x - point.x) / 2;
		this.radiusY = Math.abs(this.pos.y - point.y) / 2;
		this.radius = Math.max(this.radiusX, this.radiusY);
		this.size.x = (point.x - this.pos.x) * 2;
		this.size.y = (point.y - this.pos.y) * 2;
		this.endPoint = point;
		this.centerX = (this.pos.x + this.endPoint.x) / 2;
		this.centerY = (this.pos.y + this.endPoint.y) / 2;
	},

	stopDrawing:function(point) {
		this.radiusX = Math.abs(this.pos.x - point.x) / 2;
		this.radiusY = Math.abs(this.pos.y - point.y) / 2;
		this.radius = Math.max(this.radiusX, this.radiusY);
		this.endPoint = point;
		this.centerX = (this.pos.x + this.endPoint.x) / 2;
		this.centerY = (this.pos.y + this.endPoint.y) / 2;
	}

});