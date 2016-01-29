var Line = Shape.extend({

    constructor: function() {
        this.base("Line");
    },

    draw: function(canvas) {
        this.prepareDraw(canvas);
        canvas.beginPath();
        canvas.moveTo(this.size.x, this.size.y);
        canvas.lineTo(this.pos.x, this.pos.y);
        canvas.stroke();
        this.base(canvas);
    },

    startDrawing: function(point) {
        this.size.x = this.pos.x;
        this.size.y = this.pos.y;
    },

    drawing: function(point) {
        this.size.x = point.x;
        this.size.y = point.y;
    },

    stopDrawing: function(point) {
        this.size.x = point.x;
        this.size.y = point.y;
        this.setDiameters();
    },

    moveTo: function(point) {
        var x = (this.pos.x + this.size.x) / 2;
        var y = (this.pos.y + this.size.y) / 2;
        var lineMiddle = new Point(x, y);
        this.pos = this.pos.add(point.subtract(lineMiddle));
        this.size = this.size.add(point.subtract(lineMiddle));
        this.setDiameters();
    },

    setDiameters: function() {
        this.minX = Math.min(this.size.x, this.pos.x);
        this.maxX = Math.max(this.size.x, this.pos.x);
        this.minY = Math.min(this.size.y, this.pos.y);
        this.maxY = Math.max(this.size.y, this.pos.y);
    },

    contains: function(point) {
        return this.minX <= point.x && point.x <= this.maxX && this.minY <= point.y && point.y <= this.maxY;
    },

});