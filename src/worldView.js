import * as THREE from 'three';

let scene, camera, renderer;

const planeSize = 130;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  const cameraPosition = [planeSize / 2, planeSize / 4, planeSize / 2];
  camera.position.fromArray(cameraPosition);
  camera.lookAt(new THREE.Vector3());

  //plane
  const grid = new THREE.GridHelper(planeSize, planeSize);
  scene.add(grid);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log(renderer.domElement);

  document.body.appendChild(renderer.domElement);
}

function worldView() {
  init();
  renderer.render(scene, camera);
}

export default worldView;
