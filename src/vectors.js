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
  camera.position.y = 15;

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

  let length0 = 20.8 - 10; // y axis
  const length1 = 13;
  const length2 = 14.8;
  let length3 = 15.8;
  const length4 = 10; // x axis

  if (length3 > length0) {
    const _length0 = length0;
    length0 = length3;
    length3 = _length0;
  }

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

  const l2 = length4;
  const l1 = length0 - length3;
  const l3Square = l2 ** 2 + l1 ** 2;
  const iangleA = Math.atan(l2 / l1);
  // const iangleE = Math.atan(l1 / l2);
  const iangleC = Math.acos(
    (-l3Square + length1 ** 2 + length2 ** 2) / (2 * length1 * length2)
  );
  const iangleB = Math.acos(
    (-(length2 ** 2) + l3Square + length1 ** 2) /
      (2 * Math.sqrt(l3Square) * length1)
  );
  // const iangleD = Math.acos(
  //   (-(length1**2) + l3Square + length2**2) /
  //   (2 * Math.sqrt(l3Square) * length2)
  // );

  const angle1 = iangleA + iangleB;

  line1.rotation.z = angle1 - PI / 2;
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
