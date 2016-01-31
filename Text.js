var Text = Shape.extend({

    constructor: function(ID) {
        this.base(ID, "Text");        
    },

    draw: function(canvas) {
        this.prepareDraw(canvas);
		canvas.fillText(this.text, this.pos.x, this.pos.y);
        this.base(canvas);
    },
	
	prepareDraw(canvas) {
		canvas.font = this.fontSize + "px " + this.font;
		canvas.fillStyle = this.brushColor;
	},
});