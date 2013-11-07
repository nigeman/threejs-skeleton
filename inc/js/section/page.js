var SITE = SITE || {};

SITE.Page = (function(){

	function Page(options) {
		this._eventNameSpace = 'Page';
		this._eventNameSpace += ++Page.COUNT;

		this.mainScene = null;
		this.renderer = null;

		this.options = {
			windowWidth: null,
			windowHeight: null
		};

		this.materials = {};

		this.geometry = {};

		this.light = null;
		this.camera = null;
		this.controls = null;

		$.extend(this.options, options);

		this.init();

		this.options.html = this.options.$wrapper.html();
	}

	Page.COUNT = 0;

	Page.prototype = {

		init: function(){
			//Init (Physijs + ammo) Physic Engine
			Physijs.scripts.worker = 'inc/js/lib/physijs_worker.js';
			Physijs.scripts.ammo = 'ammo.js';

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.mainScene = new Physijs.Scene;
			this.mainScene.setGravity(new THREE.Vector3( 0, -400, 0));

			// set the scene size
			this.options.width = this.options.$wrapper.width();
			this.options.height = this.options.$wrapper.height();
			this.renderer.setSize(this.options.width, this.options.height);

			// attach the render-supplied DOM element
			this.options.$wrapper.append(this.renderer.domElement);

			// create Camera
			this.addSceneCamera();

			// create Lighting
			this.addSceneLight();

			// create Geometry Materials
			this.addGeometryMaterials();

			// create Geometry
			this.addGeometry();

			// add Scene Events
			this.addSceneEvents();

			// create Controls
			this.addSceneControls();

			// draw Scene
			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapSoft = true;
			this.renderScene(26);
		},

		addSceneEvents: function(){

		},

		addSceneControls: function(){
			this.controls = new THREE.OrbitControls(this.camera);

			this.controls.addEventListener('change', this.renderScene);
		},

		renderScene: function(fps){
			var _this = this;

			setTimeout(function() {
				requestAnimationFrame(_this.renderScene.bind(_this));

				_this.controls.update();
				_this.mainScene.simulate();
				_this.renderer.render(_this.mainScene, _this.camera);
			}, 1000 / fps);
		},

		addSceneLight: function(){
			this.light = new THREE.DirectionalLight(0xFFFFFF, 2);
			this.light.position.x = 50;
			this.light.position.y = 50;
			this.light.position.z = 110;
			this.light.shadowDarkness = 0.5;
			this.light.castShadow = true;
			this.light.shadowCameraBottom = -200;
			this.light.shadowCameraVisible = true;

			this.mainScene.add(this.light);
		},

		addGeometryMaterials: function(){
			this.materials.sphere = Physijs.createMaterial(
				new THREE.MeshLambertMaterial(
				{
					color: 0x03740d,
					overdraw: true
				}),
				0.6, // medium friction
				1.1 // bouncy restitution
			);

			this.materials.sphereTwo = Physijs.createMaterial(
				new THREE.MeshLambertMaterial(
					{
						color: 0x03740d,
						overdraw: true
					}),
				0.6, // medium friction
				1.1 // bouncy restitution
			);

			this.materials.plane = Physijs.createMaterial(
				new THREE.MeshLambertMaterial(
				{
					color: 0xffffff,
					overdraw: true
				}),
				0.6, // medium friction
				1 // low restitution
			);
		},

		addSceneCamera: function(){
			// Camera Attributes
			var VIEW_ANGLE = 45,
				ASPECT = this.options.width  / this.options.height,
				NEAR = 1,
				FAR = 5000;

			// Camera Properties
			this.camera = new THREE.PerspectiveCamera(
				VIEW_ANGLE,
				ASPECT,
				NEAR,
				FAR
			);

			this.camera.position.z = 600;
			this.camera.position.y = 100;

			this.mainScene.add(this.camera);
		},

		addGeometry: function(){
			// Geometry Attributes
			var RADIUS = 50,
				SEGMENTS = 16,
				RINGS = 16;

			// create a new mesh with sphere geometry -
			this.geometry.sphere = new Physijs.SphereMesh(
				new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),
				this.materials.sphere);

			this.geometry.sphereTwo = new Physijs.SphereMesh(
				new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),
				this.materials.sphereTwo);

			this.geometry.plane = new Physijs.BoxMesh(
				new THREE.PlaneGeometry(4000, 4000, 122, 122),
				this.materials.plane);

			//Set Plane properties
			this.geometry.plane.rotation.y = THREE.Math.degToRad(-0);
			this.geometry.plane.rotation.x = THREE.Math.degToRad(-90);
			this.geometry.plane.rotation.z = 0;
			this.geometry.plane.position.y = -50;
			this.geometry.plane.receiveShadow = true;

			//Set Sphere properties
			this.geometry.sphere.position.y = 200;
			this.geometry.sphere.castShadow = true;

			//Set SphereTwo properties
			this.geometry.sphereTwo.position.y = 300;
			this.geometry.sphereTwo.position.x = 50;
			this.geometry.sphereTwo.castShadow = true;

			this.mainScene.add(this.geometry.sphere);
			this.mainScene.add(this.geometry.sphereTwo);
			this.mainScene.add(this.geometry.plane);
		}
	}

	return Page;
})();
