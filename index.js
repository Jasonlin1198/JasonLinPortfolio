import { WEBGL } from './build/WebGL.js'
import { RenderPass } from './jsm/postprocessing/RenderPass.js'
import { BokehPass } from './jsm/postprocessing/BokehPass.js'
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from './jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from './jsm/shaders/GammaCorrectionShader.js'
import { Vector3, Vector4 } from './build/three.module.js'

import {
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
} from './models.js'

// Check Browser Compatibility
if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage())
}

// HTML Elements
const container = document.getElementById('container')

// KeyPress Listener
document.body.addEventListener('keydown', onKeyDown, false)
document.body.addEventListener('keyup', onKeyUp, false)

// Mobile platform
var mobileVersion = false,
  last_touch_x = 0,
  last_touch_y = 0

// Test for mobile platform
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  mobileVersion = true
}

// Touch controls
if (mobileVersion) {
  window.alert('Mobile verision being updated')

  document.addEventListener('touchstart', process_touchstart, false)
}

// Enable Debugging with camera movement
const debug = false

// Scene Setup
let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  HEIGHT,
  WIDTH

// Timing
const clock = new THREE.Clock()

// Custom Colors
const Colors = {
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
  orange: 0xfe8f42
}

// Physical World
let physicsWorld,
  tmpTrans,
  rigidBodies = []

// Post-processing
const postprocessing = {}
const enablePostProcessing = false

// AmmoJS Initialization
Ammo().then(init)

/**
 * Instantiates all objects on load
 */
function init () {
  setupPhysicsWorld()
  createScene()
  createLights()
  createAudio()
  createObjects()

  if (enablePostProcessing) {
    initPostprocessing()
  }
}

/**
 * Create ammo.js physical world settings
 */
function setupPhysicsWorld () {
  ammoTmpPos = new Ammo.btVector3()
  ammoTmpQuat = new Ammo.btQuaternion()
  tmpTrans = new Ammo.btTransform()

  let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver()

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    overlappingPairCache,
    solver,
    collisionConfiguration
  )
  physicsWorld.setGravity(new Ammo.btVector3(0, -20, 0))
}

/**
 * Instantiates all Scene related objects
 */
function createScene () {
  // Set window dimensions
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth

  // Scene Object
  scene = new THREE.Scene()
  scene.background = new THREE.Color(Colors.white)

  // Camera
  aspectRatio = WIDTH / HEIGHT
  fieldOfView = 75
  nearPlane = 0.1
  farPlane = 1000
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  )
  camera.position.set(0, 10, 15)
  camera.up.set(0, 1, 0)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  if (debug) {
    let camHelper = new THREE.CameraHelper(camera)
    scene.add(camHelper)
  }

  // Fog Settings
  const near = 20
  const far = 500
  const color = Colors.white
  scene.fog = new THREE.Fog(color, near, far)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(WIDTH, HEIGHT)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputEncoding = THREE.GammaEncoding
  container.appendChild(renderer.domElement)

  // Shadows
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Tone Mapping
  renderer.toneMapping = THREE.LinearToneMapping
  renderer.toneMappingExposure = 1.1

  /**
   * Handles window resizing and updates camera projMtx
   */
  const handleWindowResize = () => {
    // Update Sizes
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth

    // Update Camera
    camera.aspect = WIDTH / HEIGHT
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(WIDTH, HEIGHT)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (enablePostProcessing) {
      postprocessing.composer.setSize(WIDTH, HEIGHT)
    }
  }

  // Handle Window Resize
  window.addEventListener('resize', handleWindowResize, false)
}

/**
 * Handles creation of all light sources
 */
