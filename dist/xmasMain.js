let SCENE;
let CAMERA;
let RENDERER;
let CSSRENDERER;
let LOADING_MANAGER;
let IMAGE_LOADER;
let OBJ_LOADER;
let CONTROLS;
let MOUSE;
let RAYCASTER;

let TEXTURE;
let OBJECT;

let scene, camera, renderer;
let snowflakes = [];
let gifts = [];
let audioContext;
let audioElement;
let audioContextInitialized = false;

const _IS_ANIMATED = Symbol("is animated");
const _IS_VISIBLE = Symbol("is visible");
const musicButton = document.getElementById("toggleMusicButton");


main();

function main() {
  init();
  animate();
}
function initAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function init() {
  initAudioContext();
  initScene();
  initCamera();
  initRenderer();
  initCSSRenderer();
  initLoaders();
  initControls();
  initRaycaster();
  initBackground();
  initTexture();
  loadMusic();
  loadTexture();
  loadModel();
  initSnowfall();
  initGifts();

  initEventListeners();
  initPopups();

  document.querySelector(".canvas-container").appendChild(RENDERER.domElement);
  document
    .querySelector(".canvas-container")
    .appendChild(CSSRENDERER.domElement);

    musicButton.addEventListener("click", toggleMusic);

}

function initScene() {
  SCENE = new THREE.Scene();
  initLights();
}

function initLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  SCENE.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 100, 100);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;

  SCENE.add(directionalLight);
}

function initCamera() {
  CAMERA = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  CAMERA.position.z = 100;
}

function initRenderer() {
  RENDERER = new THREE.WebGLRenderer({ alpha: true });
  RENDERER.setPixelRatio(window.devicePixelRatio);
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  RENDERER.shadowMap.enabled = true;
  RENDERER.shadowMapSort = true;
}

function initCSSRenderer() {
  CSSRENDERER = new THREE.CSS3DRenderer();
  CSSRENDERER.setSize(window.innerWidth, window.innerHeight);
  CSSRENDERER.domElement.style.position = "absolute";
  CSSRENDERER.domElement.style.top = 0;
}

function initLoaders() {
  LOADING_MANAGER = new THREE.LoadingManager();
  IMAGE_LOADER = new THREE.ImageLoader(LOADING_MANAGER);
  OBJ_LOADER = new THREE.OBJLoader(LOADING_MANAGER);
}

function initControls() {
  CONTROLS = new THREE.OrbitControls(CAMERA);
  CONTROLS.minPolarAngle = (Math.PI * 1) / 4;
  CONTROLS.maxPolarAngle = (Math.PI * 3) / 4;
  CONTROLS.minDistance = 10;
  CONTROLS.maxDistance = 150;
  CONTROLS.autoRotate = true;
  CONTROLS.autoRotateSpeed = -1.0;
  CONTROLS.update();

  MOUSE = new THREE.Vector2();
}

function initRaycaster() {
  RAYCASTER = new THREE.Raycaster();
}

function initTexture() {
  TEXTURE = new THREE.Texture();
}

function initBackground() {
  const sphere = new THREE.SphereGeometry(500, 64, 64);
  sphere.scale(-1, 1, 1);

  const texture = new THREE.Texture();

  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });

  IMAGE_LOADER.load("./dark.jpeg", (image) => {
    texture.image = image;
    texture.needsUpdate = true;
  });

  SCENE.add(new THREE.Mesh(sphere, material));
}

function loadTexture() {
  IMAGE_LOADER.load("./texture.jpg", (image) => {
    TEXTURE.image = image;
    TEXTURE.needsUpdate = true;
  });
}

function loadModel() {
  OBJ_LOADER.load("./model.obj", (object) => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        switch (child.material.name) {
          case "Christmas_Tree":
            child.material.map = TEXTURE;
            break;
          case "red":
            child[_IS_ANIMATED] = false;
            child.material.color.setHSL(Math.random(), 1, 0.5);
            break;
          case "pink":
            child[_IS_ANIMATED] = false;
            child.material.color.setHSL(Math.random(), 1, 0.5);
            break;
        }
      }
    });

    object.scale.x = 0.3;
    object.scale.y = 0.3;
    object.scale.z = 0.3;
    object.rotation.x = -Math.PI / 2;
    object.position.y = -30;

    OBJECT = object;
    SCENE.add(OBJECT);
  });
}

function initEventListeners() {
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove);

  onWindowResize();
}

