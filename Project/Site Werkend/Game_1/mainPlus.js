if (WEBGL.isWebGLAvailable() === false){
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

let scene, camera, renderer, video;
let width, height;
let player, ball;
let clock;

// Game type.
let viaColorDetection = false;
let viaKeyboard = false;
let viaMouse = true;

// Video
let videoW = 1280;
let videoH = 720;
let videoTXT;
let videoPlayer;
let videoMAT;
let videoMesh;
let cameraOffset = -5;

// Setup coordinates.
let rectX = 0;
let rectY = 0;
let cursorX = 0;
let cursorY = 0;

// Game objects.
let loader = new THREE.TextureLoader();
let ballSize = 0.5;
let ballSpawnLocation = 4;
let ballVel = new THREE.Vector3(-0.05, -0.05, 0);
let ballMaxVel = -0.05;
let ballX, ballY;
let playerX, playerY;
let playerSizeX = 2;
let playerSizeY = 0.4;
let playerSizeZ = 0.5;
let playerSpawnY = 0;
let fallSpeed = -0.025;
let zOffset = 1.5;
let room;
let roomSize = 10;

// Game.
let isReady = false;

// Physics.
Physijs.scripts.worker = '/lib/physijs_worker.js';
Physijs.scripts.ammo = '/lib/ammo.js';

width = Math.round(window.innerWidth * 0.95);
height = Math.round(window.innerHeight * 0.95);

function setup(){
  // Scene.
  scene = new Physijs.Scene();
  scene.fog = new THREE.Fog(0xffffff, 1, 12);
  clock = new THREE.Clock();

  // Camera.
  camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
  camera.position.x = cameraOffset;
  camera.position.y = 2;

  // Renderer.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // Create html location.
  let div = document.createElement('div');
  let body = document.createElement('body');
  body.setAttribute('id', 'bodyID')
  document.body.appendChild(div);
  div.appendChild(body);
  document.getElementById('bodyID').appendChild(renderer.domElement);
  camera.position.z = 5;

  setupVideo();
  setupColorTracker();

  // Window resizing
  window.addEventListener('resize', onWindowResize, false);

  // Create objects.
  createGrid();
  createRoom();
  createPlayer(-2, playerSpawnY);
  createBall();
  createLighting();

  if (viaMouse){
    if (window.Event){
      document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;
  }

  // Run the scene.
  animate();
}

function animate(){
  ball._dirtyPosition = true;
  ball._dirtyRotation = true;
  scene.simulate();
  renderer.render(scene, camera);

  requestAnimationFrame(animate);

  // Ball physics.
  getBallLocation();
  getPlayerLocation();

  // Simulation.
  if (isReady == true){
    // Y axis.
    ball.position.y += ball.vel.y;
    ball.vel.y += ball.acc.y;

    if (ball.position.distanceTo(player.position) + ballSize < playerSizeX){
      if (ball.position.y - ballSize <= player.position.y + (playerSizeY/2)){
        ball.vel.y -= ball.acc.y;
        ball.vel.y *= -1;
      }
    }

    // X axis.
    ball.position.x += ball.vel.x;
    ball.vel.x += ball.acc.x;

    // if (ball.position.x + ballSize < room.position.x + (roomSize/2)){
    //   ball.vel.x -= ball.acc.x;
    //   ball.vel.x *= -1;
    // }

    if (ball.position.x < room.position.x - roomSize/2 ||
        ball.position.x > room.position.x + roomSize/2){
          ball.vel.x *= -1;
          ball.acc.x *= -0.01;
    }
  }

  // Convert coords to worldspace.
  if (viaColorDetection){
    player.position.x = (-rectX/60) - cameraOffset;
  }

  if (viaKeyboard){
    player.position.x += player.vel.x;

    addEventListener('keydown',(evt)=>{
      switch (evt.key){
        case "ArrowLeft":
          player.vel.x = -0.1;
          break;
        case "ArrowRight":
          player.vel.x = 0.1;
          break;
        default:
      }
    })
    addEventListener('keyup', (evt)=>{
      switch (evt.key){
        case "ArrowLeft":
          player.vel.x = 0;
          break;
        case "ArrowRight":
          player.vel.x = 0;
          break;
        default:
      }
    })
  };

  if (viaMouse){
    player.position.x = cursorX/200 + (cameraOffset * 2);
  }

  // Game mode switcher.
  addEventListener('keydown', (e)=>{
    switch (e.key){
      case "k": // Keyboard.
        viaKeyboard = true;
        viaMouse = false;
        viaColorDetection = false;
        break;
      case "c": // Color Detection.
        viaKeyboard = false;
        viaMouse = false;
        viaColorDetection = true;
        break;
      case "m": // Mouse.
        viaKeyboard = false;
        viaMouse = true;
        viaColorDetection = false;
        break;
      case "s": // Start simulation.
        isReady = true;
        break;
      case "p": // Pause simulation.
        isReady = false;
        break;
      case "r": // Restart ball location.
        ball.position.y = ballSpawnLocation;
        ball.vel.y = 0;
        break;
      case "i": // Increase difficulty.
        increaseDifficulty();
      default:
    }
  })




  // Ball physics.

}

function increaseDifficulty(){
  player.scale.x = 1;
}

function getCursorXY(e){
  if (window.Event){
    cursorX = e.pageX;
    cursorY = e.pageY;
  } else {
    cursorX = event.clientX;
    cursorY = event.clientY;
  }
}

function onWindowResize(){
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function setupVideo(){
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    let constraints = {
      audio: false,
      video: {
        width: videoW,
        height: videoH,
      }
    };

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
      // Apply the stream to the video element.
      video.srcObject = stream;
      video.play();
    })
    .catch(function(error){
      console.error('Unable to acces the camera.', error);
    });
  } else {
    console.error('MediaDevices interface not available.');
  }

  video = document.getElementById('video');
  videoTXT = new THREE.VideoTexture(video);
  videoPlayer = new THREE.PlaneBufferGeometry(16, 9);
  videoPlayer.scale(0.15, 0.15, 1);
  videoMAT = new THREE.MeshBasicMaterial({ map: videoTXT });
  videoMesh = new THREE.Mesh(videoPlayer, videoMAT);
  videoMesh.scale.x = -1; // Mirror webcam.
  videoMesh.position.x = -2;
  videoMesh.position.y = 3.5;
  videoMesh.position.z = 2;
  scene.add(videoMesh)

}