function createLights () {
  // Directional Light
  const dirIntensity = 0.7
  const directionalLight = new THREE.DirectionalLight(
    Colors.softwhite,
    dirIntensity
  )
  directionalLight.position.set(150, 100, 1)

  directionalLight.castShadow = true

  // Define shadow resolution
  directionalLight.shadow.mapSize.width = 4096
  directionalLight.shadow.mapSize.height = 4096

  let dist = 200
  directionalLight.castShadow = true
  directionalLight.shadow.camera.left = -dist
  directionalLight.shadow.camera.right = dist
  directionalLight.shadow.camera.top = dist
  directionalLight.shadow.camera.bottom = -dist
  directionalLight.shadow.camera.far = 13500

  // Ambient Light
  const ambientIntensity = 0.7
  const ambientLight = new THREE.AmbientLight(
    Colors.softwhite,
    ambientIntensity
  )

  // Point Light
  const pointIntensity = 2
  const pointLight1 = new THREE.PointLight(
    Colors.softwhite,
    pointIntensity,
    50,
    2
  )
  pointLight1.position.set(0, 20, 0)

  const pointLight2 = new THREE.PointLight(
    Colors.softwhite,
    pointIntensity,
    50,
    2
  )
  pointLight2.position.set(0, 20, -50)

  const pointLight3 = new THREE.PointLight(
    Colors.softwhite,
    pointIntensity,
    50,
    2
  )
  pointLight3.position.set(0, 20, -100)

  const pointLight4 = new THREE.PointLight(
    Colors.softwhite,
    pointIntensity,
    50,
    2
  )
  pointLight4.position.set(0, 20, -150)

  const pointLight5 = new THREE.PointLight(
    Colors.softwhite,
    pointIntensity,
    50,
    2
  )
  pointLight5.position.set(0, 20, -200)

  // Hemisphere Light
  const hemiLightIntensity = 0.1
  const hemiLight = new THREE.HemisphereLight(
    Colors.softwhite,
    Colors.desertBrown,
    hemiLightIntensity
  )

  hemiLight.position.set(0, 50, 0)

  // Add all light sources to the Scene
  scene.add(directionalLight)
  scene.add(ambientLight)
  scene.add(hemiLight)
  scene.add(pointLight1)
  scene.add(pointLight2)
  scene.add(pointLight3)
  scene.add(pointLight4)
  scene.add(pointLight5)
}

/**
 * Handles creation of audio in the scene
 */
function createAudio () {
  // Create Audio listener bound to camera and audio source
  const listener = new THREE.AudioListener()
  camera.add(listener)

  const sound = new THREE.PositionalAudio(listener)
  // Load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader()
  audioLoader.load('sounds/plane.ogg', function (buffer) {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0.5)
    sound.setRefDistance(20)
    //sound.play();
  })
}

function initPostprocessing () {
  const renderPass = new RenderPass(scene, camera)

  const bokehPass = new BokehPass(scene, camera, {
    aspect: WIDTH / HEIGHT,
    focus: 1.0,
    aperture: 0.025,
    maxblur: 0.01,

    width: WIDTH,
    height: HEIGHT
  })

  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)

  const composer = new EffectComposer(renderer)

  composer.addPass(renderPass)
  composer.addPass(gammaCorrectionPass)
  composer.addPass(bokehPass)

  postprocessing.composer = composer
  postprocessing.bokeh = bokehPass

  const effectController = {
    focus: 0.0001,
    aperture: 1,
    maxblur: 0.002
  }

  const matChanger = function () {
    postprocessing.bokeh.uniforms['focus'].value = effectController.focus
    postprocessing.bokeh.uniforms['aperture'].value =
      effectController.aperture * 0.00001
    postprocessing.bokeh.uniforms['maxblur'].value = effectController.maxblur
    postprocessing.enabled = effectController.enabled
    postprocessing.bokeh_uniforms['near'].value = camera.near
    postprocessing.bokeh_uniforms['far'].value = camera.far
  }
  matChanger()
}

////////////////////////////// MOBILE EVENT HANDLERS /////////////////////////////////////

/**
 * Processes first touch event to screen
 * @param {*} ev | event keycode
 */
