import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
import {
  animate,
  scene,
  physicsWorld,
  rigidBodies,
  Colors,
  debug,
  mobileVersion
} from './index.js'
import { Vector3, Vector4 } from './build/three.module.js'
import { FirstPersonControls } from './jsm/controls/FirstPersonControls.js'

const STATE = { DISABLE_DEACTIVATION: 4 }
const FLAGS = { CF_KINEMATIC_OBJECT: 2 }

// Active Player Objects
var player, cube, plane, plane2, golfCart

// Animation Variables
var mixer, golfcartMixer, plane2mixer

// Controllers
var airplaneControl, golfCartControl

// Static Objects
var staticGolfCart, groundPlane, billboard

const rings = [],
  trees = [],
  rocks = [],
  cloud = []

// 2D Scene
var bowlingLine, golfballLine, sortingVisulizerLine

// 2D Text
const messages = [
  `Software Development Engineer\n
Amazon\n\n
Incoming 2021 SDE in the Greater Seattle Area`,

  `Undergraduate Research Engineer\n
Pacific Research Platform\n\n
Developed real-time visualization of traceroutes between \nservers in 3D virtual space using NetBox and UE4.\n
Handled procedural generation of NetBox data and deployed\napplications with Docker and Kubernetes Clusters`,

  `Online Private Instructor\n
iD Tech Camps\n\n
Instructed 150+ lessons to K-12 students\non Python, Java, Scratch, and JavaScript\n
Designed unique curriculums to accommodate\nstudents’ individual needs and interests\n
Leveraged Full Stack Development to help\nstudents deploy web applications and games`,

  `SortingVisualizer\n
JavaScript Web Application\n\n
Developed a web application using JavaScript, HTML, CSS to\nvisually sort data using various sorting algorithms\n
Implemented Merge Sort, Insertion Sort, Bubble Sort, Selection Sort\n
Integrated a code executor using Sphere Engine’s Compiler API\nto enable users to practice sorting algorithms`,

  `Software Engineer Intern \n
UpperLine Code\n\n
Developed computer science projects using\nJavaScript, HTML and CSS designed for student education\nWD
Maintained Git repo and Amazon Web Services\nfor building and debugging course exercises`,

  `USE YOUR                                        KEYS\n\n\n                TO MOVE AROUND\n
Q - TILT UP\n
E - TILT DOWN\n
SHIFT - BOOST\n`
]

if (!mobileVersion) {
  setInterval(function () {
    createCloud()
  }, 1200)
}

/**
 * Parent Function for Creating Objects for Scene
 */
