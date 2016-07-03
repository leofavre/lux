(function() {
	function offset(el) {
		// as seen on https://plainjs.com/javascript/styles/get-the-position-of-an-element-relative-to-the-document-24/

		var rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		return {
			top: rect.top + scrollTop,
			left: rect.left + scrollLeft
		};
	}

	var PointLux = function(container, point) {
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

	PointLux.prototype = {
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
				x: offset(this.point).left,
				y: offset(this.point).top,
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

			window.addEventListener('pointerdown', onPointerBound);
			window.addEventListener('pointermove', onPointerBound);
			window.addEventListener('pointerup', onPointerBound);

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

	var TypeLux = function(container, str) {
		this.container = container;
		this.string = str;
	};

	TypeLux.letter = {
		'a': ['01110', '10001', '11111', '10001', '10001'],
		' ': ['0', '0', '0', '0', '0']
	};

	TypeLux.prototype = {
		init: function() {
			this.writeWords();
		},
		writeWords: function() {
			for (var i = 0, lin = this.string.length; i < lin; i++) {
				var str = this.string[i];
				this.writeCharacter(str);
			}
		},
		writeCharacter: function(str) {
			var map = TypeLux.letter[str];

			if (typeof map !== 'undefined' && typeof map.length !== 'undefined') {
				var width = map[0].length;
				var height = map.length;
				var characterNode = this.outputCharacter(width, height);

				for (var i = 0, lin = map.length; i < lin; i++) {
					this.writeCharacterPoints(map[i], i, characterNode);
				}
			}
		},
		outputCharacter: function(width, height) {
			var characterNode = document.createElement('span');

			characterNode.className = 'container__character';
			characterNode.style.width = (9 * width) + 'px';
			characterNode.style.height = (9 * height) + 'px';

			this.container.appendChild(characterNode);

			return characterNode;
		},
		writeCharacterPoints: function(line, index, characterNode) {
			var top = index * 9,
				left;

			for (var i = 0, lin = line.length; i < lin; i++) {
				if (line[i] === '1') {
					left = i * 9;
					this.outputCharacterPoint(top, left, characterNode);
				}
			}
		},
		outputCharacterPoint: function(top, left, characterNode) {
			var characterPointNode = document.createElement('span');

			characterPointNode.className = 'container__point';
			characterPointNode.style.top = top + 'px';
			characterPointNode.style.left = left + 'px';

			characterNode.appendChild(characterPointNode);

			var lux = new PointLux(this.container, characterPointNode);
			lux.init();

			return characterPointNode;
		}
	};

	var containerNode = document.getElementsByClassName('container')[0];
	var sentence = new TypeLux(containerNode, 'a');

	sentence.init();
})();
