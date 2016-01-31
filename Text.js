var Text = Shape.extend({

    constructor: function(ID) {
        this.base(ID, "Text");
        console.log(global.textype);
        
       
    },

    draw: function(canvas) {
        //this.prepareDraw(canvas);

        canvas.fillText("g", 100, 150);
        //this.base(canvas);
    },

});