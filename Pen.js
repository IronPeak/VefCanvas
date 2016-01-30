var Pen = Shape.extend({

    constructor: function(ID) {
        this.base(ID, "Pen");
        this.drawPoints = [];
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
    },
	
	reconstruct: function(obj) {
		this.base(obj);
		this.minX = obj.minX;
        this.maxX = obj.maxX;
        this.minY = obj.minY;
        this.maxY = obj.maxY;
		this.drawPoints = [];
		for (var i = 1; i < obj.drawPoints.length; i++) {
            this.drawPoints.push(new Point(obj.drawPoints[i].x, obj.drawPoints[i].y));
        }
	},

    draw: function(canvas) {
        this.prepareDraw(canvas);
        canvas.beginPath();
        canvas.moveTo(this.drawPoints[0], this.drawPoints[0]);
        for (var i = 1; i < this.drawPoints.length; i++) {
            var point = this.drawPoints[i];
            point = point.add(this.pos);
            canvas.lineTo(point.x, point.y);
        }
        canvas.stroke();
        this.base(canvas);
    },

    startDrawing: function(point) {
        this.pos = point;
        this.drawPoints.push(point.subtract(this.pos));
    },

    drawing: function(point) {
        this.drawPoints.push(point.subtract(this.pos));
        this.updateDiameters(point.subtract(this.pos));
    },

    stopDrawing: function(point) {
        this.drawPoints.push(point.subtract(this.pos));
        this.updateDiameters(point.subtract(this.pos));
    },

    updateDiameters: function(point) {
        this.minX = Math.min(point.x, this.minX);
        this.maxX = Math.max(point.x, this.maxX);
        this.minY = Math.min(point.y, this.minY);
        this.maxY = Math.max(point.y, this.maxY);
    },

    contains: function(point) {
        return this.minX <= point.subtract(this.pos).x && point.subtract(this.pos).x <= this.maxX && this.minY <= point.subtract(this.pos).y && point.subtract(this.pos).y <= this.maxY;
    },

});