function createObjects () {
  if (debug) {
    createCube()
  } else {
    createAirplane()
    createAirplane2()
    createStaticGolfCart()
  }

  createGroundPlane()
  createGolfCart()
  createRings()
  createTrees()
  createRocks()
  createName()

  // Billboards
  createBillboard(
    './vendor/img/amazon.png',
    new Vector3(55, 8, -60),
    new Vector3(14, 15, 1),
    new Vector4(0, 0, 0, 1)
  )
  createBillboard(
    './vendor/img/PRP_logo.jpg',
    new Vector3(85, 8, -60),
    new Vector3(14, 15, 1),
    new Vector4(0, 0, 0, 1)
  )
  createBillboard(
    './vendor/img/idtech_logo.jpg',
    new Vector3(115, 8, -60),
    new Vector3(14, 15, 1),
    new Vector4(0, 0, 0, 1)
  )
  createBillboard(
    './vendor/img/sortingvisualizer.png',
    new Vector3(145, 8, -60),
    new Vector3(14, 15, 1),
    new Vector4(0, 0, 0, 1)
  )
  createBillboard(
    './vendor/img/upperline_logo.png',
    new Vector3(175, 8, -60),
    new Vector3(14, 15, 1),
    new Vector4(0, 0, 0, 1)
  )

  // Columns
  loadGLTFObject(
    'column1.glb',
    new Vector3(-6.1, 10, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(3, 5.7, 3)
  )
  loadGLTFObject(
    'column2.glb',
    new Vector3(0, 8, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(3, 4.7, 3)
  )
  loadGLTFObject(
    'column3.glb',
    new Vector3(6.1, 6, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(3, 3.5, 3)
  )

  // Column Objects
  loadGLTFObject(
    'linkedin.glb',
    new Vector3(-6.1, 25, -150),
    new Vector3(1, 1, 1),
    new Vector4(1, 0, 0, 1),
    new Vector3(1, 3, 1.4)
  )
  loadGLTFObject(
    'githubcat.glb',
    new Vector3(0, 22, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, 5, 0, 1),
    new Vector3(2, 2.2, 2)
  )
  loadGLTFObject(
    'mailbox.glb',
    new Vector3(6.1, 19, -150),
    new Vector3(1, 1, 1),
    new Vector4(0, -1.5, 0, 1),
    new Vector3(1, 1, 1)
  )

  // Single Objects
  loadGLTFObject(
    'ramp.glb',
    new Vector3(0, 5, 12),
    new Vector3(1, 1, 1),
    new Vector4(0, 0, 0, 1),
    new Vector3(3.5, 1.5, 3)
  )
  loadGLTFObject(
    'hanger.glb',
    new Vector3(38, 12, 0),
    new Vector3(1, 1, 1),
    new Vector4(0, 0.1, 0, 1),
    new Vector3(7.5, 7.5, 7.5)
  )
  loadGLTFObject(
    'keys.glb',
    new Vector3(1.1, 1.2, 27),
    new Vector3(1, 1, 1),
    new Vector4(0, 1000, 0, 1),
    new Vector3(2, 1, 2.5)
  )
  loadGLTFObject(
    'experienceSign.glb',
    new Vector3(25, 10, -60),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(1.5, 6, 1.5)
  )
  loadGLTFObject(
    'playgroundSign.glb',
    new Vector3(-25, 10, -60),
    new Vector3(1, 1, 1),
    new Vector4(0, -1, 0, 1),
    new Vector3(1.5, 6, 1.5)
  )

  // Block Walls
  const blocks = [
    // Set #1
    { x: -132.5, y: 1, z: 0 },
    { x: -127.5, y: 1, z: 0 },
    { x: -122.5, y: 1, z: 0 },
    { x: -117.5, y: 1, z: 0 },
    { x: -130, y: 5, z: 0 },
    { x: -125, y: 5, z: 0 },
    { x: -120, y: 5, z: 0 },
    { x: -127.5, y: 10, z: 0 },
    { x: -122.5, y: 10, z: 0 },
    { x: -125, y: 13, z: 0 },

    // Set #2
    { x: -132.5, y: 1, z: -15 },
    { x: -129.5, y: 1, z: -15 },
    { x: -126.5, y: 1, z: -15 },
    { x: -123.5, y: 1, z: -15 },
    { x: -120.5, y: 1, z: -15 },
    { x: -117.5, y: 1, z: -15 },

    { x: -131, y: 3, z: -15 },
    { x: -128, y: 3, z: -15 },
    { x: -125, y: 3, z: -15 },
    { x: -122, y: 3, z: -15 },
    { x: -119, y: 3, z: -15 },

    { x: -132.5, y: 6, z: -15 },
    { x: -129.5, y: 6, z: -15 },
    { x: -126.5, y: 6, z: -15 },
    { x: -123.5, y: 6, z: -15 },
    { x: -120.5, y: 6, z: -15 },
    { x: -117.5, y: 6, z: -15 },

    { x: -131, y: 8, z: -15 },
    { x: -128, y: 8, z: -15 },
    { x: -125, y: 8, z: -15 },
    { x: -122, y: 8, z: -15 },
    { x: -119, y: 8, z: -15 },

    // Set #3
    { x: -132.5, y: 1, z: -30 },
    { x: -129.5, y: 1, z: -30 },
    { x: -126.5, y: 1, z: -30 },
    { x: -123.5, y: 1, z: -30 },
    { x: -120.5, y: 1, z: -30 },
    { x: -117.5, y: 1, z: -30 },

    { x: -132.5, y: 4, z: -30 },
    { x: -129.5, y: 4, z: -30 },
    { x: -126.5, y: 4, z: -30 },
    { x: -123.5, y: 4, z: -30 },
    { x: -120.5, y: 4, z: -30 },
    { x: -117.5, y: 4, z: -30 },

    { x: -132.5, y: 7, z: -30 },
    { x: -129.5, y: 7, z: -30 },
    { x: -126.5, y: 7, z: -30 },
    { x: -123.5, y: 7, z: -30 },
    { x: -120.5, y: 7, z: -30 },
    { x: -117.5, y: 7, z: -30 },

    { x: -132.5, y: 10, z: -30 },
    { x: -129.5, y: 10, z: -30 },
    { x: -126.5, y: 10, z: -30 },
    { x: -123.5, y: 10, z: -30 },
    { x: -120.5, y: 10, z: -30 },
    { x: -117.5, y: 10, z: -30 }
  ]

  blocks.forEach(pos => {
    loadGLTFObject(
      'block.glb',
      new Vector3(pos.x, pos.y, pos.z),
      new Vector3(1, 1, 1),
      new Vector4(0, 1, 0, 1),
      new Vector3(1, 1, 1.5)
    )
  })

  // Bowling Objects
  const pins = [
    { x: -80, y: 1, z: -50 },

    { x: -82, y: 1, z: -52 },
    { x: -78, y: 1, z: -52 },

    { x: -84, y: 1, z: -54 },
    { x: -76, y: 1, z: -54 },
    { x: -80, y: 1, z: -54 },

    { x: -82, y: 1, z: -56 },
    { x: -78, y: 1, z: -56 },
    { x: -86, y: 1, z: -56 },
    { x: -74, y: 1, z: -56 }
  ]

  pins.forEach(pos => {
    loadGLTFObject(
      'bowlingpin.glb',
      new Vector3(pos.x, pos.y, pos.z),
      new Vector3(1, 2, 1),
      new Vector4(0, 1, 0, 1),
      new Vector3(0.8, 1.5, 0.8),
      1
    )
  })

  loadGLTFObjectSphereBowling(
    'bowlingball.glb',
    new Vector3(-80, 8, -10),
    1.5,
    new Vector4(0, -1, 0, 1)
  )

  // Golf Objects
  loadGLTFObject(
    'golfflag.glb',
    new Vector3(180, 4, -20),
    new Vector3(1, 1, 1),
    new Vector4(0, 1, 0, 1),
    new Vector3(0.5, 4, 0.5)
  )

  loadGLTFObjectSphere(
    'golfball.glb',
    new Vector3(170, 3, -20),
    0.75,
    new Vector4(0, 0, 0, 1)
  )

  // Reset Areas with Text
  createResetAreaBowling(
    new Vector3(-90, 0, -5),
    new Vector3(-70, 0, -5),
    new Vector3(-70, 0, 5),
    new Vector3(-90, 0, 5)
  )
  createExperienceText('Enter', new Vector3(-80, 0.01, 0))

  createResetAreaGolf(
    new Vector3(160, 0, -10),
    new Vector3(170, 0, -10),
    new Vector3(170, 0, -5),
    new Vector3(160, 0, -5)
  )
  createExperienceText('Enter', new Vector3(165, 0.01, -7.5))

  // PRP
  createLinks(
    new Vector3(80, 0, -40),
    new Vector3(90, 0, -40),
    new Vector3(90, 0, -35),
    new Vector3(80, 0, -35)
  )
  createExperienceText('Enter', new Vector3(85, 0.01, -37.5))

  // idTech
  createLinks(
    new Vector3(110, 0, -40),
    new Vector3(120, 0, -40),
    new Vector3(120, 0, -35),
    new Vector3(110, 0, -35)
  )
  createExperienceText('Enter', new Vector3(115, 0.01, -37.5))

  // Sorting Visualizer
  createLinks(
    new Vector3(140, 0, -40),
    new Vector3(150, 0, -40),
    new Vector3(150, 0, -35),
    new Vector3(140, 0, -35)
  )
  createExperienceText('Enter', new Vector3(145, 0.01, -37.5))

  // Upperline Code
  createLinks(
    new Vector3(170, 0, -40),
    new Vector3(180, 0, -40),
    new Vector3(180, 0, -35),
    new Vector3(170, 0, -35)
  )
  createExperienceText('Enter', new Vector3(175, 0.01, -37.5))

  // Linkedin
  createLinks(
    new Vector3(-10, 0, -145),
    new Vector3(-5, 0, -145),
    new Vector3(-5, 0, -140),
    new Vector3(-10, 0, -140)
  )
  createExperienceText('Enter', new Vector3(-7.5, 0.01, -142.5))

  // Github
  createLinks(
    new Vector3(-2.5, 0, -145),
    new Vector3(2.5, 0, -145),
    new Vector3(2.5, 0, -140),
    new Vector3(-2.5, 0, -140)
  )
  createExperienceText('Enter', new Vector3(0, 0.01, -142.5))

  // Email
  createLinks(
    new Vector3(5, 0, -145),
    new Vector3(10, 0, -145),
    new Vector3(10, 0, -140),
    new Vector3(5, 0, -140)
  )

  createExperienceText('Enter', new Vector3(7.5, 0.01, -142.5))

  createExperienceText(messages[0], new Vector3(60, 0.01, -55))

  createExperienceText(messages[1], new Vector3(90, 0.01, -55))

  createExperienceText(messages[2], new Vector3(120, 0.01, -55))

  createExperienceText(messages[3], new Vector3(150, 0.01, -55))

  createExperienceText(messages[4], new Vector3(180, 0.01, -55))

  createExperienceText(messages[5], new Vector3(0, 0.01, 27))
}

/**
 * GLTF Loader initializes object into scene
 * @param {*} filename | name of 3D model file
 * @param {*} position | initial position to spawn
 * @param {*} scale | initial scale to spawn
 */
function loadGLTFObject (filename, position, scale, quat, scaleMult, mass = 3) {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load(filename, handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    // Get scene child from file
    const obj = gltf.scene.children[0]

    obj.position.set(position.x, position.y, position.z)

    scene.add(obj)

    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    )
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    physicsWorld.addRigidBody(body)

    obj.userData.physicsBody = body
    rigidBodies.push(obj)
  }
  // Load progress
  function handleProgress (xhr) {
    console.log(filename + ': ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * GLTF Loader initializes object into scene
 * @param {*} filename | name of 3D model file
 * @param {*} position | initial position to spawn
 * @param {*} scale | initial scale to spawn
 */
function loadGLTFObjectSphere (filename, position, radius, quat) {
  const mass = 3

  const loader = new GLTFLoader().setPath('./models/')
  loader.load(filename, handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    // Get scene child from file
    const obj = gltf.scene.children[0]

    obj.position.set(position.x, position.y, position.z)

    scene.add(obj)

    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btSphereShape(radius)
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    physicsWorld.addRigidBody(body)

    obj.userData.physicsBody = body
    rigidBodies.push(obj)
  }
  // Load progress
  function handleProgress (xhr) {
    console.log(filename + ': ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}
function loadGLTFObjectSphereBowling (filename, position, radius, quat) {
  const mass = 3

  const loader = new GLTFLoader().setPath('./models/')
  loader.load(filename, handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    // Get scene child from file
    const obj = gltf.scene.children[0]

    obj.position.set(position.x, position.y, position.z)

    scene.add(obj)

    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btSphereShape(radius)
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    physicsWorld.addRigidBody(body)

    obj.userData.physicsBody = body
    rigidBodies.push(obj)
  }
  // Load progress
  function handleProgress (xhr) {
    console.log(filename + ': ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}
/**
 * Creates Controlled Cube Player as Default on start
 */
function createCube () {
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshLambertMaterial({ color: Colors.brown })
  cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 2, 5)

  cube.castShadow = true
  scene.add(cube)

  plane = cube
  airplaneControl = new THREE.PlayerControls(plane)
  animate()
}

/**
 * Creates Ground Plane
 */
function createGroundPlane () {
  const pos = { x: 0, y: -1, z: 0 }
  const scale = { x: 2000, y: 2, z: 2000 }
  const quat = { x: 0, y: 0, z: 0, w: 1 }
  const mass = 0

  const geometry = new THREE.BoxBufferGeometry()
  const material = new THREE.MeshPhongMaterial({
    color: Colors.orange,
    side: THREE.DoubleSide
  })
  groundPlane = new THREE.Mesh(geometry, material)

  groundPlane.scale.set(scale.x, scale.y, scale.z)
  groundPlane.position.set(pos.x, pos.y, pos.z)

  groundPlane.receiveShadow = true

  scene.add(groundPlane)

  const transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
  const motionState = new Ammo.btDefaultMotionState(transform)

  const colShape = new Ammo.btBoxShape(
    new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
  )
  colShape.setMargin(0.05)

  const localInertia = new Ammo.btVector3(0, 0, 0)
  colShape.calculateLocalInertia(mass, localInertia)

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    colShape,
    localInertia
  )
  const body = new Ammo.btRigidBody(rbInfo)
  body.setFriction(4)
  body.setRollingFriction(10)
  groundPlane.userData.physicsBody = body

  physicsWorld.addRigidBody(body)
}

function createExperienceText (message, position) {
  const loader = new THREE.FontLoader()
  loader.load('fonts/helvetiker_bold.typeface.json', function (font) {
    const color = Colors.white

    // Solid Text
    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    })

    const textSize = 0.6
    const shapes = font.generateShapes(message, textSize)

    const geometry = new THREE.ShapeBufferGeometry(shapes)

    geometry.computeBoundingBox()

    // Center text
    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
    geometry.translate(xMid, 0, 0)

    const text = new THREE.Mesh(geometry, matLite)

    // Rotate to match plane, translate
    text.rotation.x = -Math.PI / 2
    text.position.set(position.x, position.y, position.z)

    scene.add(text)
  }) //end load function
}

/**
 * Loads GLTF/GLB airplane files from Blender
 */
function createAirplane () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('airplane.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Load Propeller Spin Animation with Mixer
    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[1])
    action.play()

    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const pos = { x: 0, y: 2, z: 45 }
    const scale = { x: 1, y: 1, z: 1 }
    const scaleMult = { x: 1.5, y: 2, z: 2.5 }
    const quat = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 2

    // Get scene child from file
    plane = gltf.scene.children[0]
    scene.add(plane)
    plane.position.set(pos.x, pos.y, pos.z)

    airplaneControl = new THREE.PlayerControls(plane)

    //Ammojs Section
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    )
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    body.setFriction(4)
    body.setRollingFriction(10)

    body.setActivationState(STATE.DISABLE_DEACTIVATION)
    body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT)

    physicsWorld.addRigidBody(body)
    plane.userData.physicsBody = body
    player = plane

    // Begin Animation
    animate()
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Airplane: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB airplane files from Blender
 */
function createAirplane2 () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('airplane2.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Load Propeller Spin Animation with Mixer
    plane2mixer = new THREE.AnimationMixer(gltf.scene)
    const action = plane2mixer.clipAction(gltf.animations[0])
    action.play()

    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const pos = { x: 10, y: 2, z: 45 }
    const scale = { x: 1, y: 1, z: 1 }
    const scaleMult = { x: 1.5, y: 2, z: 2.5 }
    const quat = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 2

    // Get scene child from file
    plane2 = gltf.scene.children[0]
    scene.add(plane2)
    plane2.position.set(pos.x, pos.y, pos.z)

    //airplaneControl = new THREE.PlayerControls(plane);

    //Ammojs Section
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    )
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    body.setFriction(4)
    body.setRollingFriction(10)

    body.setActivationState(STATE.DISABLE_DEACTIVATION)
    body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT)

    physicsWorld.addRigidBody(body)
    plane2.userData.physicsBody = body
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Airplane2: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB airplane files from Blender
 */
function createGolfCart () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('golfcart.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    golfcartMixer = new THREE.AnimationMixer(gltf.scene)

    const clips = gltf.animations
    clips.forEach(function (clip) {
      golfcartMixer.clipAction(clip).play()
    })

    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const pos = { x: 100, y: 0, z: -10 }
    const scale = { x: 1, y: 1, z: 1 }
    const scaleMult = { x: 2, y: 2.5, z: 3.2 }
    const quat = { x: 0, y: 1, z: 0, w: 1 }
    const mass = 1

    // Get scene child from file
    golfCart = gltf.scene.children[0]
    scene.add(golfCart)
    golfCart.position.set(pos.x, pos.y, pos.z)
    //Ammojs Section
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    )
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    physicsWorld.addRigidBody(body)
    golfCart.userData.physicsBody = body
    rigidBodies.push(golfCart)
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Golfcart: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB airplane files from Blender
 */
function createStaticGolfCart () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('golfcart.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const pos = { x: 100, y: 0, z: -10 }
    const scale = { x: 1, y: 1, z: 1 }
    const scaleMult = { x: 2, y: 2.5, z: 3.2 }
    const quat = { x: 0, y: 1, z: 0, w: 1 }
    const mass = 1

    // Get scene child from file
    staticGolfCart = gltf.scene.children[0]
    scene.add(staticGolfCart)
    staticGolfCart.position.set(pos.x, pos.y, pos.z)

    golfCartControl = new FirstPersonControls(staticGolfCart)

    //Ammojs Section
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(
        scale.x * scaleMult.x,
        scale.y * scaleMult.y,
        scale.z * scaleMult.z
      )
    )
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    physicsWorld.addRigidBody(body)
    staticGolfCart.userData.physicsBody = body
    rigidBodies.push(staticGolfCart)
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Golfcart: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}
/**
 * Loads GLTF/GLB ramp files from Blender
 */
function createName () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('name.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    const pos = { x: -15, y: 3, z: 0 }
    const scale = { x: 1, y: 1, z: 1 }
    const scaleMult = { x: 1.3, y: 1, z: 1.5 }
    const quat = { x: 1, y: 0.1, z: 0, w: 1 }
    const mass = 2

    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    for (let i = 0; i < 5; i++) {
      const letter = gltf.scene.children[0]
      letter.position.set(pos.x, pos.y, pos.z)
      scene.add(letter)

      pos.x += 3.0

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      )
      const motionState = new Ammo.btDefaultMotionState(transform)

      const colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(
          scale.x * scaleMult.x,
          scale.y * scaleMult.y,
          scale.z * scaleMult.z
        )
      )
      colShape.setMargin(0.05)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      colShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      )
      const body = new Ammo.btRigidBody(rbInfo)

      physicsWorld.addRigidBody(body)

      letter.userData.physicsBody = body
      rigidBodies.push(letter)
    }

    pos.x += 3.0

    for (let i = 0; i < 3; i++) {
      const letter = gltf.scene.children[0]
      letter.position.set(pos.x, pos.y, pos.z)
      scene.add(letter)

      pos.x += 2.0

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      )
      const motionState = new Ammo.btDefaultMotionState(transform)

      const colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(
          scale.x * scaleMult.x,
          scale.y * scaleMult.y,
          scale.z * scaleMult.z
        )
      )
      colShape.setMargin(0.05)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      colShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      )
      const body = new Ammo.btRigidBody(rbInfo)

      physicsWorld.addRigidBody(body)

      letter.userData.physicsBody = body
      rigidBodies.push(letter)
    }
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Name: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB billboard files from Blender
 */
