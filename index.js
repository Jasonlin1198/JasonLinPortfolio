import { WEBGL } from "./build/WebGL.js";
import {
  createObjects,
  mixer,
  cube,
  plane,
  groundPlane,
  billboard,
  rings,
  trees,
  rocks,
  cloud,
  airplaneControl,
} from "./models.js";

var mobileVersion = false;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // true for mobile device
  mobileVersion = true;
}

// Enable Debugging with camera movement
var debug = false;
var fog = true;

// Check Browser Compatibility
if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

// HTML Elements
const container = document.getElementById("container");

// Scene Setup Variables
var scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  HEIGHT,
  WIDTH;

// Scene Light Variables
var directionalLight,
  ambientLight,
  pointLight1,
  pointLight2,
  pointLight3,
  pointLight4,
  pointLight5;

var clock;

// Sound Variables
var sound, listener;

// Physical World
let physicsWorld;
let tmpTrans;
let rigidBodies = [];

var Colors = {
  red: 0xf25346,
  white: 0xffffff,
  softwhite: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  lightBlue: 0x7ad7f0,
  desertBrown: 0xe5d3b3,
  black: 0x000000,
  fog_color: 0xdcdbdf,
  orange: 0xfe8f42,
};

//Ammojs Initialization
Ammo().then(init);

/**
 * Parent function that instantiates all objects on load
 */
function init() {
  tmpTrans = new Ammo.btTransform();

  setupPhysicsWorld();
  createScene();
  createCamera();
  createLights();
  createAudio();
  createObjects();

  // KeyPress Listener
  document.body.addEventListener("keydown", onKeyDown, false);

  // Touch controls
  if (mobileVersion) {
    document.body.addEventListener("touchstart", process_touchstart, false);
    document.body.addEventListener("touchmove", process_touchmove, false);
    document.body.addEventListener("touchcancel", process_touchcancel, false);
    document.body.addEventListener("touchend", process_touchend, false);
  }
}

// Create touchstart handler
document.body.addEventListener('touchstart', function(ev) {
  // Iterate through the touch points that were activated
  // for this element and process each event 'target'
  for (var i=0; i < ev.targetTouches.length; i++) {
    process_target(ev.targetTouches[i].target);
  }
}, false);

// touchstart handler
function process_touchstart(ev) {
  // Use the event's data to call out to the appropriate gesture handlers
  switch (ev.touches.length) {
    case 1: handle_one_touch(ev); break;
    case 2: handle_two_touches(ev); break;
    case 3: handle_three_touches(ev); break;
    default: gesture_not_supported(ev); break;
  }
}
// touchmove handler
function process_touchmove(ev) {
  // Set call preventDefault()
  ev.preventDefault();
}

function handle_one_touch(ev){
  window.alert("touched");
}

/**
 * Create ammo.js physical world settings
 */
function setupPhysicsWorld() {
  let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    overlappingPairCache,
    solver,
    collisionConfiguration
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
}

/**
 * Instantiates all Scene related objects
 */
function createScene() {
  // Set window dimensions
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create clock for timing
  clock = new THREE.Clock();

  // Scene Object
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Colors.white);

  // Scene Fog Settings
  if (fog) {
    const near = 20;
    const far = 500;
    const color = Colors.white;
    scene.fog = new THREE.Fog(color, near, far);
  }

  // Scene renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.GammaEncoding;
  container.appendChild(renderer.domElement);

  // Handle Window Resize
  window.addEventListener("resize", handleWindowResize, false);
}

