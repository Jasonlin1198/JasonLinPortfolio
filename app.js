
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { WEBGL } from './builds/WebGL.js';

// Check Browser Compatibility
if ( WEBGL.isWebGLAvailable() === false ) {

    document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

// Scene Setup Variables
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, HEIGHT, WIDTH;
// Scene Light Variables 
var directionalLight, ambientLight, pointLight1, pointLight2, pointLight3, pointLight4, pointLight5;

var clock = new THREE.Clock();

// Animation Variables
var mixer;

var Colors = {
    red: 0xf25346,
    white: 0xffffff,
    softwhite: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xf5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
    lightBlue: 0x7ad7f0,
    black: 0x000000
};

// Active Scene Objects
var cube, plane, groundPlane;

// Enable Debugging with camera movement
var debug = false;
var fog = true;

// Begin init on Widown load
window.addEventListener('load', init, false);

/**
 * Parent function that instantiates all objects on load
 */
function init(){

    createScene();
    createLights();
    createObjects();

    // KeyPress Listener
    document.body.addEventListener( 'keydown', onKeyDown, false );
    
    // Begin Animation
    animate();
}

/**
 * Instantiates all Scene related objects
 */
function createScene(){

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Scene Object
    scene = new THREE.Scene();
    scene.background = new THREE.Color(Colors.lightBlue);

    // Scene Fog Settings
    if(fog){
        const near = 40;
        const far = 70;
        const color = 'lightblue';
        scene.fog = new THREE.Fog(color, near, far);
    }

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 75;
    nearPlane = 0.1;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set( 0, 12, 20 );
    camera.lookAt( 0, -5, 0 );
    
    // Scene renderer
    renderer = new THREE.WebGLRenderer({ antialias: true } );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    // Handle Window Resize
    window.addEventListener( 'resize', handleWindowResize, false );

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
 * Handles creation of all light sources
 */
function createLights(){
    // Directional Light Object in Scene 
    const dirIntensity = 0.65;
    directionalLight = new THREE.DirectionalLight( Colors.softwhite, dirIntensity);
    directionalLight.position.set( 20, 100, 1 );

    directionalLight.castShadow = true;

    // Define shadow resolution
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    let d = 100;
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.far = 13500;
    
    if( !debug ) directionalLight.shadowCameraVisible = true;


    // Ambient Light Object in Scene
    const ambientIntensity = 0.4;
    ambientLight = new THREE.AmbientLight( Colors.softwhite, ambientIntensity);

    // Point Light Objects in Scene
    const pointIntensity = 0.6;
    pointLight1 = new THREE.PointLight( Colors.red, pointIntensity,50,2);
    pointLight1.position.set(0,20,0);

    pointLight2 = new THREE.PointLight( Colors.red, pointIntensity,50,2);
    pointLight2.position.set(0,20,-15);

    pointLight3 = new THREE.PointLight( Colors.red, pointIntensity,50,2);
    pointLight3.position.set(0,20,-30);

    pointLight4 = new THREE.PointLight( Colors.red, pointIntensity,50,2);
    pointLight4.position.set(0,20,-45);

    pointLight5 = new THREE.PointLight( Colors.red, pointIntensity,50,2);
    pointLight5.position.set(0,20,-60);


    // Add all light sources to the Scene
    scene.add( directionalLight );
    scene.add( ambientLight );
    scene.add( pointLight1 );
    scene.add( pointLight2 );
    scene.add( pointLight3 );
    scene.add( pointLight4 );
    scene.add( pointLight5 );

}

/**
 * Parent Function for Creating Objects for Scene
 */
function createObjects(){
    createCube();
    createModels();
    createGroundPlane();
    createNameText();

    var message = `Online Private Instructor\n
    Instructed over 100 lessons to K-12 students on Python, Java, Scratch, and JavaScript\n
    Designed unique curriculums to accommodate students’ individual needs and interests\n
    Leveraged knowledge in Full Stack Development to help students deploy web applications and games`;

    createExperienceText(message, 1);


    message = `Software Engineer Intern \n
    UpperLine Code\n\n
    Developed computer science projects using JavaScript, HTML and CSS designed for student education\n
    Maintained Git repo and Amazon Web Services for building and debugging course exercises`;

    createExperienceText(message, 2);

    message = `SortingVisualizer\n
    JavaScript Web Application\n\n
    Developed a web application using JavaScript, HTML, CSS to visually sort data using various sorting algorithms\n
    Implemented Merge Sort, Insertion Sort, Bubble Sort, Selection Sort\n
    Integrated a code executor using Sphere Engine’s Compiler API to enable users to practice sorting algorithms`;
    
    createExperienceText(message, 3);

    message = `Clubhouse Dungeons\n
    Google Chrome Extension\n\n
    Platform that enables agile software teams to manage team member productivity and Clubhouse data\n
    Implemented the backend code and Clubhouse REST API integrations for maintaining user data using JavaScript\n
    Built an automated CI/CD pipeline in GitHub Actions for JSDocs documentation and Jest unit tests\n
    Led scrum meetings and team retrospectives with a team of 13`;
    
    createExperienceText(message, 4);

}

/**
 * Creates Controlled Cube Player as Default on start
 */
function createCube(){

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial( { color: Colors.brown } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,2,5);
    if ( debug ) {
        cube.castShadow = true;
        scene.add(cube);
    }
    plane = cube;

}
/**
 * Creates Ground Plane
 */
function createGroundPlane(){
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    const material = new THREE.MeshPhongMaterial( {color: Colors.lightBlue,side:THREE.DoubleSide} );
    groundPlane = new THREE.Mesh( geometry, material );
    groundPlane.rotateX(Math.PI/2);

    groundPlane.receiveShadow = true;

    scene.add( groundPlane );
}

/**
 * Creates Shadowed Name 3D text in Scene
 */
function createNameText(){
    
    const loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const color = Colors.black;

        // Lined Text
        const matDark = new THREE.LineBasicMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );

        // Shadow Text
        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        } );


        // Create a set of Shapes representing a font loaded in JSON format.
        const message = "Jason Lin";
        const textSize = 3;
        const shapes = font.generateShapes( message, textSize );

        // Creates an one-sided polygonal geometry from one or more path shapes.
        const geometry = new THREE.ShapeBufferGeometry( shapes );

        // Compute Bounding Box for bufferGeometry of text
        geometry.computeBoundingBox();

        // Position Text to center in Scene
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 1, 0 );

        // make shape ( N.B. edge view not visible )

        const text = new THREE.Mesh( geometry, matLite );
        text.position.z = -2;
        scene.add( text );

        // make line shape ( N.B. edge view remains visible )

        const holeShapes = [];

        for ( let i = 0; i < shapes.length; i ++ ) {

            const shape = shapes[ i ];

            if ( shape.holes && shape.holes.length > 0 ) {

                for ( let j = 0; j < shape.holes.length; j ++ ) {

                    const hole = shape.holes[ j ];
                    holeShapes.push( hole );

                }

            }

        }

        shapes.push.apply( shapes, holeShapes );

        const lineText = new THREE.Object3D();

        for ( let i = 0; i < shapes.length; i ++ ) {

            const shape = shapes[ i ];

            const points = shape.getPoints();
            const geometry = new THREE.BufferGeometry().setFromPoints( points );

            geometry.translate( xMid, 1, 0 );

            const lineMesh = new THREE.Line( geometry, matDark );
            lineText.add( lineMesh );

        }

        scene.add( lineText );
    } ); //end load function
}

