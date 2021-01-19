
// Scene Setup Variables
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, directionalLight, ambientLight, pointLight, HEIGHT, WIDTH;

var Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xf5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
    lightBlue: 0x7ad7f0,
    black: 0x000000
};

// Active Scene Objects
var cube, plane;

// Enable Debugging with camera movement
var debug = false;
var fog = false;

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
        const near = 3;
        const far = 25;
        const color = 'lightblue';
        scene.fog = new THREE.Fog(color, near, far);
    }

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 75;
    nearPlane = 0.1;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set( 0, 15, 15 );
    camera.lookAt( 0, 0, 0 );
    
    // Scene renderer
    renderer = new THREE.WebGLRenderer();
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
    const dirIntensity = 0.9;
    directionalLight = new THREE.DirectionalLight( Colors.white, dirIntensity);
    directionalLight.position.set( 0, 1, 1 ).normalize();
    directionalLight.castShadow = true;

    // Define shadow resolution
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    // Ambient Light Object in Scene
    const ambientIntensity = 0.4;
    ambientLight = new THREE.AmbientLight( Colors.white, ambientIntensity);

    // Point Light Object in Scene
    const pointIntensity = 0.8;
    pointLight = new THREE.PointLight( Colors.red, pointIntensity,50,2);
    pointLight.position.set(0,20,0);

    // Add all light sources to the Scene
    scene.add( directionalLight );
    scene.add( ambientLight );
    scene.add( pointLight );

}

/**
 * Parent Function for Creating Objects for Scene
 */
function createObjects(){
    createCube();
    createPlane();
    createText();
}

/**
 * Creates Controlled Cube Player
 */
function createCube(){
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial( { color: Colors.brown } );
    cube = new THREE.Mesh( geometry, material );
    cube.translateY(2);
    scene.add( cube );
}
/**
 * Creates Ground Plane
 */
function createPlane(){
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    const material = new THREE.MeshPhongMaterial( {color: Colors.lightBlue,side:THREE.DoubleSide} );
    plane = new THREE.Mesh( geometry, material );
    plane.rotateX(Math.PI/2);
    scene.add( plane );
}

/**
 * Creates 3D text in Scene
 */
function createText(){
    
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
        cube.position.z -= 1;
        break;
        case 40: // Down
        cube.position.z += 1;
        break;
        case 37: // Left
        cube.position.x -= 1;
        break;
        case 39: // Right
        cube.position.x += 1;
        break;
    }
}

/**
 * Updates moving objects per frame
 */
function update(){
    // Reposition camera to behind player
    camera.position.set(cube.position.x, cube.position.y + 15, cube.position.z + 15);
}



/**
 * Draws the Scene per frame
 */
function animate() {

    if(!debug){
        update();
    }

    renderer.render( scene, camera );
    requestAnimationFrame( animate );
};
