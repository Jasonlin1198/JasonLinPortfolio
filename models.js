import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";
import {
  animate,
  scene,
  physicsWorld,
  rigidBodies,
  Colors,
  debug,
  mobileVersion,
} from "./index.js";
import { Vector3, Vector4 } from "./build/three.module.js";

const STATE = { DISABLE_DEACTIVATION: 4 };

const FLAGS = { CF_KINEMATIC_OBJECT: 2 };

// Active Scene Objects
var cube, plane, groundPlane, billboard;
var rings = [];
var trees = [];
var rocks = [];
var cloud = [];

// Animation Variables
var mixer;

// Controllers
var airplaneControl;

var messages = [
  `Online Private Instructor\n
iD Tech Camps\n\n
Instructed 150+ lessons to K-12 students on Python, Java, Scratch, and JavaScript\n
Designed unique curriculums to accommodate students’ individual needs and interests\n
Leveraged Full Stack Development to help students deploy web applications and games`,

  `Software Engineer Intern \n
UpperLine Code\n\n
Developed computer science projects using JavaScript, HTML and CSS designed for student education\n
Maintained Git repo and Amazon Web Services for building and debugging course exercises`,

  `SortingVisualizer\n
JavaScript Web Application\n\n
Developed a web application using JavaScript, HTML, CSS to visually sort data using various sorting algorithms\n
Implemented Merge Sort, Insertion Sort, Bubble Sort, Selection Sort\n
Integrated a code executor using Sphere Engine’s Compiler API to enable users to practice sorting algorithms`,

  `Undergraduate Research Engineer\n
Pacific Research Platform\n\n
Developed real-time visualization of traceroutes between servers in 3D virtual space using NetBox and UE4.\n
Handled procedural generation of NetBox data and deployed applications with Docker and Kubernetes Clusters`,

  "USE YOUR                                        KEYS\n\n\n                TO MOVE AROUND",
];

if (!mobileVersion) {
  setInterval(function () {
    createCloud();
  }, 1200);
}
/**
 * Parent Function for Creating Objects for Scene
 */
function createObjects() {
  //createTest();

  if (debug) {
    createCube();
  } else {
    createAirplane();
  }

  createGroundPlane();
  createBillboards();
  createRings();
  createTrees();
  createRocks();
  createName();
  loadGLTFObject(
    "column1.glb",
    new Vector3(-6.1, 10, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(3, 5.7, 3)
  );
  loadGLTFObject(
    "column2.glb",
    new Vector3(0, 8, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(3, 4.7, 3)
  );
  loadGLTFObject(
    "column3.glb",
    new Vector3(6.1, 6, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(3, 3.5, 3)
  );
  loadGLTFObject(
    "linkedin.glb",
    new Vector3(-6.1, 25, -150),
    new Vector3(1, 1, 1),
    new Vector4(1, 0, 0, 1),
    new Vector3(1, 3, 1.4)
  );
  loadGLTFObject(
    "githubcat.glb",
    new Vector3(0, 22, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, 5, 0, 1),
    new Vector3(2, 2.2, 2)
  );
  loadGLTFObject(
    "mailbox.glb",
    new Vector3(6.1, 19, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1.5, 0, 1),
    new Vector3(1, 1, 1)
  );
  loadGLTFObject(
    "ramp.glb",
    new Vector3(0, 5, 12),
    new Vector3(1, 1, 1),
    new Vector4(0, 0, 0, 1),
    new Vector3(3.5, 1.5, 3)
  );
  loadGLTFObject(
    "hanger.glb",
    new Vector3(38, 12, 0),
    new Vector3(1, 1, 1),
    new Vector4(0, 0.1, 0, 1),
    new Vector3(7.5, 7.5, 7.5)
  );
  loadGLTFObject(
    "keys.glb",
    new Vector3(1.1, 1.2, 27),
    new Vector3(1, 1, 1),
    new Vector4(0, 1000, 0, 1),
    new Vector3(1, 1, 1)
  );
  
  var blocks = [
    { x: -42.5, y: 1, z: 0 },
    { x: -37.5, y: 1, z: 0 },
    { x: -32.5, y: 1, z: 0 },
    { x: -27.5, y: 1, z: 0 },
    { x: -40, y: 5, z: 0 },
    { x: -35, y: 5, z: 0 },
    { x: -30, y: 5, z: 0 },
    { x: -37.5, y: 10, z: 0 },
    { x: -32.5, y: 10, z: 0 },
    { x: -35, y: 13, z: 0 },
  ];

  blocks.forEach((pos) => {
    loadGLTFObject(
      "block.glb",
      new Vector3(pos.x, pos.y, pos.z),
      new Vector3(1, 1, 1),
      new Vector4(0, 1, 0, 1),
      new Vector3(1, 1, 1.5)
    );
  });
  
  loadGLTFObject(
    "experienceSign.glb",
    new Vector3(25, 10, -60),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(1.5, 6, 1.5)
  );
  loadGLTFObject(
    "playgroundSign.glb",
    new Vector3(-25, 10, -60),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(1.5, 6, 1.5)
  );

  createExperienceText(messages[0], 2);

  createExperienceText(messages[1], 3);

  createExperienceText(messages[2], 4);

  createExperienceText(messages[3], 5);

  createExperienceText(messages[4], -1.8);
}
/**
 * GLTF Loader initializes object into scene
 * @param {*} filename | name of 3D model file
 * @param {*} position | initial position to spawn
 * @param {*} scale | initial scale to spawn
 */
function loadGLTFObject(filename, position, scale, quat, scaleMult) {
  let mass = 3;

  const loader = new GLTFLoader().setPath("./models/");
  loader.load(filename, handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    // Get scene child from file
    var obj = gltf.scene.children[0];

    obj.position.set(position.x, position.y, position.z);

    scene.add(obj);

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    );
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    );
    let body = new Ammo.btRigidBody(rbInfo);

    physicsWorld.addRigidBody(body);

    obj.userData.physicsBody = body;
    rigidBodies.push(obj);
  }
  // Load progress
  function handleProgress(xhr) {
    console.log(filename + ": " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

/**
 * Creates Controlled Cube Player as Default on start
 */
function createCube() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color: Colors.brown });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 2, 5);

  cube.castShadow = true;
  scene.add(cube);

  plane = cube;
  airplaneControl = new THREE.PlayerControls(plane);
  animate();
}

