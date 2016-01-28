var Square = Shape.extend({

	constructor: function() {
		this.base("Square");
	},

	draw: function(canvas) {
		this.prepareDraw(canvas);
		canvas.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

		if(this.fill) {

			canvas.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}
		this.base(canvas);

		

	},

	drawing:function(point) {
		
		this.size.x = point.x - this.pos.x;
		this.size.y = point.y - this.pos.y;

	},

	added: function(canvas) {
		if(this.size.x < 0) {
			this.pos.x += this.size.x;
			this.size.x = Math.abs(this.size.x);
		}

		if(this.size.y < 0) {
			this.pos.y += this.size.y;
			this.size.y = Math.abs(this.size.y);
		}


	},	

	moveTo: function(point) {
		var x = Math.abs(this.pos.x + this.size.x) / 2;
		var y = Math.abs(this.pos.y + this.size.y) / 2;
		var middle = new Point(x, y);
		this.pos = this.pos.add(point.subtract(middle));
			
	},

	contains: function(point) {
		
		return this.pos.x <= point.x && point.x <= (this.pos.x + this.size.x)
				&& this.pos.y <= point.y && point.y <= (this.pos.y + this.size.y);


	},
	
});

