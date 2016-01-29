function App(canvasSelector) {
    var self = this;
    self.getEventPoint = function(e) {
        return new Point(e.pageX - self.canvasOffset.x, e.pageY - self.canvasOffset.y);
    }

    self.drawingStart = function(e) {
        var startPos = self.getEventPoint(e);
        var shape = self.shapeFactory();
        shape.pos = startPos;
        shape.brushColor = self.brushColor;
        shape.fillColor = self.fillColor;
        shape.fill = self.fill;
        shape.brush = self.brush;

        shape.startDrawing(startPos, self.canvasContext);
        startPos.log('drawing start');

        var drawing = function(e) {
            var pos = self.getEventPoint(e);

            shape.drawing(pos, self.canvasContext);

            self.redraw();
            shape.draw(self.canvasContext);
        }

        var drawingStop = function(e) {
            if (self.shapes === undefined) {
                self.shapes = [];
            }
            var pos = self.getEventPoint(e);

            shape.stopDrawing(pos, self.canvasContext);

            pos.log('drawing stop')

            self.shapes.push(shape);
            self.edits.push({
                type: "Created",
                shape: shape,
                active: true
            });
            shape.added(self.canvasContext);

            // Remove drawing and drawingStop functions from the mouse events
            self.canvas.off({
                mousemove: drawing,
                mouseup: drawingStop
            });

            self.redraw();
        }

        // Add drawing and drawingStop functions to the mousemove and mouseup events
        self.canvas.on({
            mousemove: drawing,
            mouseup: drawingStop
        });
    }

    self.movingStart = function(e, object) {
        var startPos = self.getEventPoint(e);
        var startSize = object.size;

        var move = function(e) {
            var pos = self.getEventPoint(e);

            object.moveTo(pos);

            self.redraw();
        }

        var moveStop = function(e) {
            var pos = self.getEventPoint(e);

            object.moveTo(pos);

            self.edits.push({
                type: "Moved",
                shape: object,
                prevPos: startPos,
                prevSize: startSize,
                pos: object.pos,
                size: object.size,
                active: true
            });
            // Remove drawing and drawingStop functions from the mouse events
            self.canvas.off({
                mousemove: move,
                mouseup: moveStop
            });

            self.redraw();
        }

        // Add drawing and drawingStop functions to the mousemove and mouseup events
        self.canvas.on({
            mousemove: move,
            mouseup: moveStop
        });
    }

    self.mousedown = function(e) {
        if (self.shapeFactory != null) {
            self.drawingStart(e);
        }
        else {
            for (var i = 0; i < self.shapes.length; i++) {
                if (self.shapes[i].active) {
                    if (self.shapes[i].contains(self.getEventPoint(e))) {
                        self.movingStart(e, self.shapes[i]);
                        break;
                    }
                }
            }
        }

        self.redraw();
    }

    self.redraw = function() {
        self.canvasContext.clearRect(0, 0, self.canvasContext.canvas.width, self.canvasContext.canvas.height);
        if (self.shapes !== undefined) {
            for (var i = 0; i < self.shapes.length; i++) {
                if (self.shapes[i].active) {
                    self.shapes[i].draw(self.canvasContext);
                }
            }
        }

    }

    self.clear = function() {
        self.shapes = [];
        self.edits = [];
        self.redraw();
    }

    self.undo = function() {
        if (!self.edits.length == 0) {
            for (var i = this.edits.length - 1; i >= 0; i--) {
                if (this.edits[i].active == true) {
                    this.undoEdit(this.edits[i]);
                    self.redraw();
                    return;
                }
            }
        }
    }

    self.undoEdit = function(edit) {
        if (edit.type == "Created") {
            edit.active = false;
            edit.shape.active = false;
        }
        if (edit.type == "Moved") {
            edit.active = false;
            edit.shape.moveTo(edit.prevPos);
        }
    }

    self.redo = function() {
        if (!self.edits.length == 0) {
            for (var i = 0; i < this.edits.length; i++) {
                if (this.edits[i].active == false) {
                    this.redoEdit(this.edits[i]);
                    self.redraw();
                    return;
                }
            }
        }
    }

    self.redoEdit = function(edit) {
        if (edit.type == "Created") {
            edit.active = true;
            edit.shape.active = true;
        }
        if (edit.type == "Moved") {
            edit.active = true;
            edit.shape.moveTo(edit.pos);
        }
    }

    self.nextb = function() {
        self.newPage[index] = {
            shapes: self.shapes,
            edits: self.edits
        };
        index++;
        if (self.newPage[index] === undefined) {
            self.newPage[index] = {
                shapes: [],
                edits: []
            };
        }
        self.shapes = self.newPage[index].shapes;
        self.edits = self.newPage[index].edits;
        self.redraw();
    }

    self.prevb = function() {
        if (index === 0) {
			
		}
        else {
            self.newPage[index] = {
                shapes: self.shapes,
                edits: self.edits
            };
            index--;
            self.shapes = self.newPage[index].shapes;
            self.edits = self.newPage[index].edits;
            self.redraw();
        }
    }

    self.saveproject = function() {

        var stringifiedArray = JSON.stringify({
            shapes: self.shapes,
            edits: self.edits
        });
        var param = {
            "user": "helgie14",
            "name": "mydrawing",
            "content": stringifiedArray,
            "template": false
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/save",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
                console.log("Success Save");
            },
            error: function(xhr, err) {

            }
        });
    }

    self.loadproject = function() {
    }

    self.setBrushColor = function(color) {
        self.brushColor = color;
    }

    self.setFillColor = function(color) {
        self.fillColor = color;
    }

    self.setFillOption = function(checked) {
        self.fill = checked;

    }

    self.setBrush = function(brush) {
        self.brush = brush;
    }

    self.init = function() {
        // Initialize App	
        self.canvas = $(canvasSelector);
        self.canvasOffset = new Point(self.canvas.offset().left, self.canvas.offset().top);
        self.canvas.on({
            mousedown: self.mousedown
        });
        self.shapeFactory = null;
        self.canvasContext = canvas.getContext("2d");
        self.shapes = new Array();
        self.newPage = new Array();
        self.edits = new Array();

        // Set defaults
        self.brushColor = $('input[id=brushcolor]').val();
        self.fillColor = $('input[id=fillcolor]').val();
        self.fill = false;
        self.brush = $('input[id=brushsize]').val();;
        self.index = index = 0;
    }

    self.init();
}
var app = null;
$(function() {
    // Wire up events
    app = new App('#canvas');
    $('#squarebutton').click(function() {
        app.shapeFactory = function() {
            return new Square();
        };
    });
    $('#linebutton').click(function() {
        app.shapeFactory = function() {
            return new Line();
        };
    });
    $('#circlebutton').click(function() {
        app.shapeFactory = function() {
            return new Circle();
        };
    });
    $('#ellipsebutton').click(function() {
        app.shapeFactory = function() {
            return new Ellipse();
        };
    });
    $('#penbutton').click(function() {
        app.shapeFactory = function() {
            return new Pen();
        };
    });
    $('#selectbutton').click(function() {
        app.shapeFactory = null;
    });
    $('#clearbutton').click(function() {
        app.clear()
    });
    $('#undobutton').click(function() {
        app.undo()
    });
    $('#redobutton').click(function() {
        app.redo()
    });

    $('#nextbutton').click(function() {
        app.nextb()
    });
    $('#prevbutton').click(function() {
        app.prevb()
    });

    $('#savebutton').click(function() {
        app.saveproject()
    });
    $('#loadbutton').click(function() {
        app.loadproject()
    });

    $('#brushcolor').change(function() {
        app.setBrushColor($(this).val())
    });
    $('#fillcolor').change(function() {
        app.setFillColor($(this).val())
    });
    $('#fillshapes').click(function() {
        app.setFillOption(this.checked)
    });
    $('#brushsize').change(function() {
        app.setBrush($(this).val())
    });
});