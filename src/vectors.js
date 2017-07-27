import * as THREE from 'three';

import vectorLine from './vectorLine.js';

const PI = Math.PI;
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
  grid.rotation.x = PI / 2;
  scene.add(grid);

  const length0 = 10.8; // y axis
  const length1 = 12;
  const length2 = 14.8;
  const length3 = 15.8;
  const length4 = 10; // x axis


  const v0 = new THREE.Vector2(0, length0);
  // const v1 = new THREE.Vector2(length1, 0);
  // const v2 = new THREE.Vector2(length2, 0);
  // const v3 = new THREE.Vector2(0, -length3);
  const v4 = new THREE.Vector2(length4, 0);

  const line0 = vectorLine(v0.y, 'teal');
  scene.add(line0);
  const line1 = vectorLine(length1, 'lime');
  scene.add(line1);
  const line2 = vectorLine(length2, 'skyblue');
  scene.add(line2);
  const line3 = vectorLine(length3, 'orange');
  scene.add(line3);
  const line4 = vectorLine(v4.x, 'slateblue');
  scene.add(line4);

  line0.rotation.z = v0.angle();

  const a = length4;
  const b = length3 - length0;
  const iLengthSquare = a**2 + b**2;
  const iangleA = Math.atan(b / a);
  // const iangleE = Math.atan(a / b);
  const iangleC = Math.acos(
    (-iLengthSquare + length1**2 + length2**2) /
    (2 * length1 * length2)
  );
  const iangleB = Math.acos(
    (-(length2**2) + iLengthSquare + length1**2) /
    (2 * Math.sqrt(iLengthSquare) * length1)
  );
  // const iangleD = Math.acos(
  //   (-(length1**2) + iLengthSquare + length2**2) /
  //   (2 * Math.sqrt(iLengthSquare) * length2)
  // );

  line1.rotation.z = iangleA + iangleB;
  line1.position.y = v0.y;

  line2.rotation.z = iangleC + line1.rotation.z - PI;
  line2.position.x = -length1 * Math.cos(PI - line1.rotation.z);
  line2.position.y = length0 + length1 * Math.sin(PI - line1.rotation.z);

  line3.rotation.z = -PI / 2;
  line3.position.x = length4;
  line3.position.y = length3;
}

function vectors() {
  init();
  renderer.render(scene, camera);
}

export default vectors;