function process_touchstart (ev) {
  document.addEventListener('touchmove', process_touchmove, false)
  document.addEventListener('touchcancel', process_touchcancel, false)
  document.addEventListener('touchend', process_touchend, false)

  // Use the event's data to call out to the appropriate gesture handlers
  switch (ev.touches.length) {
    case 1:
      handle_one_touch(ev)
      break
    case 2:
      handle_two_touches(ev)
      break
    case 3:
      handle_three_touches(ev)
      break
    default:
      gesture_not_supported(ev)
      break
  }
}

function handle_one_touch (ev) {
  last_touch_x = ev.touches[0].clientX
  last_touch_y = ev.touches[0].clientY
}
function handle_two_touches (ev) {
  window.alert('touched with 2 fingers')
}
function handle_three_touches (ev) {
  window.alert('touched with 3 fingers')
}
function gesture_not_supported (ev) {
  window.alert('gesture not supported')
}

/**
 * Processes movement touch event to screen
 * @param {*} ev | event keycode
 */
function process_touchmove (ev) {
  // Prevent default events
  ev.preventDefault()

  var curr_touch_x = ev.targetTouches[0].clientX
  var curr_touch_y = ev.targetTouches[0].clientY

  // Move forward
  if (curr_touch_y - last_touch_y < 0) {
    plane.translateX(0.2)
  }
  // Move back
  if (curr_touch_y - last_touch_y > 0) {
    plane.translateX(-0.2)
  }
  // Rotate right
  if (curr_touch_x - last_touch_x < 0) {
    plane.rotation.y += 0.04
  }
  // Rotate left
  if (curr_touch_x - last_touch_x > 0) {
    plane.rotation.y -= 0.04
  }
  // requestAnimationFrame(animate);

  //window.alert("curr_touch_x: " + curr_touch_x + "curr_touch_y: " + curr_touch_y);
}

////////////////////////////// DESKTOP EVENT HANDLERS /////////////////////////////////////

/**
 * Handles key presses
 * @param {*} event
 */
function onKeyDown (event) {
  switch (event.keyCode) {
    case 192: // Reset
      player.position.set(0, 2, 5)
      break
    case 49:
      changeToPlane1()
      break
    case 50:
      changeToPlane2()
      break
    case 51:
      changeToGolfCart()
      break
    case 13:
      if (
        player.position.x > -90 &&
        player.position.x < -70 &&
        player.position.z > -5 &&
        player.position.z < 5
      ) {
        bowlingLine.material = new THREE.LineBasicMaterial({
          color: 0xffff00
        })
        loadGLTFObjectSphereBowling(
          'bowlingball.glb',
          new Vector3(-80, 8, -10),
          1.5,
          new Vector4(0, -1, 0, 1)
        )
      } else if (
        player.position.x > 160 &&
        player.position.x < 170 &&
        player.position.z > -10 &&
        player.position.z < -5
      ) {
        golfballLine.material = new THREE.LineBasicMaterial({
          color: 0xffff00
        })
        loadGLTFObjectSphere(
          'golfball.glb',
          new Vector3(170, 3, -20),
          0.75,
          new Vector4(0, 0, 0, 1)
        )
      } else if (
        player.position.x > 80 &&
        player.position.x < 90 &&
        player.position.z > -40 &&
        player.position.z < -35
      ) {
        window.open('https://pacificresearchplatform.org/')
      } else if (
        player.position.x > 110 &&
        player.position.x < 120 &&
        player.position.z > -40 &&
        player.position.z < -35
      ) {
        window.open('https://www.idtech.com/')
      } else if (
        player.position.x > 140 &&
        player.position.x < 150 &&
        player.position.z > -40 &&
        player.position.z < -35
      ) {
        window.open('https://jasonlin1198.github.io/SortingVisualizer/')
      } else if (
        player.position.x > 170 &&
        player.position.x < 180 &&
        player.position.z > -40 &&
        player.position.z < -35
      ) {
        window.open('https://www.upperlinecode.com/')
      } else if (
        player.position.x > -10 &&
        player.position.x < -5 &&
        player.position.z > -145 &&
        player.position.z < -140
      ) {
        window.open('https://www.linkedin.com/in/jasonlin1198/')
      } else if (
        player.position.x > -2.5 &&
        player.position.x < 2.5 &&
        player.position.z > -145 &&
        player.position.z < -140
      ) {
        window.open('https://github.com/Jasonlin1198')
      } else if (
        player.position.x > 5 &&
        player.position.x < 10 &&
        player.position.z > -145 &&
        player.position.z < -140
      ) {
        window.open('mailto: jasonlin1198@gmail.com')
      }
      break
  }
}
/**
 * Handles key presses
 * @param {*} event
 */
