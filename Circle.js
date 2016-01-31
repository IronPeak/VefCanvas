var Circle = Shape.extend({

    constructor: function(ID) {
        this.base(ID, "Circle");
        this.radius = 0;
    },

    reconstruct: function(obj) {
        this.base(obj);
        this.radius = obj.radius;
    },

    draw: function(canvas) {
        this.prepareDraw(canvas);
        canvas.beginPath();
        canvas.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvas.stroke();
        if (this.fill) {
            canvas.fill();
        }
        this.base(canvas);
    },

    drawing: function(point) {
        this.size.x = Math.abs(point.x - this.pos.x);
        this.size.y = Math.abs(point.y - this.pos.y);

        var x = this.size.x;
        var y = this.size.y;
        this.radius = Math.sqrt(x * x + y * y);
    },

    stopDrawing: function(point) {
        this.drawing(point);
    },

    contains: function(point) {
        var deltaX = point.x - this.pos.x;
        var deltaY = point.y - this.pos.y;
        var sqrDistance = deltaX * deltaX + deltaY * deltaY;
        return sqrDistance < this.radius * this.radius;
    },

});