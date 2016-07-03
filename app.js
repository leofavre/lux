(function() {
	var Typelux = function(container, point) {
		this.container = container;
		this.point = point;

		this.static = {
			x: this.container.clientWidth / 2,
			y: this.container.clientHeight / 2
		};

		this.moving = {
			x: this.container.clientWidth / 2,
			y: this.container.clientHeight / 2
		};

		this.currentPointerId = undefined;
	};

	Typelux.prototype = {
		init: function() {
			this.observePointers();
			this.setStaticCoordinates();
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

		},
		setStaticCoordinates: function() {
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
			this.point.style.transform = 'rotate(' + this.setRotation() + 'deg)';
			this.point.style.webkitTransform = 'rotate(' + this.setRotation() + 'deg)';
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
