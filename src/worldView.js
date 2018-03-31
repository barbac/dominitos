import * as THREE from 'three';
import settings from './settings.js';

let scene, camera, renderer;
let firstPersonCamera, firstPersonCameraContainer;
const cameras = {};

const planeSize = 130;
const halfPlaneSize = planeSize / 2;
const rotationFactor = 0.01;
const cameraPanningDelta = 10;

function firstPersonCameraMovement(event) {
  firstPersonCamera.rotation.x -= event.movementY * rotationFactor;
  firstPersonCamera.rotation.y -= event.movementX * rotationFactor;
}

function wasdCameraMovement(event) {
  const vector = new THREE.Vector3(0, 0, 0);
  switch (event.key) {
    case 'w':
      vector.z -= cameraPanningDelta;
      break;
    case 'a':
      vector.x -= cameraPanningDelta;
      break;
    case 's':
      vector.z += cameraPanningDelta;
      break;
    case 'd':
      vector.x += cameraPanningDelta;
      break;
    default:
  }
  //Use firstPersonCamera.rotation.x for up and down movements if needed later.
  const euler = new THREE.Euler(
    0,
    firstPersonCamera.rotation.y,
    0,
    firstPersonCamera.rotation.order
  );
  vector.applyEuler(euler);
  firstPersonCameraContainer.position.add(vector);
}

function firstPersonInputControls(domElement) {
  //this order makes it look like a fps game.
  firstPersonCamera.rotation.order = 'YXZ';
  domElement.addEventListener('mousemove', firstPersonCameraMovement);

  //allow keyword focus
  domElement.tabIndex = 1;
  domElement.addEventListener('keydown', wasdCameraMovement);
}

function init() {
  scene = new THREE.Scene();

  firstPersonCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  cameras.firstPersonCamera = firstPersonCamera;

  //Use this to translate the camara and avoid messing with the rotation.
  firstPersonCameraContainer = new THREE.Object3D();
  firstPersonCameraContainer.position.y = 10;
  firstPersonCameraContainer.add(firstPersonCamera);
  scene.add(firstPersonCameraContainer);

  //helper grids

  const grid = new THREE.GridHelper(planeSize, planeSize);
  scene.add(grid);

  const middleLineColor = 'yellow';

  const gridLeftX = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'red'
  );
  gridLeftX.rotateZ(Math.PI / 2);
  gridLeftX.position.x = -halfPlaneSize;
  scene.add(gridLeftX);

  const gridRightX = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'orange'
  );
  gridRightX.rotateZ(Math.PI / 2);
  gridRightX.position.x = halfPlaneSize;
  scene.add(gridRightX);

  const gridFarZ = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'green'
  );
  gridFarZ.rotateX(Math.PI / 2);
  gridFarZ.position.z = -halfPlaneSize;
  scene.add(gridFarZ);

  const gridCloseZ = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'blue'
  );
  gridCloseZ.rotateX(Math.PI / 2);
  gridCloseZ.position.z = halfPlaneSize;
  scene.add(gridCloseZ);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function setCamera(cameraName) {
  cameraName = cameraName || 'firstPersonCamera';
  const _camera = cameras[cameraName];
  if (!_camera) {
    throw `no camera "${cameraName}"`;
  }
  camera = _camera;

  if (camera == firstPersonCamera) {
    firstPersonInputControls(renderer.domElement);
  }
}

function worldView(...objects) {
  init();

  if (objects.length) {
    scene.add(...objects);
  }

  setCamera(settings('camera'));

  animate();
}

export default worldView;