/**
 * Creates Ground Plane
 */
function createGroundPlane() {
  let pos = { x: 0, y: -1, z: 0 };
  let scale = { x: 2000, y: 2, z: 2000 };
  let quat = { x: 0, y: 0, z: 0, w: 1 };
  let mass = 0;

  const geometry = new THREE.BoxBufferGeometry();
  const material = new THREE.MeshPhongMaterial({
    color: Colors.orange,
    side: THREE.DoubleSide,
  });
  groundPlane = new THREE.Mesh(geometry, material);

  groundPlane.scale.set(scale.x, scale.y, scale.z);
  groundPlane.position.set(pos.x, pos.y, pos.z);

  groundPlane.receiveShadow = true;

  scene.add(groundPlane);

  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btBoxShape(
    new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
  );
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    colShape,
    localInertia
  );
  let body = new Ammo.btRigidBody(rbInfo);
  body.setFriction(4);
  body.setRollingFriction(10);
  physicsWorld.addRigidBody(body);
}

function createExperienceText(message, offset) {
  const loader = new THREE.FontLoader();
  loader.load("fonts/helvetiker_bold.typeface.json", function (font) {
    const color = Colors.white;

    // Solid Text
    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });

    const textSize = 0.6;
    const shapes = font.generateShapes(message, textSize);

    const geometry = new THREE.ShapeBufferGeometry(shapes);

    geometry.computeBoundingBox();

    // Center text
    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);

    const text = new THREE.Mesh(geometry, matLite);

    // Rotate to match plane, translate
    text.rotation.x = -Math.PI / 2;
    text.position.set(0, 0.01, -15 * offset);

    scene.add(text);
  }); //end load function
}

/**
 * Loads GLTF/GLB airplane files from Blender
 */
