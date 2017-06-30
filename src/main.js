import * as THREE from 'three';
import _ from 'lodash';


const planeSize = 100;
const vehicleStartPosition = [
  -planeSize / 2 + 10,
  planeSize / 2 - 10
];
const dominoes = [
  {
    x: 10, y: 0, z: 0,
    color: 'blue',
  },
  {
    x: 20, y: 0, z: 0,
    color: 'red',
  },
  {
    x: 30, y: 0, z: 0,
    color: 'yellow',
  },
];

const vehicleHeight = 10;
const vehicleWidth = 10;

const dominoHeight = 4.8;
const dominoWidth = 2.4;
const dominoThickness = 0.7;

let scene, camera, renderer;
let vehicle, hand, destination;
let dominoMeshes;
let processFrame;


init();
animationInit();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 1, 10000
  );

  camera.position.x = planeSize / 2;
  camera.position.y = planeSize / 4;
  camera.position.z = planeSize / 2;
  camera.lookAt(new THREE.Vector3());

  const grid = new THREE.GridHelper(planeSize, planeSize);
  scene.add(grid);

  const sphere = new THREE.SphereGeometry(1, 32, 32);

  const centerIndicator = new THREE.Mesh(
    sphere, new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  );
  scene.add(centerIndicator);

  vehicle = new THREE.Mesh(
    new THREE.BoxGeometry(vehicleWidth, vehicleHeight, vehicleWidth),
    new THREE.MeshBasicMaterial({ color: 0xFF8C00, wireframe: true })
  );
  vehicle.position.set(
    vehicleStartPosition[0], vehicleHeight / 2, vehicleStartPosition[1]
  );
  scene.add(vehicle);

  const handMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFC00 });
  hand = new THREE.Mesh(sphere, handMaterial);
  hand.position.x = -planeSize / 2;
  hand.position.y = 0;
  hand.position.z = planeSize / 2;
  scene.add(hand);

  destination = new THREE.Mesh(
    sphere, new THREE.MeshBasicMaterial({ color: 0xFF1493 })
  );
  scene.add(destination);

  const dominoGeometry = new THREE.BoxGeometry(
    dominoWidth, dominoHeight, dominoThickness
  );
  const materials = {
    blue: new THREE.MeshBasicMaterial({ color: 0x1E90FF }),
    yellow: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    red: new THREE.MeshBasicMaterial({ color: 0xB22222 }),
  };

  let domino;
  dominoMeshes = dominoes.map(dominoData => {
    domino = new THREE.Mesh(dominoGeometry, materials[dominoData.color]);
    domino.position.x = dominoData.x;
    // domino.position.y = dominoData.y;
    domino.position.z = dominoData.z;
    return domino;
  });
  scene.add(...dominoMeshes);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

}

function* moveObjects() {
  const step = new THREE.Vector3();

  for (let [data, mesh] of _.zip(dominoes, dominoMeshes)) {
    destination.position.set(data.x, data.y, data.z);
    const currentDestination = destination.position;

    //move body
    const vehicleDominoGap = 20;
    const vehicleZDistance = (
      (vehicle.position.z - vehicleWidth / 2) - (data.z + vehicleDominoGap)
    );
    for (let i = 0; i <= vehicleZDistance; ++i) {
      vehicle.position.z -= 1;
      yield;
    }

    const vehicleXDistance = data.x - vehicle.position.x;
    for (let i = 0; i <= vehicleXDistance; ++i) {
      vehicle.position.x += 1;
      yield;
    }


    //set hand position
    hand.position.x = data.x;
    hand.position.z = data.z + 20;
    const handPosition = hand.position;
    yield;

    //Move from rest position to current destination.
    //multiplied by 3 to make it slower.
    const distance = handPosition.distanceTo(currentDestination) * 8;
    step.subVectors(currentDestination, handPosition);
    step.divideScalar(distance);
    for (let i = 0; i <= distance; ++i) {
      hand.position.add(step);
      mesh.rotation.y += 0.02;
      yield;
    }

    //reverse motion untill rest position.

    // break;
  };
}

function animationInit() {
  processFrame = moveObjects();
}

function animate() {
  if (!processFrame.next().done) {
    requestAnimationFrame(animate);
  } else {
    console.log('done');
  }

  renderer.render(scene, camera);
}
