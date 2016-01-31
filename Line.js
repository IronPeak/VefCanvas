var Line = Shape.extend({

    constructor: function(ID) {
        this.base(ID, "Line");
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

    startMove: function(point) {
        this.posOffset = point.subtract(this.pos);
        this.sizeOffset = point.subtract(this.size);
    },

    moveTo: function(point) {
        this.pos = point.subtract(this.posOffset);
        this.size = point.subtract(this.sizeOffset);
    },

    setDiameters: function() {
        this.minX = Math.min(this.size.x, this.pos.x);
        this.maxX = Math.max(this.size.x, this.pos.x);
        this.minY = Math.min(this.size.y, this.pos.y);
        this.maxY = Math.max(this.size.y, this.pos.y);
    },

    contains: function(point) {
        this.setDiameters();
        return this.minX <= point.x && point.x <= this.maxX && this.minY <= point.y && point.y <= this.maxY;
    },

});