function createBillboard (imageFileName, pos, scale, quat) {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('billboard3.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const mass = 10

    // Get scene child from file
    billboard = gltf.scene.children[0]

    const pointIntensity = 4
    const billboardPointLight1 = new THREE.PointLight(
      Colors.white,
      pointIntensity,
      10,
      2
    )
    billboardPointLight1.position.set(pos.x, pos.y + 2, pos.z + 5)
    billboardPointLight1.parent = billboard

    billboard.position.set(pos.x, pos.y, pos.z)

    scene.add(billboard)
    scene.add(billboardPointLight1)

    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
    const motionState = new Ammo.btDefaultMotionState(transform)

    const colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(scale.x * 0.5, scale.y * 0.55, scale.z * 0.5)
    )
    colShape.setMargin(0.05)

    const localInertia = new Ammo.btVector3(0, 0, 0)
    colShape.calculateLocalInertia(mass, localInertia)

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      colShape,
      localInertia
    )
    const body = new Ammo.btRigidBody(rbInfo)

    physicsWorld.addRigidBody(body)

    billboard.userData.physicsBody = body
    rigidBodies.push(billboard)

    const image = createImages(imageFileName)
    image.parent = billboard
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Billboard: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB ring files from Blender
 */
function createRings () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('rings.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Get scene child from file
    for (let i = 0; i < 5; i++) {
      const ring = gltf.scene.children[0].clone()
      rings.push(ring)
      scene.add(rings[i])
    }

    rings[0].position.set(10, 10, -30)
    rings[1].position.set(-5, 10, -60)
    rings[2].position.set(5, 10, -90)
    rings[3].position.set(-5, 10, -120)
    rings[4].position.set(5, 10, -140)
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Rings: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB ring files from Blender
 */
function createTrees () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('lowpoly_tree.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const positions = [
      { x: 70, y: 6, z: 10 },
      { x: -50, y: 6, z: 10 },
      { x: 120, y: 7, z: -5 },
      { x: -40, y: 7, z: -40 },
      { x: 70, y: 12, z: -80 },
      { x: 150, y: 12, z: -90 },
      { x: -50, y: 13, z: -100 },

      { x: 25, y: 8, z: -50 },
      { x: -25, y: 10, z: -70 },
      { x: 25, y: 12, z: -90 },
      { x: -25, y: 14, z: -120 },
      { x: 25, y: 16, z: -150 }
    ]

    const mass = 100

    // Get scene child from file
    for (let i = 0; i < positions.length; i++) {
      const scale = { x: 9, y: 12.5, z: 9 }
      const quat = { x: 0, y: Math.random() * 3, z: 0, w: 1 }

      const tree = gltf.scene.children[0].clone()
      trees.push(tree)
      scene.add(trees[i])
      const pos = positions[i]
      trees[i].position.set(pos.x, pos.y, pos.z)

      // Ammojs Section

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      )
      const motionState = new Ammo.btDefaultMotionState(transform)

      const colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(scale.x * 0.5, scale.y * 0.4, scale.z * 0.5)
      )
      colShape.setMargin(0.05)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      colShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      )
      const body = new Ammo.btRigidBody(rbInfo)

      physicsWorld.addRigidBody(body)

      trees[i].userData.physicsBody = body
      rigidBodies.push(trees[i])
    }
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Trees: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

