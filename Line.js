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
    },

    startMove: function(point) {
        this.posOffset = point.subtract(this.pos);
        this.sizeOffset = point.subtract(this.size);
    },

    moveTo: function(point) {
        this.pos = point.subtract(this.posOffset);
        this.size = point.subtract(this.sizeOffset);
    },

    contains: function(point) {
        var minX = Math.min(this.size.x, this.pos.x);
        var maxX = Math.max(this.size.x, this.pos.x);
        var minY = Math.min(this.size.y, this.pos.y);
        var maxY = Math.max(this.size.y, this.pos.y);
        return minX <= point.x && point.x <= maxX && minY <= point.y && point.y <= maxY;
    },

});