function createCamera() {
  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 75;
  nearPlane = 0.1;
  farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.set(0, 10, 15);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

/**
 * Handles window resizing and updates camera projMtx
 */
function handleWindowResize() {
  // Update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

/**
 * Handles creation of audio in the scene
 */
function createAudio() {
  // Create Audio listener bound to camera and audio source
  listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.PositionalAudio(listener);
  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("sounds/plane.ogg", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.setRefDistance(20);
    //sound.play();
  });
}

/**
 * Handles creation of all light sources
 */
function createLights() {
  // Directional Light Object in Scene
  const dirIntensity = 0.7;
  directionalLight = new THREE.DirectionalLight(Colors.softwhite, dirIntensity);
  directionalLight.position.set(150, 100, 1);

  directionalLight.castShadow = true;

  // Define shadow resolution
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  let dist = 200;
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -dist;
  directionalLight.shadow.camera.right = dist;
  directionalLight.shadow.camera.top = dist;
  directionalLight.shadow.camera.bottom = -dist;
  directionalLight.shadow.camera.far = 13500;

  if (debug) {
    var camHelper = new THREE.CameraHelper(camera);
    scene.add(camHelper);
  }

  // Ambient Light Object in Scene
  const ambientIntensity = 0.7;
  ambientLight = new THREE.AmbientLight(Colors.softwhite, ambientIntensity);

  // Point Light Objects in Scene
  const pointIntensity = 0.8;
  pointLight1 = new THREE.PointLight(Colors.softwhite, pointIntensity, 50, 2);
  pointLight1.position.set(0, 20, 0);

  pointLight2 = new THREE.PointLight(Colors.softwhite, pointIntensity, 50, 2);
  pointLight2.position.set(0, 20, -50);

  pointLight3 = new THREE.PointLight(Colors.softwhite, pointIntensity, 50, 2);
  pointLight3.position.set(0, 20, -100);

  pointLight4 = new THREE.PointLight(Colors.softwhite, pointIntensity, 50, 2);
  pointLight4.position.set(0, 20, -150);

  pointLight5 = new THREE.PointLight(Colors.softwhite, pointIntensity, 50, 2);
  pointLight5.position.set(0, 20, -200);

  const hemiLightIntensity = 0.1;
  const hemiLight = new THREE.HemisphereLight(
    Colors.softwhite,
    Colors.desertBrown,
    hemiLightIntensity
  );

  hemiLight.position.set(0, 50, 0);

  // Add all light sources to the Scene
  scene.add(directionalLight);
  scene.add(ambientLight);
  scene.add(hemiLight);
  scene.add(pointLight1);
  scene.add(pointLight2);
  scene.add(pointLight3);
  scene.add(pointLight4);
  scene.add(pointLight5);
}

/**
 * Handles key presses
 * @param {*} event
 */
function onKeyDown(event) {
  switch (event.keyCode) {
    case 192: // Reset
      plane.position.set(0, 2, 5);
      break;
  }
}

function updatePhysics(deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 10);

  // Update rigid bodies
  for (let i = 0; i < rigidBodies.length; i++) {
    let objThree = rigidBodies[i];
    let objAmmo = objThree.userData.physicsBody;
    let ms = objAmmo.getMotionState();
    if (ms) {
      ms.getWorldTransform(tmpTrans);
      let p = tmpTrans.getOrigin();
      let q = tmpTrans.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
}

/**
 * Updates moving objects per frame
 */
function update(deltaTime) {
  // Reposition camera to behind player
  camera.position.set(
    plane.position.x,
    plane.position.y + 15,
    plane.position.z + 10
  ) * deltaTime;

  cloud.forEach((c) => {
    c.position.x += 5 * deltaTime;
    c.position.z += Math.random() * 1.5 * deltaTime;
    if (c.position.x > 100) {
      scene.remove(c);
    }
  });
}

/**
 * Draws the Scene per frame
 */
function animate() {
  // Updates animations per delta units
  var deltaTime = clock.getDelta();

  update(deltaTime);
  if (mixer) mixer.update(deltaTime);

  if (!mobileVersion) {
    airplaneControl.update();
  } else {
    // Use mobile touch controls
  }

  updatePhysics(deltaTime);
  // let resultantImpulse = new Ammo.btVector3( 1, 0, 0 )
  // resultantImpulse.op_mul(20);

  // let physicsBody = plane.userData.physicsBody;
  // physicsBody.setLinearVelocity( resultantImpulse );

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

export {
  animate,
  scene,
  physicsWorld,
  rigidBodies,
  Colors,
  debug,
  mobileVersion,
};
