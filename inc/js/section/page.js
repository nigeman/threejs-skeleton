var SITE = SITE || {};

SITE.Page = (function(){

	function Page(options) {
		this._eventNameSpace = 'Page';
		this._eventNameSpace += ++Page.COUNT;

		this.options = {
			windowWidth: null,
			windowHeight: null
		};

		this.materials = {};

		this.geometry = {};

		this.light = null;
		this.camera = null;

		this.mainScene = null;

		$.extend(this.options, options);

		this.init();

		this.options.html = this.options.$wrapper.html();
	}

	Page.COUNT = 0;

	Page.prototype = {

		init: function(){
			var renderer = new THREE.WebGLRenderer();
			this.mainScene = new THREE.Scene();

			// set the scene size
			this.options.width = this.options.$wrapper.width();
			this.options.height = this.options.$wrapper.height();

			renderer.setSize(this.options.width, this.options.height);

			// attach the render-supplied DOM element
			this.options.$wrapper.append(renderer.domElement);

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

			// draw Scene
			renderer.render(this.mainScene, this.camera);
		},

		addSceneEvents: function(){

		},

		addSceneLight: function(){
			this.light = new THREE.DirectionalLight( 0xFFFFFF, 2 );
			this.light.position.x = 10;
			this.light.position.y = 50;
			this.light.position.z = 130;

			this.mainScene.add(this.light);
		},

		addGeometryMaterials: function(){
			this.materials.sphere = new THREE.MeshLambertMaterial(
			{
				color: 0x03740d
			});

			this.materials.plane = new THREE.MeshLambertMaterial(
			{
				color: 0xffffff
			});
		},

		addSceneCamera: function(){
			// Camera Attributes
			var VIEW_ANGLE = 45,
				ASPECT = this.options.width  / this.options.height,
				NEAR = 0.1,
				FAR = 10000;

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
			this.geometry.sphere = new THREE.Mesh(
				new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS),
				this.materials.sphere);

			this.geometry.plane = new THREE.Mesh(
				new THREE.PlaneGeometry(4000, 4000, 122, 122),
				this.materials.plane);

			//Set Plane orientations
			this.geometry.plane.rotation.y = 0;
			this.geometry.plane.rotation.x = THREE.Math.degToRad(-90);
			this.geometry.plane.rotation.z = 0;
			this.geometry.plane.position.y = -50;

			this.mainScene.add(this.geometry.sphere);
			this.mainScene.add(this.geometry.plane);
		}
	}

	return Page;
})();
