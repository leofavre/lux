(function() {
	var Typelux = function(container, point) {
		this.container = container;
		this.point = point;

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
			this.setStaticCoordinates();
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
		getRotationAngle: function() {
			var relX = -this.getRelativeX(),
				relY = -this.getRelativeY(),
				dist = this.getDistanceBetweenCoordinates();

			var k = (relY < 0) ? -1 : 1;

			return k * Math.acos(relX / dist) * 180 / Math.PI;
		},
		setCoordinates: function(which, obj) {
			this[which] = obj;
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
			this.point.style.transform = 'rotate(' + this.getRotationAngle() + 'deg)';
			this.point.style.webkitTransform = 'rotate(' + this.getRotationAngle() + 'deg)';
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
	var pointNode = document.getElementsByClassName('container__point')[0];
	var containerNodes = document.getElementsByClassName('container');

	for (var i = 0, lin = containerNodes.length; i < lin; i++) {
		luxPoints[i] = new Typelux(containerNodes[i], pointNode);
		luxPoints[i].init();
	}
})();
