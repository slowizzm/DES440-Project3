//Scene
var camera,
    scene,
    renderer,
    uniforms,
    startTime,
    container;


//Scene
scene = new THREE.Scene();

//Renderer
renderer = new THREE.WebGLRenderer({
    antialias: true
});

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, -900, 1500);
camera.focalLength = camera.position.distanceTo(scene.position);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x000000, 0.0));
renderer.shadowMap.enabled = true;
renderer.vr.enabled = true;


function init() {
  container = document.getElementById( 'myCanvas' );
  startTime = Date.now();
  camera = new THREE.Camera();
  camera.position.z = 1;
  renderer.setClearColor(new THREE.Color(0x000000, 1.0));
  scene = new THREE.Scene();
  var geometry = new THREE.PlaneBufferGeometry(2, 2 );
  uniforms = {
    globeTime: { type: "f", value: 1.0 },
    res: { type: "v1", value: new THREE.Vector2(), }
  };

  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  });

  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  container.appendChild( renderer.domElement );
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );
};

function animate() {
  requestAnimationFrame( animate );
  render();
};

function render() {
  var currentTime = Date.now();
  uniforms.globeTime.value = (currentTime - startTime) * 0.001;
  renderer.render( scene, camera );
};
