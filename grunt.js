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

function floorCeil(a,b,c,d) {
	var x1 = a;
	var y1 = b;
	var x2 = a+c;
	var y2 = b+d;
	
}

Raphael.fn.boundingRect = function(margin) {
	margin = +margin || 0;
	var set = this.set();
	set.push.apply(set,arguments);
	var size = set.getBBox();
	var rect = this.rect(size.x-margin, size.y-margin, size.width+2*margin, size.height+2*margin);
	/* Pour des bords nets : rect.node.style.shapeRendering = "crispEdges"; */
	rect.set = this.set().push(rect,set);
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
			this.firstMove = true;
			this.toFront();
		};
		var move = function (dx, dy) {
			if (this.firstMove) { this.firstMove = false; this.attr({opacity: 0.5}); }
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

/* Modèle
[World]<>-[BlockDef|name,inputPorts,outputPorts]-[Graph]
Graph = ??? des ports et des blocs…

Algorithme d'évaluation :

Pour instancier une définition de bloc :
- Instancier le bloc à partir de sa définition
  - Pour chaque sous-bloc de la définition, on a dans l'instance un slot d'instance pour le sous-bloc (vide au départ).
  - Pour chaque port de sortie de chaque sous-bloc, on a dans l'instance un slot de port (vide au départ) (peut être stocké directement dans les ports de sortie de l'instance).
  - Pour chaque port d'entrée du bloc, on a dans l'instance un slot de port (vide au départ).

Pour évaluer la valeur d'un port de sortie d'un bloc (inst) :
- Chercher quel sous-bloc & port est connecté à ce port de sortie
- Si le slot de ce sous-bloc est vide, instancier le sous-bloc et stocker l'isntance dans le slot
- Si le slot de port de sortie de ce sous-bloc est vide :
  - Calculer la valeur du port de sortie souhaité de ce sous-bloc
  - Stocker la valeur ainsi calculée dans le slot de port de sortie qu'on cherchait au départ
- Renvoyer la valeur ainsi calculée.

Pour évaluer la valeur d'un port d'entrée d'un bloc (inst) :
- Dans l'instance de bloc contenant celle-ci,
  - Chercher le sous-bloc / le port d'entrée connecté au notre.
  - Calculer cette valeur
    - Soit en récursion pour calculer le port d'entrée du parent
    - Soit en récursion pour calculer le port de sortie du bloc voisin au notre.
*/