/**
 * Loads GLTF/GLB rocks files from Blender
 */
function createRocks () {
  const loader = new GLTFLoader().setPath('./models/')
  loader.load('lowpoly_rock.glb', handleLoad, handleProgress)

  // Load completion
  function handleLoad (gltf) {
    // Enable Shadows for loaded objects children
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true
      }
    })

    const positions = [
      { x: 15, y: 0.2, z: 0 },
      { x: -25, y: 0.2, z: -20 },
      { x: 30, y: 0.2, z: -23 },
      { x: -37, y: 0.2, z: -50 },
      { x: -10, y: 0.2, z: 15 }
    ]
    const scale = { x: 1.1, y: 0.7, z: 1.1 }
    const quat = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 1

    // Get scene child from file
    for (let i = 0; i < 5; i++) {
      const rock = gltf.scene.children[0].clone()
      rocks.push(rock)
      scene.add(rocks[i])

      const pos = positions[i]

      rocks[i].position.set(pos.x, pos.y, pos.z)

      const transform = new Ammo.btTransform()
      transform.setIdentity()
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
      transform.setRotation(
        new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
      )
      const motionState = new Ammo.btDefaultMotionState(transform)

      const colShape = new Ammo.btBoxShape(
        new Ammo.btVector3(scale.x, scale.y, scale.z)
      )
      colShape.setMargin(0.05)

      const localInertia = new Ammo.btVector3(0, 0, 0)
      colShape.calculateLocalInertia(mass, localInertia)

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(
        mass,
        motionState,
        colShape,
        localInertia
      )
      const body = new Ammo.btRigidBody(rbInfo)
      physicsWorld.addRigidBody(body)
      rocks[i].userData.physicsBody = body
      rigidBodies.push(rocks[i])
    }
  }

  // Load progress
  function handleProgress (xhr) {
    console.log('Rocks: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
  }
}

