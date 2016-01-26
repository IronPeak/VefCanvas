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
