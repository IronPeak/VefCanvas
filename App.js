function App(canvasSelector) {
	var self = this;
	self.getEventPoint = function(e) {
		return new Point(e.pageX - self.canvasOffset.x,e.pageY - self.canvasOffset.y);
	}

	self.drawingStart = function(e) {	
		var startPos = self.getEventPoint(e);
		var shape = self.shapeFactory();
		shape.pos = startPos;
		shape.brushColor = self.brushColor;
		shape.fillColor = self.fillColor;
		shape.fill = self.fill;
		shape.brush = self.brush;
		
		shape.startDrawing(startPos,self.canvasContext);
		startPos.log('drawing start');
	
		var drawing = function(e) {
			var pos = self.getEventPoint(e);
			
			shape.drawing(pos,self.canvasContext);

			self.redraw();
			shape.draw(self.canvasContext);
		}

		var drawingStop = function(e) {
			var pos = self.getEventPoint(e);

			shape.stopDrawing(pos,self.canvasContext);

			pos.log('drawing stop')

			self.shapes.push(shape);
			shape.added(self.canvasContext);

			// Remove drawing and drawingStop functions from the mouse events
			self.canvas.off({
				mousemove:drawing,
				mouseup:drawingStop
			});

			self.redraw();
		}

		// Add drawing and drawingStop functions to the mousemove and mouseup events
		self.canvas.on({
			mousemove:drawing,
			mouseup:drawingStop
		});	
	}

	self.mousedown = function(e) {
		if(self.shapeFactory != null) {
			self.drawingStart(e);
		} else {
		}

		self.redraw();
	}

	self.redraw = function() {
		self.canvasContext.clearRect(0, 0, self.canvasContext.canvas.width, self.canvasContext.canvas.height);
		for(var i = 0; i < self.shapes.length; i++) {
			self.shapes[i].draw(self.canvasContext);
		}
	}
	
	self.clear = function() {
		self.shapes = [];
		self.redraw();
	}

	self.undo = function() {
		if(!self.shapes.length == 0) {
			var lastShape = self.shapes.pop();
			self.oldShapes.push(lastShape);
			self.redraw();
		}
	}

	self.redo = function() {
		if(!self.oldShapes.length == 0) {
			var getLast = self.oldShapes.pop();
			self.shapes.push(getLast);
			self.redraw();
		}
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
		self.canvasOffset = new Point(self.canvas.offset().left,self.canvas.offset().top);
		self.canvas.on({
			mousedown:self.mousedown
		});
		self.shapeFactory = null;
		self.canvasContext = canvas.getContext("2d");
		self.shapes = new Array();
		self.oldShapes = new Array();
		
		// Set defaults
		self.brushColor = '#ff0000';
		self.fillColor = '#ff0000';
		self.fill = false;
		self.brush = 5;
		// TODO: Set sensible defaults ...
	}
	
	self.init();
}
var app = null;
$(function() {
	// Wire up events
	app = new App('#canvas');
	$('#squarebutton').click(function(){app.shapeFactory = function() {
		return new Square();
	};});
	$('#linebutton').click(function(){app.shapeFactory = function() {
		return new Line();
	};});
	$('#circlebutton').click(function(){app.shapeFactory = function() {
		return new Circle();
	};});
	$('#ellipsebutton').click(function(){app.shapeFactory = function() {
		return new Ellipse();
	};});
	$('#clearbutton').click(function(){app.clear()});
	$('#undobutton').click(function(){app.undo()});
	$('#redobutton').click(function(){app.redo()});
	$('#brushcolor').change(function(){app.setBrushColor($(this).val())});
	$('#fillcolor').change(function(){app.setFillColor($(this).val())});
	$('#fillshapes').click(function(){app.setFillOption(this.checked)});
	$('#brushsize').change(function(){app.setBrush($(this).val())});
});