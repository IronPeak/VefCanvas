var Ellipse = Shape.extend ({

	constructor: function() {
		this.base("Ellipse");
	},

	draw: function(canvas) {	
		this.prepareDraw(canvas);
		
		canvas.beginPath();
		
		canvas.moveTo(this.pos.x, this.pos.y - this.size.y);
		
		canvas.bezierCurveTo(
			this.pos.x + this.size.x, this.pos.y - this.size.y,
			this.pos.x + this.size.x, this.pos.y + this.size.y,
			this.pos.x, this.pos.y + this.size.y
		);
		
		canvas.bezierCurveTo(
			this.pos.x - this.size.x, this.pos.y + this.size.y,
			this.pos.x - this.size.x, this.pos.y - this.size.y,
			this.pos.x, this.pos.y - this.size.y
		);
		
		canvas.stroke();
		if(this.fill) {
			canvas.fill();
		}
		this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x - this.pos.x;
		this.size.y = point.y - this.pos.y;
	},
	
	stopDrawing:function(point) {
		this.drawing(point);
	},
	
	contains: function(point) {
		var deltaX = Math.abs(point.x - this.pos.x);
		var deltaY = Math.abs(point.y - this.pos.y);
		return deltaX <= this.size.x && deltaY <= this.size.y;
	},

});