function createCloud () {
  // Create an empty container that will hold the different parts of the cloud
  const mesh = new THREE.Object3D()
  // create a cube geometry;
  // this shape will be duplicated to create the cloud
  const geom = new THREE.BoxGeometry(20, 20, 20)

  // create a material; a simple white material will do the trick
  const mat = new THREE.MeshPhongMaterial({
    color: Colors.softwhite
  })

  // duplicate the geometry a random number of times
  const nBlocs = 10 + Math.floor(Math.random() * 3)
  for (let i = 0; i < nBlocs; i++) {
    // create the mesh by cloning the geometry
    const m = new THREE.Mesh(geom, mat)

    // set the position and the rotation of each cube randomly
    m.position.x = -5 + Math.random() * 10
    m.position.y = 20
    m.position.z = -5 + Math.random() * 10
    m.rotation.z = Math.random() * Math.PI * 2
    m.rotation.y = Math.random() * Math.PI * 2

    // set the size of the cube randomly
    const s = 0.01 + Math.random() * 0.1
    m.scale.set(s, s, s)

    // allow each cube to cast and to receive shadows
    m.castShadow = true

    // add the cube to the container we first created
    mesh.add(m)
  }

  scene.add(mesh)
  mesh.position.x = -100 + Math.random()
  mesh.position.y = 20
  mesh.position.z = Math.random() * -200
  cloud.push(mesh)
}

