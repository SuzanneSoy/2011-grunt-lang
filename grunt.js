Raphael.fn.marginText = function (x,y,text,margin) {
	margin = isNaN(+margin) ? 10 : margin;
	var t = this.text(0,0,text);
	var size = t.getBBox();
	t.translate(margin+x-size.x, margin+y-size.y);
	// TODO : surcharger les méthodes permettant de faire un set! sur x et y.
	var getBBox = t.getBBox;
	t.getBBox = function() {
		var bBox = getBBox.call(this);
		bBox.x -= margin;
		bBox.y -= margin;
		bBox.width += 2*margin;
		bBox.height += 2*margin;
		return bBox
	};
	return t;
};

Raphael.fn.boundingRect = function(margin) {
	margin = +margin || 0;
	var set = this.set();
	set.push.apply(set,arguments);
	var size = set.getBBox();
	var rect = this.rect(size.x-margin, size.y-margin, size.width+2*margin, size.height+2*margin);
	rect.set = set.push(rect);
	return rect;
};

function Block(name) {
	this.name = name;
	this.draw = function(x,y) {
		var name = r.text(x,y,this.name);
		var block = r.boundingRect(10, name).insertBefore(name).attr({
			stroke: this.borderColor,
			fill: this.fillColor
		});
		var start = function () {
			this.oldDx = 0;
			this.oldDy = 0;
			this.attr({opacity: 0.5});
		};
		var move = function (dx, dy) {
			this.translate(dx-this.oldDx, dy-this.oldDy);
			this.oldDx = dx;
			this.oldDy = dy;
		};
		var up = function () {
			this.attr({opacity: 1});
		};
		block.set.drag(move, start, up, block.set, block.set, block.set);
		return block.set;
	};
};

// Colors
Block.prototype.borderColor = "#000";
Block.prototype.fillColor = "#ff8";

function init() {
	$('noscript').hide();
	r = Raphael("ide", 640, 480);
	b1 = new Block("Block 1").draw(150, 100);
	b2 = new Block("My pretty block").draw(30, 200);
}

new Event.observe(window, 'load', init);
