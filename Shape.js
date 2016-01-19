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

		//console.log(this.size.x, this.size.y);
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

	added: function(canvas) {

		
	},	



});