function onKeyUp (event) {
  switch (event.keyCode) {
    case 192: // Reset
      player.position.set(0, 2, 5)
      break
    case 32:
      bowlingLine.material = new THREE.LineBasicMaterial({
        color: 0xffffff
      })
      golfballLine.material = new THREE.LineBasicMaterial({
        color: 0xffffff
      })
      sortingVisulizerLine.material = new THREE.LineBasicMaterial({
        color: 0xffffff
      })
      break
  }
}

////////////////////////////// PER FRAME UPDATES /////////////////////////////////////

/**
 * Updates physics state of rigidbodies
 * @param {*} deltaTime | time between frames
 */
function updatePhysics (deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 10)

  // Update rigid bodies
  for (let i = 0; i < rigidBodies.length; i++) {
    let objThree = rigidBodies[i]
    let objAmmo = objThree.userData.physicsBody
    let ms = objAmmo.getMotionState()
    if (ms) {
      ms.getWorldTransform(tmpTrans)
      let p = tmpTrans.getOrigin()
      let q = tmpTrans.getRotation()
      objThree.position.set(p.x(), p.y(), p.z())
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
    }
  }
}

// Default position and rotations
let tmpPos = new THREE.Vector3(),
  tmpQuat = new THREE.Quaternion()
let ammoTmpPos = null,
  ammoTmpQuat = null

/**
 * Updates physics collider of kinematic object
 * @param {*} obj | object to update
 */
function moveKinematic (obj) {
  obj.getWorldPosition(tmpPos)
  obj.getWorldQuaternion(tmpQuat)

  let physicsBody = obj.userData.physicsBody

  let ms = physicsBody.getMotionState()
  if (ms) {
    ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z)
    ammoTmpQuat.setValue(tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w)

    tmpTrans.setIdentity()
    tmpTrans.setOrigin(ammoTmpPos)
    tmpTrans.setRotation(ammoTmpQuat)

    ms.setWorldTransform(tmpTrans)
  }
}

/**
 * Updates moving objects per frame
 */
function update (deltaTime) {
  // Reposition camera to behind player
  camera.position.set(
    player.position.x,
    player.position.y + 15,
    player.position.z + 10
  ) * deltaTime

  if (!mobileVersion) {
    cloud.forEach(c => {
      c.position.x += 5 * deltaTime
      c.position.z += Math.random() * 1.5 * deltaTime
      if (c.position.x > 100) {
        scene.remove(c)
      }
    })
  }
}

/**
 * Draws the Scene per frame
 */
function animate () {
  // Time between frames
  const deltaTime = clock.getDelta()

  // Object Animations
  if (mixer) {
    mixer.update(deltaTime)
  }
  if (plane2mixer) {
    plane2mixer.update(deltaTime)
  }
  if (golfcartMixer && golfCart) {
    golfcartMixer.update(deltaTime)
    moveKinematic(golfCart)
  }

  // Player controls
  if (!mobileVersion) {
    if (player) {
      update(deltaTime)
      // AmmoJS physics
      updatePhysics(deltaTime)
      moveKinematic(player)

      if (player == plane || player == plane2) {
        airplaneControl.update()
      }
    }
    // if (player == staticGolfCart) {
    //   golfCartControl.update();
    // }
  }

  // Post-processing
  if (enablePostProcessing) {
    postprocessing.composer.render(0.1)
  } else {
    renderer.render(scene, camera)
  }

  window.requestAnimationFrame(animate, renderer.domElement)
}

export {
  animate,
  scene,
  physicsWorld,
  rigidBodies,
  Colors,
  debug,
  mobileVersion
}