/**
 * Handles creations of 2D images into scene
 */
function createImages (filename) {
  // Create a texture loader so we can load our image file
  const loader = new THREE.TextureLoader()

  // Load an image file into a custom material
  const material = new THREE.MeshLambertMaterial({
    map: loader.load(filename)
  })

  // create a plane geometry for the image with a width of 10
  // and a height that preserves the image's aspect ratio
  const geometry = new THREE.PlaneGeometry(10, 10 * 0.75)

  const mesh = new THREE.Mesh(geometry, material)

  mesh.position.set(-0.1, 2, 0)
  mesh.rotation.y = 0
  mesh.scale.x = 1.15
  mesh.scale.y = 0.93

  scene.add(mesh)

  return mesh
}

////////////////////////////// RESET AREAS /////////////////////////////////////

function createResetAreaBowling (p1, p2, p3, p4) {
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff
  })
  const points = []
  points.push(p1)
  points.push(p2)
  points.push(p3)
  points.push(p4)

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  bowlingLine = new THREE.LineLoop(geometry, material)
  scene.add(bowlingLine)
}

function createResetAreaGolf (p1, p2, p3, p4) {
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff
  })
  const points = []
  points.push(p1)
  points.push(p2)
  points.push(p3)
  points.push(p4)

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  golfballLine = new THREE.LineLoop(geometry, material)
  scene.add(golfballLine)
}

////////////////////////////// LINK AREAS /////////////////////////////////////

function createLinks (p1, p2, p3, p4) {
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff
  })
  const points = []
  points.push(p1)
  points.push(p2)
  points.push(p3)
  points.push(p4)

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  sortingVisulizerLine = new THREE.LineLoop(geometry, material)
  scene.add(sortingVisulizerLine)
}

////////////////////////////// CHANGE PLAYERS /////////////////////////////////////

function changeToPlane1 () {
  player = plane

  airplaneControl = new THREE.PlayerControls(player)
}
function changeToPlane2 () {
  player = plane2

  airplaneControl = new THREE.PlayerControls(player)
}
function changeToGolfCart () {
  player = staticGolfCart

  airplaneControl = new THREE.PlayerControls(player)
}

export {
  changeToPlane1,
  changeToPlane2,
  changeToGolfCart,
  createObjects,
  loadGLTFObjectSphereBowling,
  loadGLTFObjectSphere,
  player,
  plane,
  plane2,
  golfCart,
  mixer,
  plane2mixer,
  golfcartMixer,
  airplaneControl,
  golfCartControl,
  cloud,
  bowlingLine,
  golfballLine,
  sortingVisulizerLine
}
