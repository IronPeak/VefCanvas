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
        if (input == null) {
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

    self.movingStart = function(e, objects) {
        var startMove = self.getEventPoint(e);

		if(objects.length === 0) {
			for(var i = 0; i < self.shapes.length; i++) {
				if(self.shapes[i].contains(startMove) && self.shapes[i].active) {
					self.shapes[i].selected = true;
					objects.push(self.shapes[i]);
					break;
				}
			}
		}
		
		var edit = {
			type: "Moved",
			info: [],
			active: true
		}
		
		for(var i = 0; i < objects.length; i++) {
			edit.info.push({
				shapeID: objects[i].ID,
				prevX: objects[i].pos.x,
				prevY: objects[i].pos.y
			});
			objects[i].startMove(startMove);
		}

        var move = function(e) {
            var pos = self.getEventPoint(e);

			for(var i = 0; i < objects.length; i++) {
				objects[i].moveTo(pos);
			}

            self.redraw();
        }

        var moveStop = function(e) {
            var pos = self.getEventPoint(e);

            for(var i = 0; i < objects.length; i++) {
				objects[i].moveTo(pos);
			}
			
			for(var i = 0; i < objects.length; i++) {
				edit.info[i].posX = objects[i].pos.x;
				edit.info[i].posY = objects[i].pos.y;
			}
			
            self.edits.push(edit);
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
	
	self.selectObject = function(e, object) {
        object.selected = !object.selected;
        self.redraw();
    }

    self.mousedown = function(e) {
        //Check is text tool is selected
        if ($('#tools').val() === "Text") {
            self.writingStart(e);
        } else if (self.shapeFactory != null) {
            self.drawingStart(e);
        } else if($('#tools').val() === "Select"){
            for (var i = 0; i < self.shapes.length; i++) {
                if (self.shapes[i].active) {
                    if (self.shapes[i].contains(self.getEventPoint(e))) {
                        self.selectObject(e, self.shapes[i]);
                        break;
                    }
                }
            }
        } else if($('#tools').val() === "Move"){
			self.movingStart(e, self.getSelected());
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
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.startMove(shape.pos);
				shape.moveTo(new Point(info.prevX, info.prevY));
			}
        }
		if (edit.type == "SetBrush") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.brush = info.prevBrush;
			}
		}
		if (edit.type == "SetBrushColor") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.brushColor = info.prevBrushColor;
			}
		}
		if (edit.type == "SetFillColor") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.fillColor = info.prevFillColor;
			}
		}
		if (edit.type == "SetFillOption") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.fill = info.prevFill;
			}
		}
		if (edit.type == "SetFont") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.font = info.prevFont;
			}
		}
		if (edit.type == "SetFontSize") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.fontSize = info.prevFontSize;
			}
		}
		if (edit.type == "Deleted") {
			edit.active = false;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.active = true;
			}
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
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.startMove(shape.pos);
				shape.moveTo(new Point(info.posX, info.posY));
			}
        }
		if (edit.type == "SetBrush") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.brush = info.brush;
			}
		}
		if (edit.type == "SetBrushColor") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.brushColor = info.brushColor;
			}
		}
		if (edit.type == "SetFillColor") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.fillColor = info.fillColor;
			}
		}
		if (edit.type == "SetFillOption") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.fill = info.fill;
			}
		}
		if (edit.type == "SetFont") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.font = info.font;
			}
		}
		if (edit.type == "SetFontSize") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.fontSize = info.fontSize;
			}
		}
		if (edit.type == "Deleted") {
			edit.active = true;
			for(var i = 0; i < edit.info.length; i++) {
				var info = edit.info[i];
				var shape = self.findShape(info.shapeID);
				shape.active = false;
			}
		}
    }

    self.findShape = function(shapeID) {
        for (var i = 0; i < self.shapes.length; i++) {
            if (self.shapes[i].ID == shapeID) {
                return self.shapes[i];
            }
        }
    }

    self.nextb = function() {
        console.log("NextB");
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
        self.setPageNumber(index + 1);
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
        self.setPageNumber(index + 1);
        self.redraw();
    }

    self.prevb = function() {
        if (index === 0) {

        } else {
            self.newPage[index] = {
                shapes: self.shapes,
                edits: self.edits
            };
            index--;
            self.shapes = self.newPage[index].shapes;
            self.edits = self.newPage[index].edits;
            self.setPageNumber(index + 1);
            self.redraw();
        }
    }

    self.getprojectlist = function() {
        var param = {
            "user": "hrafnh14",
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
                for (var i = length; i >= 0; i--) {
                    dropdown.remove(i);
                }
                for (var i = 0; i < data.length; i++) {
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
		if(name === null || name === "") {
			return;
		}
		if(self.shapes.length === 0 && self.edits.length === 0) {
			return;
		}
        var stringifiedArray = JSON.stringify({
            shapes: self.shapes,
            edits: self.edits
        });
        var param = {
            "user": "hrafnh14",
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
                for (var i = 0; i < shapeObjs.length; i++) {
                    self.parseToShape(shapeObjs[i]);
                }
                self.edits = editObjs;
                self.redraw();
            },
            error: function(xhr, err) {

            }
        });
    }

    self.gettemplatelist = function() {
        var param = {
            "user": "hrafnh14",
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
                for (var i = length; i >= 0; i--) {
                    dropdown.remove(i);
                }
                for (var i = 0; i < data.length; i++) {
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
		if(name === null || name === "") {
			return;
		}
		if(self.shapes.length === 0 && self.edits.length === 0) {
			return;
		}
		
        var template = new Template(0);

        for (var i = 0; i < self.shapes.length; i++) {
            if (self.shapes[i].active === true) {
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
            "user": "hrafnh14",
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
        if (obj.name === "Square") {
            shape = new Square(obj.ID);
        }
        if (obj.name === "Line") {
            shape = new Line(obj.ID);
        }
        if (obj.name === "Circle") {
            shape = new Circle(obj.ID);
        }
        if (obj.name === "Ellipse") {
            shape = new Ellipse(obj.ID);
        }
        if (obj.name === "Pen") {
            shape = new Pen(obj.ID);
        }
        if (obj.name === "Template") {
            shape = new Template(obj.ID);
        }
        if (obj.name === "Text") {
            shape = new Text(obj.ID);
        }
        shape.reconstruct(obj);
        self.shapes.push(shape);
        self.shapeID++;
        return shape;
    }
	
	self.getSelected = function() {
		var selected = [];
		for(var i = 0; i < self.shapes.length; i++) {
			if(self.shapes[i].selected === true && self.shapes[i].active === true) {
				selected.push(self.shapes[i]);
			}
		}
		return selected;
	}
	
	self.clearSelection = function() {
		for(var i = 0; i < self.shapes.length; i++) {
			self.shapes[i].selected = false;
		}
		self.redraw();
	}

    self.setBrushColor = function(color) {
        self.brushColor = color;
		var selected = self.getSelected();
		var edit = {
			type: "SetBrushColor",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
				prevBrushColor: selected[i].brushColor,
				brushColor: color
			});
			selected[i].brushColor = color;
		}
		self.edits.push(edit);
		self.redraw();
    }

    self.setFillColor = function(color) {
        self.fillColor = color;
		var selected = self.getSelected();
		var edit = {
			type: "SetFillColor",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
				prevFillColor: selected[i].fillColor,
				fillColor: color
			});
			selected[i].fillColor = color;
		}
		self.edits.push(edit);
		self.redraw();
    }

    self.setFillOption = function(checked) {
        self.fill = checked;
		var selected = self.getSelected();
		var edit = {
			type: "SetFillOption",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
				prevFill: selected[i].fill,
				fill: checked
			});
			selected[i].fill = checked;
		}
		self.edits.push(edit);
		self.redraw();
    }
	
    self.setBrush = function(brush) {
        self.brush = brush;
		var selected = self.getSelected();
		var edit = {
			type: "SetBrush",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
				prevBrush: selected[i].brush,
				brush: brush
			});
			selected[i].brush = brush;
		}
		self.edits.push(edit);
		self.redraw();
    }

    self.setFontFamily = function(font) {
        self.font = font;
		var selected = self.getSelected();
		var edit = {
			type: "SetFont",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
				prevFont: selected[i].font,
				font: font
			});
			selected[i].font = font;
		}
		self.edits.push(edit);
		self.redraw();
    }

    self.setFontSize = function(fontSize) {
        self.fontSize = fontSize;
		var selected = self.getSelected();
		var edit = {
			type: "SetFontSize",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
				prevFontSize: selected[i].fontSize,
				fontSize: fontSize
			});
			selected[i].fontSize = fontSize;
		}
		self.edits.push(edit);
		self.redraw();
    }
	
	self.deleteSelected = function() {
		var selected = self.getSelected();
		var edit = {
			type: "Deleted",
			info: [],
			active: true
		};
		for(var i = 0; i < selected.length; i++) {
			edit.info.push({
				shapeID: selected[i].ID,
			});
			selected[i].active = false;
		}
		self.edits.push(edit);
		self.redraw();
	}

    self.setPageNumber = function(number) {
        document.getElementById("pagenumber").innerHTML = number;
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

        self.setPageNumber(1);
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
            if ($(this).val() == "Circle") {
                $("#toolselectimage").attr("src", "images/circle.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Circle(app.shapeID);
                };
            } else if ($(this).val() == "Ellipse") {
                $("#toolselectimage").attr("src", "images/ellipse.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Ellipse(app.shapeID);
                };
            } else if ($(this).val() == "Eraser") {
                $("#toolselectimage").attr("src", "images/eraser.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Eraser(app.shapeID);
                };
            } else if ($(this).val() == "Line") {
                $("#toolselectimage").attr("src", "images/line.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Line(app.shapeID);
                };
            } else if ($(this).val() == "Pen") {
                $("#toolselectimage").attr("src", "images/pen.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Pen(app.shapeID);
                };
            } else if ($(this).val() == "Square") {
                $("#toolselectimage").attr("src", "images/square.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Square(app.shapeID);
                };
            } else if ($(this).val() == "Text") {
                $("#toolselectimage").attr("src", "images/text.jpg");
                app.shapeFactory = function() {
                    app.shapeID += 1;
                    return new Text(app.shapeID);
                };
            } else if ($(this).val() == "Select") {
                app.shapeFactory = null;
				$("#toolselectimage").attr("src", "images/select.jpg");
				return;
            } else if ($(this).val() == "Move") {
                app.shapeFactory = null;
				$("#toolselectimage").attr("src", "images/move.jpg");
				return;
            }
			app.clearSelection();
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
		$('#deletebutton').click(function() {
            app.deleteSelected();
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