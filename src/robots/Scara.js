import * as THREE from 'three';

import vectorLine from '../vectorLine.js';
import utils from '../utils.js';

const INTERVAL_MILLIS = 20;
let disableNetwork = true;
const PI = Math.PI;
let scene, camera, renderer;
const planeSize = 100;
const halfPlaneSize = planeSize / 2;

const length0 = 10;
const length1 = 10;
let link0, link1;
let endEffector;

function* points2() {
  const positions = [
    [0.7165795677282715, 1.5019304498022463],
    [1.479559566015625, 0.87916234453125],
    [2.398604686288183, 0.5106088672615194],
    [3.4008801421034214, 0.5848651692658376],
    [4.234173906580071, 1.1084412457086008],
    [4.8790057178489805, 1.8633834047524815],
    [5.647567378414154, 2.5034561182305812],
    [6.605015602481841, 2.724599441110849],
    [7.595720135009765, 2.55221248979187],
    [8.573827975205326, 2.4079685000233235],
    [9.087611532157897, 3.1895727442928314],
    [8.865929508447996, 4.147849474104388],
    [8.260457748023823, 4.936327415770921],
    [7.5137606381820445, 5.618654376450128],
    [6.739649192970276, 6.22924964816475],
    [5.945688652412867, 6.857968246488565],
    [5.547958432518005, 7.640553192008591],
  ];

  let lastX = positions[1][0];
  let lastY = positions[1][1];
  for (const _p of positions) {
    const x = _p[0];
    const y = _p[1];
    let slope = (y - lastY) / (x - lastX);
    if (Number.isNaN(slope)) {
      slope = 0;
    }
    yield [x, y, slope];
    lastX = x;
    lastY = y;
  }
}
console.log(points2);

function* points() {
  function _y(x) {
    return Math.sin(x * 0.5) * 6 + 10;
  }

  let lastX = -15;
  let lastY = _y(lastX);

  for (let x = -15; x < 15; x += 0.01) {
    const y = _y(x);
    const slope = (y - lastY) / (x - lastX);
    yield [x, y, slope];
    lastX = x;
    lastY = y;
  }
}

function init() {
  scene = new THREE.Scene();
  const aspectRation = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    (aspectRation * halfPlaneSize) / -2,
    (aspectRation * halfPlaneSize) / 2,
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

  const _points = [];
  for (const point of points()) {
    _points.push(new THREE.Vector2(point[0], point[1]));
  }

  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(_points);
  const pointsMaterial = new THREE.LineBasicMaterial({ color: 'white' });
  const curve = new THREE.Line(pointsGeometry, pointsMaterial);
  scene.add(curve);

  link0 = vectorLine(length0, 'lime');
  scene.add(link0);
  const link1Container = new THREE.Object3D();
  link1 = vectorLine(length1, 'orange');
  link0.head.add(link1Container);
  link1Container.add(link1);

  const cutterThickness = 0.1;
  const cutterWidth = 4;
  endEffector = new THREE.Mesh(
    new THREE.PlaneGeometry(cutterWidth, cutterThickness),
    new THREE.MeshBasicMaterial({ color: 'skyblue' })
  );
  endEffector.rotation.z = Math.PI / 2;
  link1.head.add(endEffector);
}

function* angles(points) {
  console.log('init points', points);
  const targetPoint = new THREE.Vector2();

  for (const point of points) {
    console.log('target point', point);
    targetPoint.x = point[0];
    targetPoint.y = point[1];
    const slope = point[2];

    //this would be like the 3rd side of a triangle
    const length2 = targetPoint.length();
    if (length0 + length1 < length2) {
      console.log(length0 + length1, length2);
      console.log('Point out of reach', targetPoint);
      return;
    }

    //internal angles of a triangle.
    //these would be correct if the 3rd side would be horizontal.
    const angle0 = Math.acos(
      (length1 ** 2 - length0 ** 2 - length2 ** 2) / (-2 * length0 * length2)
    );
    const angle1 = Math.acos(
      (length2 ** 2 - length0 ** 2 - length1 ** 2) / (-2 * length0 * length1)
    );

    const endEffectorAngle = Math.atan(slope);
    console.log(
      'angles',
      utils.degrees(angle0),
      utils.degrees(angle1),
      utils.degrees(targetPoint.angle())
    );

    // link0 is parent of link1.
    // link1 is parent of endEffector.
    // have to add target point angle since the 3rd side may not be horizontal.
    const finalAngle0 = angle0 + targetPoint.angle();
    const angles = [
      finalAngle0,
      // the links are colinear.
      // come back 180 degrees to start counting from 0 counter clock wise.
      angle1 - PI,
      // undo angle 0 and 1 again to start from 0.
      endEffectorAngle - finalAngle0 - angle1,
    ];
    console.log(
      'final angles',
      utils.degrees(angles[0]),
      utils.degrees(angles[0]),
      utils.degrees(angles[0])
    );
    yield angles;
  }
}

const anglesGenerator = angles(points());

function postRequest(radians0, radians1) {
  const degrees0 = Math.round(utils.degrees(radians0));
  const degrees1 = Math.round(utils.degrees(radians1));
  if (disableNetwork) {
    console.log('post degrees', degrees0, degrees1);
    return;
  }

  window
    .fetch(`${SERVER_URL}/?0=${degrees0}&1=${degrees1}`, {
      method: 'GET',
    })
    .then(response => {
      return response.text();
    })
    .then(text => {
      console.log('response:', text);
    });
}

let lastTimestamp = 0;
function animate(timestamp) {
  const timeDelta = timestamp - lastTimestamp;
  if (timeDelta >= INTERVAL_MILLIS) {
    const currentPoint = anglesGenerator.next();
    if (currentPoint.done) {
      return;
    }
    link0.rotation.z = currentPoint.value[0];
    link1.rotation.z = currentPoint.value[1];
    endEffector.rotation.z = currentPoint.value[2];

    postRequest(currentPoint.value[0], currentPoint.value[1]);
    lastTimestamp = timestamp;
  }

  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function Scara() {
  init();
  animate();
  // window.n = () => animate(new Date());
  // window.n();
}

export default Scara;