function onWindowResize() {
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();

  RENDERER.setSize(window.innerWidth, window.innerHeight);
  CSSRENDERER.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
  MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function initPopups() {
  const popupSource = document.querySelector(".popup-3d");

  popupSource[_IS_VISIBLE] = true;

  const popup = new THREE.CSS3DObject(popupSource);

  popup.position.x = 0;
  popup.position.y = -10;
  popup.position.z = 30;
  popup.scale.x = 0.05;
  popup.scale.y = 0.05;
  popup.scale.z = 0.05;

  SCENE.add(popup);
}

function animate() {
  requestAnimationFrame(animate);
  CONTROLS.update();
  render();
  animateSnowfall();
}

function render() {
  CAMERA.lookAt(SCENE.position);

  RAYCASTER.setFromCamera(MOUSE, CAMERA);
  paintHoveredBalls();
  updatePopups();

  RENDERER.render(SCENE, CAMERA);
  CSSRENDERER.render(SCENE, CAMERA);
}

function paintHoveredBalls() {
  if (OBJECT) {
    const intersects = RAYCASTER.intersectObjects(OBJECT.children);

    for (let i = 0; i < intersects.length; i++) {
      switch (intersects[i].object.material.name) {
        case "red":
          if (!intersects[i].object[_IS_ANIMATED]) {
            anime({
              targets: intersects[i].object.material.color,
              r: 0,
              g: 0,
              b: 0,
              easing: "easeInOutQuad",
            });
            intersects[i].object[_IS_ANIMATED] = true;
          }
          break;
        case "pink":
          if (!intersects[i].object[_IS_ANIMATED]) {
            anime({
              targets: intersects[i].object.material.color,
              r: 1,
              g: 1,
              b: 1,
              easing: "easeInOutQuad",
            });
            intersects[i].object[_IS_ANIMATED] = true;
          }
          break;
      }
    }
  }
}


function toggleMusic() {
  if (audioElement) {
    if (audioElement.paused) {
      audioElement.play();
      musicButton.textContent = "Pause Music";
    } else {
      audioElement.pause();
      musicButton.textContent = "Play Music";
    }
  }
}
function loadMusic() {
  if (!audioContextInitialized) {
    initAudioContext();
    audioContextInitialized = true;
  }

  audioElement = new Audio('./christmasSong.mp3');
  audioElement.loop = true;

  const source = audioContext.createMediaElementSource(audioElement);
  source.connect(audioContext.destination);
  audioElement.play();
  musicButton.textContent = "Pause Music";
}



function updatePopups() {
  const popupSource = document.querySelector(".popup-3d");
  const angle = CONTROLS.getAzimuthalAngle();

  if (Math.abs(angle) > 0.9 && popupSource[_IS_VISIBLE]) {
    anime({
      targets: popupSource,
      opacity: 0,
      easing: "easeInOutQuad",
    });
    popupSource[_IS_VISIBLE] = false;
  } else if (Math.abs(angle) < 0.9 && !popupSource[_IS_VISIBLE]) {
    anime({
      targets: popupSource,
      opacity: 1,
      easing: "easeInOutQuad",
    });
    popupSource[_IS_VISIBLE] = true;
  }
}

function initSnowfall() {
  const snowflakeGeometry = new THREE.CircleGeometry(1, 6);
  const snowflakeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const snowflakeSystem = new THREE.Group();

  // Add snowflakes to the particle system
  for (let i = 0; i < 200; i++) {
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);

    // Randomly position the snowflake within the scene
    snowflake.position.set(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );

    snowflakeSystem.add(snowflake);
    snowflakes.push(snowflake);
  }

  // Add the particle system to the scene
  SCENE.add(snowflakeSystem);
}

function animateSnowfall() {
  for (let i = 0; i < snowflakes.length; i++) {
    const snowflake = snowflakes[i];

    if (snowflake.position.y < -100) {
      snowflake.position.y = 100;
    }
    snowflake.position.y -= 0.5;
  }
}

function initGifts() {
  const giftGeometry = new THREE.BoxGeometry(5, 5, 5);
  const wrappingPaperTexture = new THREE.TextureLoader().load('https://pbx2-pbww-prod-pbww-cdn.getprintbox.com/media/productimage/8acb0fde-7f87-45a5-b83a-7211d395e0ae/Fuzzy%20Sweater_thumb_900x900?mt=1537952608.139779');
  const wrappingPaperMaterial = new THREE.MeshStandardMaterial({ map: wrappingPaperTexture });

  const bowGeometry = new THREE.BoxGeometry(2, 1, 2);
  const bowMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 }); 


  for (let i = 0; i < 10; i++) {
    const gift = new THREE.Mesh(giftGeometry, wrappingPaperMaterial);

    const ribbon = new THREE.Mesh(bowGeometry, bowMaterial);
    ribbon.position.set(0, 3, 0);
    gift.add(ribbon); 
    gift.position.set(
      Math.random() * 200 - 100,
      -30,
      Math.random() * 200 - 100
    );

    SCENE.add(gift);
    gifts.push(gift);
  }
}


