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
                shapeID: shape.ID,
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
	
	self.writingStart = function(e) {
		var startPos = self.getEventPoint(e);
        var shape = self.shapeFactory();
        shape.pos = startPos;
        shape.brushColor = self.brushColor;
        shape.fillColor = self.fillColor;
        shape.fill = self.fill;
        shape.brush = self.brush;
		shape.text = "";
		shape.fontSize = self.fontSize;
		shape.font = self.font;
		
		var input = prompt("Please enter the text", "Sample Text");
		if(input == null) {
			return;
		}
		shape.text = input;
		
		self.shapes.push(shape);
        self.edits.push({
            type: "Created",
            shapeID: shape.ID,
            active: true
        });
        shape.added(self.canvasContext);
		
		self.redraw();
	}

    self.movingStart = function(e, object) {
		var startMove = self.getEventPoint(e);
        var startPos = object.pos;
        var startSize = object.size;

		object.startMove(startMove);
		
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
                shapeID: object.ID,
                prevX: startPos.x,
				prevY: startPos.y,
                posX: object.pos.x,
				posY: object.pos.y,
                active: true
            });
            self.canvas.off({
                mousemove: move,
                mouseup: moveStop
            });

            self.redraw();
        }

        self.canvas.on({
            mousemove: move,
            mouseup: moveStop
        });
    }

    self.mousedown = function(e) {
		//Check is text tool is selected
        if($('#tools').val() === "Text") {
            self.writingStart(e);
        }
        else if (self.shapeFactory != null) {
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
            self.findShape(edit.shapeID).active = false;
        }
        if (edit.type == "Moved") {
            edit.active = false;
			var shape = self.findShape(edit.shapeID);
			shape.startMove(shape.pos);
            shape.moveTo(new Point(edit.prevX, edit.prevY));
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
            self.findShape(edit.shapeID).active = true;
        }
        if (edit.type == "Moved") {
            edit.active = true;
			var shape = self.findShape(edit.shapeID);
			shape.startMove(shape.pos);
            shape.moveTo(new Point(edit.posX, edit.posY));
        }
    }
	
	self.findShape = function(shapeID) {
		for(var i = 0; i < self.shapes.length; i++) {
			if(self.shapes[i].ID == shapeID) {
				return self.shapes[i];
			}
		}
	}

    self.nextb = function() {
        self.newPage[index] = {
            shapes: self.shapes,
            edits: self.edits
        };
        index++;
        if (self.newPage[index] === undefined) {
            self.newBoard();
			return;
        }
        self.shapes = self.newPage[index].shapes;
        self.edits = self.newPage[index].edits;
        self.redraw();
    }
	
	self.newBoard = function() {
		self.newPage[index] = {
            shapes: self.shapes,
            edits: self.edits
        };
		index = self.newPage.length;
		self.newPage[index] = {
            shapes: [],
            edits: []
        };
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
	
	self.getprojectlist = function() {
        var param = {
            "user": "helgie14",
            "template": false
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetList",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
                var dropdown = document.getElementById("projectlist");
				var length = dropdown.options.length;
				for(var i = length; i >= 0; i--) {
					dropdown.remove(i);
				}
				for(var i = 0; i < data.length; i++) {
					var option = document.createElement("option");
					option.text = data[i].WhiteboardTitle;
					option.value = data[i].ID;
					dropdown.add(option);
				}
            },
            error: function(xhr, err) {

            }
        });
	}

    self.saveproject = function(name) {
        var stringifiedArray = JSON.stringify({
            shapes: self.shapes,
            edits: self.edits
        });
        var param = {
            "user": "helgie14",
            "name": name,
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
                self.getprojectlist();
				console.log("Saved");
            },
            error: function(xhr, err) {

            }
        });
    }

    self.loadproject = function(id) {
        var param = {
            "id": id,
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
				var shapeObjs = JSON.parse(data.WhiteboardContents).shapes;
				var editObjs = JSON.parse(data.WhiteboardContents).edits;
				self.newBoard();
				for(var i = 0; i < shapeObjs.length; i++) {
					self.parseToShape(shapeObjs[i]);
				}
				self.edits = editObjs;
				console.log(self.edits);
				console.log(self.shapes);
				self.redraw();
            },
            error: function(xhr, err) {

            }
        });
    }
	
	self.gettemplatelist = function() {
        var param = {
            "user": "helgie14",
            "template": true
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetList",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
                var dropdown = document.getElementById("templatelist");
				var length = dropdown.options.length;
				for(var i = length; i >= 0; i--) {
					dropdown.remove(i);
				}
				for(var i = 0; i < data.length; i++) {
					var option = document.createElement("option");
					option.text = data[i].WhiteboardTitle;
					option.value = data[i].ID;
					dropdown.add(option);
				}
            },
            error: function(xhr, err) {

            }
        });
	}

    self.savetemplate = function(name) {
		var template = new Template(0);
		
		for(var i = 0; i < self.shapes.length; i++) {
			if(self.shapes[i].active === true) {
			    template.addShape(self.shapes[i]);
			}
		}
		self.shapes = [];
		self.shapes.push(template);
		self.edits = [];
		self.edits.push({
            type: "Created",
            shapeID: template.ID,
            active: true
        });
		
        var stringifiedArray = JSON.stringify(template);
		
        var param = {
            "user": "helgie14",
            "name": name,
            "content": stringifiedArray,
            "template": true
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/save",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
                self.gettemplatelist();
				console.log("Saved Template");
            },
            error: function(xhr, err) {

            }
        });
    }

    self.loadtemplate = function(id) {
        var param = {
            "id": id,
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
            data: param,
            dataType: "jsonp",
            crossDomain: true,
            success: function(data) {
				console.log(data);
				var shape = self.parseToShape(JSON.parse(data.WhiteboardContents));
				self.edits.push({
					type: "Created",
					shapeID: shape.ID,
					active: true
				});
				console.log("loaded template");
				self.redraw();
            },
            error: function(xhr, err) {

            }
        });
    }
	
	self.parseToShape = function(obj) {
		var shape;
		if(obj.name === "Square") {
			shape = new Square(obj.ID);
		}
		if(obj.name === "Line") {
			shape = new Line(obj.ID);
		}
		if(obj.name === "Circle") {
			shape = new Circle(obj.ID);
		}
		if(obj.name === "Ellipse") {
			shape = new Ellipse(obj.ID);
		}
		if(obj.name === "Pen") {
			shape = new Pen(obj.ID);
		}
		if(obj.name === "Template") {
			shape = new Template(obj.ID);
		}
		if(obj.name === "Text") {
			shape = new Text(obj.ID);
		}
		shape.reconstruct(obj);
		self.shapes.push(shape);
		self.shapeID++;
		return shape;
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

    self.setFontFamily = function(font) {
        self.font = font;

    }

    self.setFontSize = function(fontSize) {
        self.fontSize = fontSize;
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
		self.shapeID = 0;

        // Set defaults
        self.brushColor = $('input[id=brushcolor]').val();
        self.fillColor = $('input[id=fillcolor]').val();
        self.fill = false;
        self.brush = $('#brushsize').val();
        self.index = index = 0;
        self.fontSize = "16";
        self.font = "Arial";
        self.text = " ";
    }   
	
	self.getprojectlist();
	self.gettemplatelist();
    self.init();
}
var app = null;
$(function() {
    WireEvents();
    app = new App('#canvas');
	$('#tools').trigger("change");
	function WireEvents() {
		$('#tools').change(function(e) {
			if($(this).val() == "Circle") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/circle.jpg");
					return new Circle(app.shapeID);
				};
			}
			else if($(this).val() == "Ellipse") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/ellipse.jpg");
					return new Ellipse(app.shapeID);
				};
			}
			else if($(this).val() == "Eraser") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/eraser.jpg");
					return new Eraser(app.shapeID);
				};
			}
			else if($(this).val() == "Line") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/line.jpg");
					return new Line(app.shapeID);
				};
			}
			else if($(this).val() == "Pen") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/pen.jpg");
					return new Pen(app.shapeID);
				};
			}
			else if($(this).val() == "Square") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/square.jpg");
					return new Square(app.shapeID);
				};
			}
			else if($(this).val() == "Text") {
				app.shapeFactory = function() {
					app.shapeID += 1;
					$("#toolselectimage").attr("src", "images/text.jpg");
					return new Text(app.shapeID);
				};
			}
			else if($(this).val() == "Select") {
				app.shapeFactory = null;
			}
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
			var name = $("#projectname").val();
			app.saveproject(name);
		});
		$('#loadbutton').click(function() {
			var id = $("#projectlist option:selected").val();
			app.loadproject(id);
		});
		
		$('#savetemplatebutton').click(function() {
			var name = $("#templatename").val();
			app.savetemplate(name);
		});
		$('#loadtemplatebutton').click(function() {
			var id = $("#templatelist option:selected").val();
			app.loadtemplate(id);
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
        $('#fontSize').change(function() {
            app.setFontSize($(this).val());
        });
        $('#fontfamily').change(function() {
            app.setFontFamily($(this).val());
        });
	}
});