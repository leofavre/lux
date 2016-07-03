(function() {
	var Typelux = function(container) {
		this.container = container;

		this.static = {
			x: undefined,
			y: undefined
		};

		this.moving = {
			x: undefined,
			y: undefined
		};

		this.currentPointerId = undefined;
	};

	Typelux.prototype = {
		init: function() {
			this.observePointers();
		},
		getCoordinates: function(which) {
			return this[which];
		},
		getX: function(which) {
			return this.getCoordinates(which).x;
		},
		getY: function(which) {
			return this.getCoordinates(which).y;
		},
		setCoordinates: function(which, obj) {
			this[which] = obj;
		},
		updateMovingCoordinates: function(evt) {
			this.setCoordinates('moving', {
				x: evt.clientX,
				y: evt.clientY
			});
		},
		observePointers: function() {
			var self = this;

			var onPointerBound = function(evt) {
				self.onPointerBound(evt);
			};

			this.container.addEventListener('pointerdown', onPointerBound);
			this.container.addEventListener('pointermove', onPointerBound);
			this.container.addEventListener('pointerup', onPointerBound);
		},
		onPointerBound: function(evt) {
			if (evt.type === 'pointerdown') {
				if (typeof this.currentPointerId === 'undefined') {
					this.currentPointerId = evt.pointerId;
					this.updateMovingCoordinates(evt);
				}
			}
			else if (evt.type === 'pointermove') {
				if (typeof this.currentPointerId === 'undefined') {
					this.currentPointerId = evt.pointerId;
				}
				if (this.currentPointerId === evt.pointerId) {
					this.updateMovingCoordinates(evt);
					console.log(this.moving);
				}
				else {
					return false;
				}
			}
			else if (evt.type === 'pointerup') {
				if (this.currentPointerId === evt.pointerId) {
					this.currentPointerId = undefined;
				}
			}
		}
	};

	var containerNode = document.getElementsByClassName('container')[0];
	var test = new Typelux(containerNode);
	test.init();
})();


/*
// descrição
// elemento gráfico posicionado em (x,y) que aponta para as
// coordenadas (m,n) do mouse e tem seu comprimento variando em
// função da distância (m,n)(x,y).




// coordenadas do mouse (m,n) e da figura (x,y)
// n e y são multiplicados por -1 pois o flash considera o quadrante
// inferior como sendo positivo, quando na verdade é negativo.

m = _root.ponto._x;
n = _root.ponto._y * -1;

x = (this._x) - m;
y = (this._y * -1) - n;




// definição do ângulo em que a figura deve rotacionada
// distância entre o ponto (m,n) e o ponto (x,y)

dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));




// ângulo formado pela retas (m,n)(x,y) e (m,n)(x,n)
// como essa função só gera ângulos positivos, há um *if* para
// tornar negativos os ângulos do quadrante superior.

if (dist <= 100) {

	figura._visible = 1;
	angulo = (Math.acos(x / dist) * 180 / Math.PI);
	max = dist;

	if (y <= 0) {
		figura._rotation = angulo;
	}
	else {
		figura._rotation = angulo * -1;
	}

}
else {
	max = 110;
	figura._rotation = 0;
	figura._visible = 0;
}

figura._xscale = 20 + ((100 - max) * 14.4);
*/