function setupColorTracker(){
  let tracker = new tracking.ColorTracker();
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('webgl');

  tracking.track('#video', tracker);

  tracker.on('track', function(event) {
    // ctx.clearRect(0, 0, width, height);
    event.data.forEach(function(rect) {
      // if (rect.color === 'custom') {
      //   rect.color = tracker.customColor;
      // }

      // Assign rect coordinates.
      rectX = rect.x + rect.width/2;
      rectY = rect.y + rect.height/2;
    })
  });

  // Load interface color tracker.
  initGUIControllers(tracker);
}

function getBallLocation(){
  ballX = ball.position.x + ballSize;
  ballY = ball.position.y + ballSize;
}

function getPlayerLocation(){
  playerX = player.position.x + playerSizeX;
  playerY = player.position.y + playerSizeY;
}

function createGrid(){
  let size = 14, step = 0.5;
  let geo = new THREE.Geometry();
  let mat = new THREE.LineBasicMaterial({ color: 0x06B6868 });

  for (let i = - size; i <= size; i += step){
    geo.vertices.push(new THREE.Vector3(-size, -0.04, i));
    geo.vertices.push(new THREE.Vector3(size, -0.04, i));

    geo.vertices.push(new THREE.Vector3(i, -0.04, -size));
    geo.vertices.push(new THREE.Vector3(i, -0.04, size));
  }
  let line = new THREE.Line(geo, mat, THREE.LineSegments);
  line.position.x = cameraOffset;
  scene.add(line);
}

function createRoom(){
  let geo = new THREE.BoxGeometry(roomSize, roomSize * 2, roomSize);
  let mat = new THREE.MeshLambertMaterial({ color: 0x12294f, side: THREE.BackSide});
  room = new THREE.Mesh(geo, mat);
  room.position.set(cameraOffset, 9.95, 3);
  scene.add(room);
}

function createPlayer(x, y){
  let geo = new THREE.BoxGeometry(playerSizeX, playerSizeY, playerSizeZ);
  let mat = new THREE.MeshLambertMaterial({ color: 0x7D318C });
  player = new Physijs.BoxMesh(geo, mat);
  player.position.set(x, y, zOffset);
  player.vel = new THREE.Vector3(0.001, 0, 0);
  player.receiveShadow = true;
  scene.add(player);
}

function createBall(){
  let txt = loader.load('assets/carbon.jpg');
  let geo = new THREE.SphereGeometry(ballSize, 32, 32);
  let mat = new THREE.MeshLambertMaterial({ wireframe: false, map: txt });
  ball = new Physijs.SphereMesh(geo, mat);
  ball.position.set(cameraOffset, ballSpawnLocation, zOffset);
  ball.castShadow = true;
  ball.vel = ballVel;
  ball.acc = new THREE.Vector3(-0.001, -0.003, 0);
  ball.rad = new THREE.Vector3(1, 1, 0);
  ball.tan = new THREE.Vector3(1, -1, 0);
  scene.add(ball);
}

function createLighting(){
  // Ambient light.
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  // Spotlight.
  let light = new THREE.SpotLight(0xffffff, 4);
  light.position.set(-15, camera.position.y, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 500;
  light.shadow.camera.far = 4000;
  light.shadow.camera.fov = 30;
  scene.add(light);
}

setup();
