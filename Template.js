var Template = Shape.extend({

    constructor: function(ID) {
        this.base(ID, "Template");
        this.templateShapes = [];
    },
	
	reconstruct: function(obj) {
		this.base(obj);
		this.templateShapes = [];
		for (var i = 0; i < obj.templateShapes.length; i++) {
			var shape = this.parseToShape(obj.templateShapes[i])
            this.templateShapes.push(shape);
        }
	},
	
	addShape: function(shape) {
		this.templateShapes.push(shape);
	},
	
	parseToShape: function(obj) {
		var shape;
		if(obj.name === "Square") {
			shape = new Square(0);
		}
		if(obj.name === "Line") {
			shape = new Line(0);
		}
		if(obj.name === "Circle") {
			shape = new Circle(0);
		}
		if(obj.name === "Ellipse") {
			shape = new Ellipse(0);
		}
		if(obj.name === "Pen") {
			shape = new Pen(0);
		}
		if(obj.name === "Template") {
			shape = new Template(0);
		}
		if(obj.name === "Text") {
			shape = new Text(0);
		}
		shape.reconstruct(obj);
		return shape;
	},

    draw: function(canvas) {
        for(var i = 0; i < this.templateShapes.length; i++) {
			this.templateShapes[i].draw(canvas);
		}
    },
	
	startMove: function(point) {
		this.posOffset = point.subtract(this.pos);
		for(var i = 0; i < this.templateShapes.length; i++) {
			this.templateShapes[i].startMove(point);
		}
	},
	
	moveTo: function(point) {
		this.pos = point.subtract(this.posOffset);
        for(var i = 0; i < this.templateShapes.length; i++) {
			this.templateShapes[i].moveTo(point);
		}
    },
	
    contains: function(point) {
		for(var i = 0; i < this.templateShapes.length; i++) {
			if(this.templateShapes[i].contains(point)) {
				return true;
			}
		}
		return false;
    },

});