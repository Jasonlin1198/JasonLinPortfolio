

function createTest() {
  let pos = { x: 0, y: 2, z: 35.5 };
  let scale = { x: 4.5, y: 1, z: 3 };
  let quat = { x: 0, y: 0, z: 0, w: 1 };
  let mass = 1;
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ color: Colors.red });
  cube = new THREE.Mesh(geometry, material);
  cube.scale.set(scale.x, scale.y, scale.z);
  scene.add(cube);

  // //Ammojs Section

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

  physicsWorld.addRigidBody(body);

  cube.userData.physicsBody = body;
  rigidBodies.push(cube);
}


/**
 * Loads GLTF/GLB hanger files from Blender
 */
 function createHanger() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("hanger.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var keys = gltf.scene.children[0];
  
      keys.position.set(31, 3.5, -10);
  
      scene.add(keys);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  }


  /**
   * Loads GLTF/GLB ramp files from Blender
   */
   function createKeys() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("keys.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var keys = gltf.scene.children[0];
  
      keys.position.set(1.1, 1.2, 27);
  
      scene.add(keys);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  

    


  /**
 * Loads GLTF/GLB ramp files from Blender
 */
function createRamp() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("ramp.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var ramp = gltf.scene.children[0];
  
      ramp.position.set(0, 0, 10);
  
      scene.add(ramp);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  }
  

/**
 * Loads GLTF/GLB ramp files from Blender
 */
 function createColumns() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("columns.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var columns = gltf.scene.children[0];
  
      columns.position.set(0, 0, -150);
  
      scene.add(columns);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  }
  

  
/**
 * Loads GLTF/GLB ramp files from Blender
 */
 function createLinkedIn() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("linkedin.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var cat = gltf.scene.children[0];
  
      cat.position.set(-6.1, 12.8, -150);
  
      scene.add(cat);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  }
/**
 * Loads GLTF/GLB ramp files from Blender
 */
 function createGitHubCat() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("githubcat.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var cat = gltf.scene.children[0];
  
      cat.position.set(0, 11.5, -150);
  
      scene.add(cat);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  }
  /**
 * Loads GLTF/GLB ramp files from Blender
 */
   function createMailbox() {
    const loader = new GLTFLoader().setPath("./models/");
    loader.load("mailbox.glb", handleLoad, handleProgress);
  
    // Load completion
    function handleLoad(gltf) {
      // Enable Shadows for loaded objects children
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
  
      // Get scene child from file
      var cat = gltf.scene.children[0];
  
      cat.position.set(6.1, 8, -150);
  
      scene.add(cat);
    }
  
    // Load progress
    function handleProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  }



  
/**
 * Creates Shadowed Name 3D text in Scene
 */
function createNameText() {
  const loader = new THREE.FontLoader();
  loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
    const color = Colors.black;

    // Lined Text
    const matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });

    // Shadow Text
    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });

    // Create a set of Shapes representing a font loaded in JSON format.
    const message = "Jason Lin";
    const textSize = 3;
    const shapes = font.generateShapes(message, textSize);

    // Creates an one-sided polygonal geometry from one or more path shapes.
    const geometry = new THREE.ShapeBufferGeometry(shapes);

    // Compute Bounding Box for bufferGeometry of text
    geometry.computeBoundingBox();

    // Position Text to center in Scene
    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 1, 0);

    // make shape ( N.B. edge view not visible )

    const text = new THREE.Mesh(geometry, matLite);
    text.position.z = -2;
    scene.add(text);

    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [];

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      if (shape.holes && shape.holes.length > 0) {
        for (let j = 0; j < shape.holes.length; j++) {
          const hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }

    shapes.push.apply(shapes, holeShapes);

    const lineText = new THREE.Object3D();

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      const points = shape.getPoints();
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      geometry.translate(xMid, 1, 0);

      const lineMesh = new THREE.Line(geometry, matDark);
      lineText.add(lineMesh);
    }

    scene.add(lineText);
  }); //end load function
}