function drawText(x,y,text,margin) {
	margin = (margin == null) ? 10 : margin;
	var t = r.text(0,0,text);
	var size = t.getBBox();
	var marginRect = r.rect(size.x - margin, size.y - margin, size.width + 2*margin, size.height + 2*margin).hide().attr("stroke-width", 0);
	return r.set().push(t,marginRect).translate(margin+x-size.x, margin+y-size.y);
}

function Block(name) {
	this.name = name;
	this.draw = function(x,y) {
		var name = drawText(x,y,this.name);
		var size = name.getBBox();
		var block = r.rect(x, y, size.width, 50 + size.height).insertBefore(name).attr({
			stroke: this.borderColor,
			fill: this.fillColor
		});
		return r.set().push(block, name);
	};
}

// Colors
Block.prototype.borderColor = "#000";
Block.prototype.fillColor = "#ff8";

function init() {
	r = Raphael("ide", 640, 480);
	new Block("Block 1").draw(150, 100);
	new Block("My pretty block").draw(30, 200);
}

new Event.observe(window, 'load', init);
