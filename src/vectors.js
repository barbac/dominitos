import * as THREE from 'three';

import vectorLine from './vectorLine.js';

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

  const v0 = new THREE.Vector2(0, 8);
  const v1 = new THREE.Vector2(0, 11);
  const v2 = new THREE.Vector2(0, 15);
  const v3 = new THREE.Vector2(0, 4);

  const line0 = vectorLine(v0.y, 'teal');
  scene.add(line0);
  const line1 = vectorLine(v1.y, 'slateblue');
  scene.add(line1);
  const line2 = vectorLine(v2.y, 'skyblue');
  scene.add(line2);
  const line3 = vectorLine(v3.y, 'orange');
  scene.add(line3);
}

function vectors() {
  init();
  renderer.render(scene, camera);
}

export default vectors;
