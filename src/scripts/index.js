import ready from 'domready';
import anime from 'animejs/lib/anime.es';

import App from './App';

var ModalEffects = (function () {

	function init() {

		var overlay = document.querySelector('.md-overlay');

		[].slice.call(document.querySelectorAll('.md-trigger')).forEach(function (el, i) {

			var modal = document.querySelector('#' + el.getAttribute('data-modal')),
				close = modal.querySelector('.js-closePopup');

			function removeModal(hasPerspective) {
				modal.classList.remove('md-show');

				if (hasPerspective) {
					document.documentElement.classList.remove('md-perspective');
				}
			}

			function removeModalHandler() {
				removeModal(el.classList.contains('md-setperspective'));
			}

			el.addEventListener('click', function (ev) {
				modal.classList.add('md-show');

				if (el.classList.contains('md-setperspective')) {
					setTimeout(function () {
						document.documentElement.classList.add('md-perspective');
					}, 25);
				}
			});

			close.addEventListener('click', function (ev) {
				ev.stopPropagation();
				removeModalHandler();
			});

		});

	}

	init();

})();

(function (window) {

	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function getMousePos(e) {
		var posx = 0, posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {x: posx, y: posy};
	}

	function TiltFx(el, options) {
		this.DOM = {};
		this.DOM.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	TiltFx.prototype.options = {
		movement: {
			imgWrapper: {
				translation: {x: 0, y: 0, z: 0},
				rotation: {x: -5, y: 5, z: 0},
				reverseAnimation: {
					duration: 1200,
					easing: 'easeOutElastic',
					elasticity: 600
				}
			},
			lines: {
				translation: {x: 10, y: 10, z: [0, 10]},
				reverseAnimation: {
					duration: 1000,
					easing: 'easeOutExpo',
					elasticity: 600
				}
			},
			caption: {
				translation: {x: 20, y: 20, z: 0},
				rotation: {x: 0, y: 0, z: 0},
				reverseAnimation: {
					duration: 1500,
					easing: 'easeOutElastic',
					elasticity: 600
				}
			},
			shine: {
				translation: {x: 50, y: 50, z: 0},
				reverseAnimation: {
					duration: 1200,
					easing: 'easeOutElastic',
					elasticity: 600
				}
			}
		}
	};

	TiltFx.prototype._init = function () {
		this.DOM.animatable = {};
		this.DOM.animatable.imgWrapper = this.DOM.el.querySelector('.project__figure');
		this.DOM.animatable.lines = this.DOM.el.querySelector('.tilter__deco--lines');
		this.DOM.animatable.caption = this.DOM.el.querySelector('.project__caption');
		this.DOM.animatable.overlay = this.DOM.el.querySelector('.tilter__deco--overlay');
		this.DOM.animatable.shine = this.DOM.el.querySelector('.tilter__deco--shine > div');
		this._initEvents();
	};

	TiltFx.prototype._initEvents = function () {
		var self = this;

		this.mouseenterFn = function () {
			for (var key in self.DOM.animatable) {
				anime.remove(self.DOM.animatable[key]);
			}
		};

		this.mousemoveFn = function (ev) {
			requestAnimationFrame(function () {
				self._layout(ev);
			});
		};

		this.mouseleaveFn = function (ev) {
			requestAnimationFrame(function () {
				for (var key in self.DOM.animatable) {
					if (self.options.movement[key] == undefined) {
						continue;
					}
					anime({
						targets: self.DOM.animatable[key],
						duration: self.options.movement[key].reverseAnimation != undefined ? self.options.movement[key].reverseAnimation.duration || 0 : 1,
						easing: self.options.movement[key].reverseAnimation != undefined ? self.options.movement[key].reverseAnimation.easing || 'linear' : 'linear',
						elasticity: self.options.movement[key].reverseAnimation != undefined ? self.options.movement[key].reverseAnimation.elasticity || null : null,
						scaleX: 1,
						scaleY: 1,
						scaleZ: 1,
						translateX: 0,
						translateY: 0,
						translateZ: 0,
						rotateX: 0,
						rotateY: 0,
						rotateZ: 0
					});
				}
			});
		};

		this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
		this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
		this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
	};

	TiltFx.prototype._layout = function (ev) {
		// Mouse position relative to the document.
		var mousepos = getMousePos(ev),
			// Document scrolls.
			docScrolls = {
				left: document.body.scrollLeft + document.documentElement.scrollLeft,
				top: document.body.scrollTop + document.documentElement.scrollTop
			},
			bounds = this.DOM.el.getBoundingClientRect(),
			// Mouse position relative to the main element (this.DOM.el).
			relmousepos = {x: mousepos.x - bounds.left - docScrolls.left, y: mousepos.y - bounds.top - docScrolls.top};

		// Movement settings for the animatable elements.
		for (var key in this.DOM.animatable) {
			if (this.DOM.animatable[key] == undefined || this.options.movement[key] == undefined) {
				continue;
			}
			var t = this.options.movement[key] != undefined ? this.options.movement[key].translation || {
					x: 0,
					y: 0,
					z: 0
				} : {x: 0, y: 0, z: 0},
				r = this.options.movement[key] != undefined ? this.options.movement[key].rotation || {
					x: 0,
					y: 0,
					z: 0
				} : {x: 0, y: 0, z: 0},
				setRange = function (obj) {
					for (var k in obj) {
						if (obj[k] == undefined) {
							obj[k] = [0, 0];
						} else if (typeof obj[k] === 'number') {
							obj[k] = [-1 * obj[k], obj[k]];
						}
					}
				};

			setRange(t);
			setRange(r);

			var transforms = {
				translation: {
					x: (t.x[1] - t.x[0]) / bounds.width * relmousepos.x + t.x[0],
					y: (t.y[1] - t.y[0]) / bounds.height * relmousepos.y + t.y[0],
					z: (t.z[1] - t.z[0]) / bounds.height * relmousepos.y + t.z[0]
				},
				rotation: {
					x: (r.x[1] - r.x[0]) / bounds.height * relmousepos.y + r.x[0],
					y: (r.y[1] - r.y[0]) / bounds.width * relmousepos.x + r.y[0],
					z: (r.z[1] - r.z[0]) / bounds.width * relmousepos.x + r.z[0]
				}
			};

			this.DOM.animatable[key].style.WebkitTransform = this.DOM.animatable[key].style.transform = 'translateX(' + transforms.translation.x + 'px) translateY(' + transforms.translation.y + 'px) translateZ(' + transforms.translation.z + 'px) rotateX(' + transforms.rotation.x + 'deg) rotateY(' + transforms.rotation.y + 'deg) rotateZ(' + transforms.rotation.z + 'deg)';
		}
	};

	window.TiltFx = TiltFx;

})(window);

ready(() => {
	window.app = new App();
	window.app.init();

	document.getElementsByClassName('js-viewPortfolio')[0].addEventListener('click', () => {
		document.getElementsByClassName('js-title')[0].classList.add('hide');
		document.getElementsByClassName('js-description')[0].classList.add('hide');
		document.getElementsByClassName('js-description2')[0].classList.add('hide');
		document.getElementsByClassName('js-viewPortfolio')[0].classList.add('hide');
		document.getElementById('container').classList.add('hide');
		document.getElementsByClassName('js-projectsContainer')[0].classList.add('active');
	});

	letterAnimation('js-title', 2);

	setTimeout(() => {
		letterAnimation('js-description', 2);
	}, 1000);

	setTimeout(() => {
		letterAnimation('js-description2', 2);
	}, 1000);

	setTimeout(() => {
		letterAnimation('js-btn', 2);
	}, 2000);

	function letterAnimation(elem, duration) {
		let animDuration = duration,
			copyEl = document.getElementsByClassName(elem),
			copyText = copyEl.innerHTML;

		for (let i = 0; i < copyEl[0].children.length; i++) {
			let line = copyEl[0].children[i],
				words = line.innerHTML.split(' '),
				newLine = document.createElement('p');

			words.forEach(function (word) {
				let wordWrapper = document.createElement('span');

				wordWrapper.className = 'word';

				for (let j = 0; j < word.length; j++) {
					let letter = word[j],
						letterWrapper = document.createElement('span');

					letterWrapper.className = 'letter';

					let animDelay = Math.random() * animDuration;

					letterWrapper.style.animationDelay = animDelay + 's';
					letterWrapper.style.animationDuration = (animDuration - animDelay) + 's';

					let letterContent = document.createTextNode(letter);

					letterWrapper.appendChild(letterContent);
					wordWrapper.appendChild(letterWrapper);
				}

				newLine.appendChild(wordWrapper);
			});

			copyEl[0].replaceChild(newLine, copyEl[0].children[i]);
		}

		copyEl[0].classList.add('active');
	}

	var tiltSettings = [
		{},
		{
			movement: {
				imgWrapper : {
					translation : {x: 10, y: 10, z: 30},
					rotation : {x: 0, y: -10, z: 0},
					reverseAnimation : {duration : 200, easing : 'easeOutQuad'}
				},
				lines : {
					translation : {x: 10, y: 10, z: [0,70]},
					rotation : {x: 0, y: 0, z: -2},
					reverseAnimation : {duration : 2000, easing : 'easeOutExpo'}
				},
				caption : {
					rotation : {x: 0, y: 0, z: 2},
					reverseAnimation : {duration : 200, easing : 'easeOutQuad'}
				},
				overlay : {
					translation : {x: 10, y: -10, z: 0},
					rotation : {x: 0, y: 0, z: 2},
					reverseAnimation : {duration : 2000, easing : 'easeOutExpo'}
				},
				shine : {
					translation : {x: 100, y: 100, z: 0},
					reverseAnimation : {duration : 200, easing : 'easeOutQuad'}
				}
			}
		},
		{
			movement: {
				imgWrapper : {
					rotation : {x: -5, y: 10, z: 0},
					reverseAnimation : {duration : 900, easing : 'easeOutCubic'}
				},
				caption : {
					translation : {x: 30, y: 30, z: [0,40]},
					rotation : {x: [0,15], y: 0, z: 0},
					reverseAnimation : {duration : 1200, easing : 'easeOutExpo'}
				},
				overlay : {
					translation : {x: 10, y: 10, z: [0,20]},
					reverseAnimation : {duration : 1000, easing : 'easeOutExpo'}
				},
				shine : {
					translation : {x: 100, y: 100, z: 0},
					reverseAnimation : {duration : 900, easing : 'easeOutCubic'}
				}
			}
		},
		{
			movement: {
				imgWrapper : {
					rotation : {x: -5, y: 10, z: 0},
					reverseAnimation : {duration : 50, easing : 'easeOutQuad'}
				},
				caption : {
					translation : {x: 20, y: 20, z: 0},
					reverseAnimation : {duration : 200, easing : 'easeOutQuad'}
				},
				overlay : {
					translation : {x: 5, y: -5, z: 0},
					rotation : {x: 0, y: 0, z: 6},
					reverseAnimation : {duration : 1000, easing : 'easeOutQuad'}
				},
				shine : {
					translation : {x: 50, y: 50, z: 0},
					reverseAnimation : {duration : 50, easing : 'easeOutQuad'}
				}
			}
		},
		{
			movement: {
				imgWrapper : {
					translation : {x: 0, y: -8, z: 0},
					rotation : {x: 3, y: 3, z: 0},
					reverseAnimation : {duration : 1200, easing : 'easeOutExpo'}
				},
				lines : {
					translation : {x: 15, y: 15, z: [0,15]},
					reverseAnimation : {duration : 1200, easing : 'easeOutExpo'}
				},
				overlay : {
					translation : {x: 0, y: 8, z: 0},
					reverseAnimation : {duration : 600, easing : 'easeOutExpo'}
				},
				caption : {
					translation : {x: 10, y: -15, z: 0},
					reverseAnimation : {duration : 900, easing : 'easeOutExpo'}
				},
				shine : {
					translation : {x: 50, y: 50, z: 0},
					reverseAnimation : {duration : 1200, easing : 'easeOutExpo'}
				}
			}
		},
		{
			movement: {
				lines : {
					translation : {x: -5, y: 5, z: 0},
					reverseAnimation : {duration : 1000, easing : 'easeOutExpo'}
				},
				caption : {
					translation : {x: 15, y: 15, z: 0},
					rotation : {x: 0, y: 0, z: 3},
					reverseAnimation : {duration : 1500, easing : 'easeOutElastic', elasticity : 700}
				},
				overlay : {
					translation : {x: 15, y: -15, z: 0},
					reverseAnimation : {duration : 500,easing : 'easeOutExpo'}
				},
				shine : {
					translation : {x: 50, y: 50, z: 0},
					reverseAnimation : {duration : 500, easing : 'easeOutExpo'}
				}
			}
		},
		{
			movement: {
				imgWrapper : {
					translation : {x: 5, y: 5, z: 0},
					reverseAnimation : {duration : 800, easing : 'easeOutQuart'}
				},
				caption : {
					translation : {x: 10, y: 10, z: [0,50]},
					reverseAnimation : {duration : 1000, easing : 'easeOutQuart'}
				},
				shine : {
					translation : {x: 50, y: 50, z: 0},
					reverseAnimation : {duration : 800, easing : 'easeOutQuart'}
				}
			}
		},
		{
			movement: {
				lines : {
					translation : {x: 40, y: 40, z: 0},
					reverseAnimation : {duration : 1500, easing : 'easeOutElastic'}
				},
				caption : {
					translation : {x: 20, y: 20, z: 0},
					rotation : {x: 0, y: 0, z: -5},
					reverseAnimation : {duration : 1000, easing : 'easeOutExpo'}
				},
				overlay : {
					translation : {x: -30, y: -30, z: 0},
					rotation : {x: 0, y: 0, z: 3},
					reverseAnimation : {duration : 750, easing : 'easeOutExpo'}
				},
				shine : {
					translation : {x: 100, y: 100, z: 0},
					reverseAnimation : {duration : 750, easing : 'easeOutExpo'}
				}
			}
		}];

	function init() {
		var idx = 0;
		[].slice.call(document.querySelectorAll('button.project')).forEach(function(el, pos) {
			idx = pos%2 === 0 ? idx+1 : idx;
			new TiltFx(el, tiltSettings[idx-1]);
		});
	}

	init();
});
