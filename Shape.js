var selectionOffset = 5;

var Shape = Base.extend({

    constructor: function(ID, name) {
        this.ID = ID;
        this.name = name;
        this.pos = new Point(0, 0);
        this.size = new Point(0, 0);
        this.brushColor = null;
        this.fillColor = null;
        this.fill = false;
        this.active = true;
		this.selected = false;
    },

    reconstruct: function(obj) {
        this.active = obj.active;
        this.brushColor = obj.brushColor;
        this.fill = obj.fill;
        this.fillColor = obj.fillColor;
        this.brush = obj.brush;
        this.fontSize = obj.fontSize;
        this.font = obj.font;
        this.pos = new Point(obj.pos.x, obj.pos.y);
        this.size = new Point(obj.size.x, obj.size.y);
		this.selected = false;
    },

    draw: function(canvas) {

    },

    startDrawing: function(point) {

    },

    drawing: function(point) {

    },

    stopDrawing: function(point) {

    },

    added: function(canvas) {

    },

    contains: function(point) {
        return false;
    },

    startMove: function(point) {
        this.posOffset = point.subtract(this.pos);
    },

    moveTo: function(point) {
        this.pos = point.subtract(this.posOffset);
    },

    prepareDraw: function(canvas) {
        canvas.lineWidth = this.brush;
        canvas.strokeStyle = this.brushColor;
        canvas.fillStyle = this.fillColor;
		if(this.selected === false) {
			canvas.setLineDash([0]);
		} else {
			canvas.setLineDash([6]);
		}
    }
});