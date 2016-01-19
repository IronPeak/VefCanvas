var Shape = Base.extend({

	constructor:function(name) {
		this.name = name;
		this.pos = null;
		this.size = new Point(0,0);
		this.color = color;
		this.selected = false;
	},


	draw:function(canvas) {		
		if ( this.selected === true ) {
			// show selection
		}
	},

	startDrawing:function(point) {

	},

	drawing:function(point) {

	},

	stopDrawing:function(point) {

	},

	added: function(canvas) {

	},
});

var Line = Shape.extend ({

	constructor: function() {
		this.base("Line");
	},

	draw: function(canvas) {

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

var Circle = Shape.extend ({

	constructor: function() {
		this.base("Circle");
		
	},

	draw: function(canvas) {

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