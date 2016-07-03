(function() {
	var Typelux = function(container, point) {
		this.container = container;
		this.point = point;

		this.static = {
			x: this.container.clientWidth / 3,
			y: this.container.clientHeight / 3
		};

		this.moving = {
			x: this.container.clientWidth / 3,
			y: this.container.clientHeight / 3
		};

		this.currentPointerId = undefined;
	};

	Typelux.prototype = {
		init: function() {
			this.observePointers();
			this.updateStaticCoordinates();
			this.updateView();
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
		getRelativeX: function() {
			return this.getX('moving') - this.getX('static');
		},
		getRelativeY: function() {
			return this.getY('moving') - this.getY('static');
		},
		getDistanceBetweenCoordinates: function() {
			var relX = this.getRelativeX(),
				relY = this.getRelativeY();

			return Math.sqrt(Math.pow(relX, 2) + Math.pow(relY, 2));
		},
		setCoordinates: function(which, obj) {
			this[which] = obj;
		},
		setRotation: function() {
			var relX = this.getRelativeX() * -1, // consider opposite pointer position
				relY = this.getRelativeY() * -1, // consider opposite pointer position
				dist = this.getDistanceBetweenCoordinates();

			var k = (relY < 0) ? -1 : 1;

			return k * Math.acos(relX / dist) * 180 / Math.PI;
		},
		setScale: function() {
			var dist = this.getDistanceBetweenCoordinates();
			var scale = 1 - (dist / (this.container.clientWidth / 2.5));
			scale = (scale < 0) ? 0 : scale;
			scale = (scale > 1) ? 1 : scale;
			return scale;
		},
		updateStaticCoordinates: function() {
			this.setCoordinates('static', {
				x: this.point.offsetLeft,
				y: this.point.offsetTop
			});
		},
		updateMovingCoordinates: function(evt) {
			this.setCoordinates('moving', {
				x: evt.clientX,
				y: evt.clientY
			});
		},
		updateView: function() {
			this.point.style.transform = 'rotate(' + this.setRotation() + 'deg) scaleX(' + this.setScale() + ')';
			this.point.style.webkitTransform = 'rotate(' + this.setRotation() + 'deg) scaleX(' + this.setScale() + ')';
		},
		observePointers: function() {
			var self = this;

			var onPointerBound = function(evt) {
				self.onPointerBound(evt);
			};

			var onResize = function(evt) {
				self.onResize(evt);
			};

			this.container.addEventListener('pointerdown', onPointerBound);
			this.container.addEventListener('pointermove', onPointerBound);
			this.container.addEventListener('pointerup', onPointerBound);

			window.addEventListener('resize', onResize);
		},
		onPointerBound: function(evt) {
			evt.preventDefault();

			if (evt.type === 'pointerdown') {
				if (typeof this.currentPointerId === 'undefined') {
					this.currentPointerId = evt.pointerId;
					this.updateMovingCoordinates(evt);
					this.updateView();
				}
			}
			else if (evt.type === 'pointermove') {
				if (typeof this.currentPointerId === 'undefined') {
					this.currentPointerId = evt.pointerId;
				}
				if (this.currentPointerId === evt.pointerId) {
					this.updateMovingCoordinates(evt);
					this.updateView();
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
		},
		onResize: function(evt) {
			this.updateStaticCoordinates();
		}
	};

	var luxPoints = [];
	var pointNodes = document.getElementsByClassName('container__point');
	var containerNode = document.getElementsByClassName('container')[0];

	for (var i = 0, lin = pointNodes.length; i < lin; i++) {
		luxPoints[i] = new Typelux(containerNode, pointNodes[i]);
		luxPoints[i].init();
	}
})();
