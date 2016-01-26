var Ellipse = Shape.extend ({

	constructor: function() {
		this.base("Ellipse");
		
	},

	draw: function(canvas) {	
		canvas.lineWidth = this.brush;
		canvas.strokeStyle = this.color;
	
		var centerX = this.pos.x + this.size.x / 2;
		var centerY = this.pos.y + this.size.y / 2;
	
		var diameterX = this.size.x;
		var diameterY = this.size.y;
		
		canvas.beginPath();
		
		canvas.moveTo(centerX, centerY - diameterY);
		
		canvas.bezierCurveTo(
			centerX + diameterX, centerY - diameterY,
			centerX + diameterX, centerY + diameterY,
			centerX, centerY + diameterY
		);
		
		canvas.bezierCurveTo(
			centerX - diameterX, centerY + diameterY,
			centerX - diameterX, centerY - diameterY,
			centerX, centerY - diameterY
		);
		
		canvas.stroke();
		this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x - this.pos.x;
		this.size.y = point.y - this.pos.y;
	},

});