function createExperienceText(message,offset){
   
    const loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const color = Colors.white;

        // Solid Text
        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        } );

        const textSize = 0.5;
        const shapes = font.generateShapes( message, textSize );

        const geometry = new THREE.ShapeBufferGeometry( shapes );

        geometry.computeBoundingBox();

        // Center text
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0);

        const text = new THREE.Mesh( geometry, matLite );

        // Rotate to match plane, translate
        text.rotation.x = -Math.PI / 2;
        text.position.set(0,1,-15 * offset);

        scene.add( text );

    } ); //end load function

}

/**
 * Loads GLTF/GLB files from Blender
 */
function createModels(){
    const loader = new GLTFLoader().setPath( './models/' );
    loader.load('airplane.glb', handleLoad, handleProgress);

    // Load completion
    function handleLoad(gltf){

        // Load Propeller Spin Animation with Mixer
        mixer = new THREE.AnimationMixer( gltf.scene );
        var action = mixer.clipAction( gltf.animations[1] );
        action.play();

        // Enable Shadows for loaded objects children
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
            }
        } );

        // Get scene child from file
        plane = gltf.scene.children[0];        
        scene.add(plane)
        plane.position.set(0,1,10);

    }

    // Load progress
	function handleProgress( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	}

}



/**
 * Handles key presses
 * @param {*} event 
 */
function onKeyDown(event){
    switch( event.keyCode ) {
        // Camera Controls
        case 83: // W - Up
        camera.position.y -= 1;
        break;
        case 87: // S - Down
        camera.position.y += 1;
        break;
        case 82: // R - Forward
        camera.position.z -= 1;
        break;
        case 70: // F - Back
        camera.position.z += 1;
        break;
        case 68: // D - Right
        camera.position.x += 1;
        break;
        case 65: // A - Left
        camera.position.x -= 1;
        break;

        //Player Controls
        case 38: // Up
        plane.position.z -= 1;
        break;
        case 40: // Down
        plane.position.z += 1;
        break;
        case 37: // Left
        plane.position.x -= 1;
        break;
        case 39: // Right
        plane.position.x += 1;
        break;
        case 32: // Reset
        plane.position.set(0,2,5);
        break;
    }
}

/**
 * Updates moving objects per frame
 */
function update(){
    // Reposition camera to behind player
    camera.position.set(plane.position.x, plane.position.y + 15, plane.position.z + 10);
    //directionalLight.shadow.camera.position.set(plane.position.x, plane.position.y + 15, plane.position.z + 15);


}



/**
 * Draws the Scene per frame
 */
function animate() {

    if(!debug) update();


    // Updates animations per delta units
    var deltaSeconds = clock.getDelta();
    if ( mixer ) mixer.update( deltaSeconds );
    
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
};
