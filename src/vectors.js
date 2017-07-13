import * as THREE from 'three';

let scene, camera, renderer;
const planeSize = 100;
const halfPlaneSize = planeSize / 2;

function init() {
  scene = new THREE.Scene();
  const aspectRation = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    aspectRation * halfPlaneSize / -2,
    aspectRation * halfPlaneSize / 2,
    halfPlaneSize / 2,
    halfPlaneSize / -2,
    0,
    100
  );
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const grid = new THREE.GridHelper(
    planeSize,
    planeSize,
    'steelblue',
    0x303030
  );
  grid.rotation.x = Math.PI / 2;
  scene.add(grid);
}

function vectors() {
  init();
  renderer.render(scene, camera);
}

export default vectors;
