import * as THREE from 'three';
import _ from 'lodash';


const dominoes = [
  {
    x: 0, y: 0, z:0,
    color: 'blue',
  },
  {
    x: 120, y: 0, z:0,
    color: 'red',
  },
  {
    x: 240, y: 0, z:0,
    color: 'yellow',
  },
];

let scene, camera, renderer;
let hand, destination;
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

  const planeSize = 1000;
  camera.position.x = planeSize / 2;
  camera.position.y = planeSize / 4;
  camera.position.z = planeSize / 2;
  camera.lookAt(new THREE.Vector3());

  const grid = new THREE.GridHelper(planeSize, planeSize / 10);
  scene.add(grid);

  const handGeometry = new THREE.SphereGeometry(15, 32, 32);
  const handMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFC00 });
  hand = new THREE.Mesh(handGeometry, handMaterial);
  hand.position.x = 1000;
  hand.position.y = 0;
  hand.position.z = 1000;
  scene.add(hand);

  destination = new THREE.Mesh(handGeometry, new THREE.MeshBasicMaterial({ color: 0xFF1493 }));
  scene.add(destination);

  const dominoGeometry = new THREE.BoxGeometry(100, 200, 20);
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
  const handPosition = new THREE.Vector3();
  handPosition.copy(hand.position);
  const step = new THREE.Vector3();

  for (let [data, mesh] of _.zip(dominoes, dominoMeshes)) {
    destination.position.set(data.x, data.y, data.z);
    const currentDestination = destination.position;

    //nove body

    //set hand position
    hand.position.copy(handPosition);

    //Move from rest position to current destination.
    //divided by 7 to make it faster.
    const distance = handPosition.distanceTo(currentDestination) / 7;
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