function createAirplane() {
  const loader = new GLTFLoader().setPath("./models/");
  loader.load("airplane.glb", handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    // Load Propeller Spin Animation with Mixer
    mixer = new THREE.AnimationMixer(gltf.scene);
    var action = mixer.clipAction(gltf.animations[1]);
    action.play();

    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    let pos = { x: 0, y: 1, z: 35 };
    let scale = { x: 1, y: 1, z: 1 };
    let scaleMult = { x: 1.5, y: 2, z: 2.5 };
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 1;

    // Get scene child from file
    plane = gltf.scene.children[0];
    scene.add(plane);
    plane.position.set(pos.x, pos.y, pos.z);

    airplaneControl = new THREE.PlayerControls(plane);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    );
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    );
    let body = new Ammo.btRigidBody(rbInfo);

    body.setFriction(4);
    body.setRollingFriction(10);

    body.setActivationState(STATE.DISABLE_DEACTIVATION);
    body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);

    physicsWorld.addRigidBody(body);
    plane.userData.physicsBody = body;

    // Begin Animation
    animate();
  }

  // Load progress
  function handleProgress(xhr) {
    console.log("Airplane: " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

/**
 * Loads GLTF/GLB ramp files from Blender
 */
function createName() {
  const loader = new GLTFLoader().setPath("./models/");
  loader.load("name.glb", handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    let pos = { x: -15, y: 3, z: 0 };
    let scale = { x: 1, y: 1, z: 1 };
    let scaleMult = { x: 1.3, y: 1, z: 1.5 };
    let quat = { x: 1, y: 0.1, z: 0, w: 1 };
    let mass = 2;

    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    for (var i = 0; i < 5; i++) {
      var letter = gltf.scene.children[0];
      letter.position.set(pos.x, pos.y, pos.z);
      scene.add(letter);

      pos.x += 3.0;

      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      );
      let motionState = new Ammo.btDefaultMotionState(transform);

      let colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(
          scale.x * scaleMult.x,
          scale.y * scaleMult.y,
          scale.z * scaleMult.z
        )
      );
      colShape.setMargin(0.05);

      let localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(mass, localInertia);

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      );
      let body = new Ammo.btRigidBody(rbInfo);

      physicsWorld.addRigidBody(body);

      letter.userData.physicsBody = body;
      rigidBodies.push(letter);
    }

    pos.x += 3.0;

    for (var i = 0; i < 3; i++) {
      var letter = gltf.scene.children[0];
      letter.position.set(pos.x, pos.y, pos.z);
      scene.add(letter);

      pos.x += 2.0;

      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      );
      let motionState = new Ammo.btDefaultMotionState(transform);

      let colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(
          scale.x * scaleMult.x,
          scale.y * scaleMult.y,
          scale.z * scaleMult.z
        )
      );
      colShape.setMargin(0.05);

      let localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(mass, localInertia);

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      );
      let body = new Ammo.btRigidBody(rbInfo);

      physicsWorld.addRigidBody(body);

      letter.userData.physicsBody = body;
      rigidBodies.push(letter);
    }
  }

  // Load progress
  function handleProgress(xhr) {
    console.log("Name: " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

/**
 * Loads GLTF/GLB billboard files from Blender
 */
function createBillboards() {
  const loader = new GLTFLoader().setPath("./models/");
  loader.load("billboard2.glb", handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    let pos = { x: -34, y: 8, z: -31.7 };
    let scale = { x: 14, y: 15, z: 1 };
    let quat = { x: 0, y: 0.14, z: 0, w: 1 };
    let mass = 10;

    // Get scene child from file
    billboard = gltf.scene.children[0];

    var pointIntensity = 4;
    var billboardPointLight1 = new THREE.PointLight(
      Colors.white,
      pointIntensity,
      10,
      2
    );
    billboardPointLight1.position.set(pos.x, pos.y + 2, pos.z + 5);
    billboardPointLight1.parent = billboard;

    billboard.position.set(pos.x, pos.y, pos.z);

    scene.add(billboard);
    scene.add(billboardPointLight1);

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(scale.x * 0.5, scale.y * 0.55, scale.z * 0.5)
    );
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    );
    let body = new Ammo.btRigidBody(rbInfo);

    physicsWorld.addRigidBody(body);

    billboard.userData.physicsBody = body;
    rigidBodies.push(billboard);
    createImages();

  }

  // Load progress
  function handleProgress(xhr) {
    console.log("Billboard: " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

/**
 * Loads GLTF/GLB ring files from Blender
 */
function createRings() {
  const loader = new GLTFLoader().setPath("./models/");
  loader.load("ring.glb", handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    // Get scene child from file
    for (let i = 0; i < 5; i++) {
      var ring = gltf.scene.children[0].clone();
      rings.push(ring);
      scene.add(rings[i]);
    }

    rings[0].position.set(10, 10, -30);
    rings[1].position.set(-5, 10, -60);
    rings[2].position.set(5, 10, -90);
    rings[3].position.set(-5, 10, -120);
    rings[4].position.set(5, 10, -140);
  }

  // Load progress
  function handleProgress(xhr) {
    console.log("Rings: " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

/**
 * Loads GLTF/GLB ring files from Blender
 */
function createTrees() {
  const loader = new GLTFLoader().setPath("./models/");
  loader.load("lowpoly_tree.glb", handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    var positions = [
      { x: 25, y: 8, z: -40 },
      { x: -25, y: 10, z: -70 },
      { x: 25, y: 12, z: -90 },
      { x: -25, y: 14, z: -120 },
      { x: 25, y: 16, z: -150 },
    ];
    let scale = { x: 9, y: 12.5, z: 9 };
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 1;

    // Get scene child from file
    for (let i = 0; i < 5; i++) {
      var tree = gltf.scene.children[0].clone();
      trees.push(tree);
      scene.add(trees[i]);
      let pos = positions[i];
      trees[i].position.set(pos.x, pos.y, pos.z);

      // Ammojs Section

      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      );
      let motionState = new Ammo.btDefaultMotionState(transform);

      let colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(scale.x * 0.5, scale.y * 0.4, scale.z * 0.5)
      );
      colShape.setMargin(0.05);

      let localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(mass, localInertia);

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      );
      let body = new Ammo.btRigidBody(rbInfo);

      physicsWorld.addRigidBody(body);

      trees[i].userData.physicsBody = body;
      rigidBodies.push(trees[i]);
    }
  }

  // Load progress
  function handleProgress(xhr) {
    console.log("Trees: " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

/**
 * Loads GLTF/GLB rocks files from Blender
 */
function createRocks() {
  const loader = new GLTFLoader().setPath("./models/");
  loader.load("lowpoly_rock.glb", handleLoad, handleProgress);

  // Load completion
  function handleLoad(gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    var positions = [
      { x: 15, y: 0.2, z: 0 },
      { x: -25, y: 0.2, z: -20 },
      { x: 30, y: 0.2, z: -23 },
      { x: -37, y: 0.2, z: -50 },
      { x: -10, y: 0.2, z: 15 },
    ];
    let scale = { x: 1.1, y: 0.7, z: 1.1 };
    let quat = { x: 0, y: 0, z: 0, w: 1 };
    let mass = 1;

    // Get scene child from file
    for (let i = 0; i < 5; i++) {
      var rock = gltf.scene.children[0].clone();
      rocks.push(rock);
      scene.add(rocks[i]);

      let pos = positions[i];

      rocks[i].position.set(pos.x, pos.y, pos.z);

      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      );
      let motionState = new Ammo.btDefaultMotionState(transform);

      let colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(scale.x, scale.y, scale.z)
      );
      colShape.setMargin(0.05);

      let localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(mass, localInertia);

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      );
      let body = new Ammo.btRigidBody(rbInfo);
      physicsWorld.addRigidBody(body);
      rocks[i].userData.physicsBody = body;
      rigidBodies.push(rocks[i]);
    }
  }

  // Load progress
  function handleProgress(xhr) {
    console.log("Rocks: " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
}

function createCloud() {
  // Create an empty container that will hold the different parts of the cloud
  var mesh = new THREE.Object3D();
  // create a cube geometry;
  // this shape will be duplicated to create the cloud
  var geom = new THREE.BoxGeometry(20, 20, 20);

  // create a material; a simple white material will do the trick
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.softwhite,
  });

  // duplicate the geometry a random number of times
  var nBlocs = 10 + Math.floor(Math.random() * 3);
  for (var i = 0; i < nBlocs; i++) {
    // create the mesh by cloning the geometry
    var m = new THREE.Mesh(geom, mat);

    // set the position and the rotation of each cube randomly
    m.position.x = -5 + Math.random() * 10;
    m.position.y = 20;
    m.position.z = -5 + Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    // set the size of the cube randomly
    var s = 0.01 + Math.random() * 0.1;
    m.scale.set(s, s, s);

    // allow each cube to cast and to receive shadows
    m.castShadow = true;

    // add the cube to the container we first created
    mesh.add(m);
  }

  scene.add(mesh);
  mesh.position.x = -100 + Math.random();
  mesh.position.y = 20;
  mesh.position.z = Math.random() * -200;
  cloud.push(mesh);
}

/**
 * Handles creations of 2D images into scene
 */
function createImages() {
  // Create a texture loader so we can load our image file
  var loader = new THREE.TextureLoader();

  // Load an image file into a custom material
  var material = new THREE.MeshLambertMaterial({
    map: loader.load("./vendor/img/PRP_logo.jpg"),
  });

  // create a plane geometry for the image with a width of 10
  // and a height that preserves the image's aspect ratio
  var geometry = new THREE.PlaneGeometry(10, 10 * 0.75);

  // combine our image geometry and material into a mesh
  var mesh = new THREE.Mesh(geometry, material);

  // set the position of the image mesh in the x,y,z dimensions
  mesh.position.set(-0.1,2,0.53);
  mesh.rotation.y = 0;
  mesh.scale.x = 1.23;
  // add the image to the scene
  scene.add(mesh);

  mesh.parent = billboard;
}

export {
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
};
