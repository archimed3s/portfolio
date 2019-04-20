import * as THREE from 'three';
import InteractiveControls from './controls/InteractiveControls';
import Particles from './particles/Particles';

export default class WebGLView {

	constructor() {
		this.samples = 'static/images/sample-latest.png';
		this.initThree();
		this.initParticles();
		this.initControls();
		this.particles.init(this.samples);
	}

	initThree() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		this.clock = new THREE.Clock(true);
	}

	initControls() {
		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
	}

	initParticles() {
		this.particles = new Particles(this);
		this.scene.add(this.particles.container);
	}

	update() {
		const delta = this.clock.getDelta();

		if (this.particles) {
			this.particles.update(delta);
		}
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	resize() {
		if (!this.renderer) {
			return;
		}

		this.camera.aspect = document.querySelector('#container').offsetWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
		this.renderer.setSize(document.querySelector('#container').offsetWidth, window.innerHeight);

		if (this.interactive) {
			this.interactive.resize();
		}
		if (this.particles) {
			this.particles.resize();
		}
	}
}
