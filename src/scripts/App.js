import WebGLView from './webgl/WebGLView';

export default class App {

	constructor() {

	}

	init() {
		this.initWebGL();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
		document.querySelector('#container').appendChild(this.webgl.renderer.domElement);
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize.bind(this));
	}

	animate() {
		this.update();
		this.draw();
		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	update() {
		if (this.webgl) {
			this.webgl.update();
		}
		if (this.gui) {
			this.gui.update();
		}
	}

	draw() {
		if (this.webgl) {
			this.webgl.draw();
		}
	}

	resize() {
		if (this.webgl) {
			this.webgl.resize();
		}
	}
}
