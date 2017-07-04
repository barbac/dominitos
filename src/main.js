import * as THREE from 'three';

const planeSize = 100;
const vehicleStartPosition = [-planeSize / 2 + 10, planeSize / 2 - 10];
const dominoes = [
  {
    x: 10,
    y: 0,
    z: 0,
    color: 'blue',
  },
  {
    x: 20,
    y: 0,
    z: 0,
    color: 'red',
  },
  {
    x: 30,
    y: 0,
    z: 0,
    color: 'yellow',
  },
];

const vehicleHeight = 10;
const vehicleWidth = 10;
const handRestPosition = new THREE.Vector3(
  0,
  vehicleHeight / 2 + 5,
  vehicleWidth / 2 - 10
);

const dominoHeight = 4.8;
const dominoWidth = 2.4;
const dominoThickness = 0.7;
//mass 8.35g

const dominoDispenserLocation = new THREE.Vector3(
  vehicleWidth / 2 + dominoHeight / 2,
  vehicleHeight / 2 - dominoThickness / 2,
  0
);

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
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  camera.position.x = planeSize / 2;
  camera.position.y = planeSize / 4;
  camera.position.z = planeSize / 2;
  camera.lookAt(new THREE.Vector3());

  const grid = new THREE.GridHelper(planeSize, planeSize);
  scene.add(grid);

  const sphere = new THREE.SphereGeometry(1, 32, 32);

  const centerIndicator = new THREE.Mesh(
    sphere,
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  scene.add(centerIndicator);

  vehicle = new THREE.Mesh(
    new THREE.BoxGeometry(vehicleWidth, vehicleHeight, vehicleWidth),
    new THREE.MeshBasicMaterial({ color: 0xff8c00, wireframe: true })
  );
  vehicle.position.set(
    vehicleStartPosition[0],
    vehicleHeight / 2,
    vehicleStartPosition[1]
  );
  scene.add(vehicle);

  const dispenser = new THREE.Mesh(
    new THREE.BoxGeometry(dominoHeight, dominoThickness, dominoHeight),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  dispenser.position.copy(dominoDispenserLocation);
  vehicle.add(dispenser);

  const handMaterial = new THREE.MeshBasicMaterial({ color: 0x7cfc00 });
  hand = new THREE.Mesh(sphere, handMaterial);
  hand.position.copy(handRestPosition);
  vehicle.add(hand);

  destination = new THREE.Mesh(
    sphere,
    new THREE.MeshBasicMaterial({ color: 0xff1493 })
  );
  scene.add(destination);

  const dominoGeometry = new THREE.BoxGeometry(
    dominoWidth,
    dominoHeight,
    dominoThickness
  );
  const materials = {
    blue: new THREE.MeshBasicMaterial({ color: 0x1e90ff }),
    yellow: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    red: new THREE.MeshBasicMaterial({ color: 0xb22222 }),
  };

  let domino;
  dominoMeshes = dominoes.map(dominoData => {
    domino = new THREE.Mesh(dominoGeometry, materials[dominoData.color]);
    domino.position.x = dominoData.x;
    domino.position.y = dominoHeight / 2;
    domino.position.z = dominoData.z;
    return domino;
  });
  scene.add(...dominoMeshes);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function* generateMovements() {
  /*
    BODY:
    rotate
    go to z position
    rotate right
    go to x position

    ARM:
    go to ready position(between dispenser and destination)
    go to pregrap position
    go to grap position
    grab
    go back to pregrap position
    go back to ready position
    go to predesitnation
    go to destination
    release
    go back to predesitnation
    go back ready position
    */

  const vehicleDominoGap = 20;
  const vehiclePosition = vehicle.position.clone();

  for (let data of dominoes) {
    destination.position.set(data.x, data.y, data.z);

    //move body
    const vehicleZDistance =
      vehiclePosition.z - (vehicleWidth / 2 + data.z + vehicleDominoGap);
    vehiclePosition.z -= vehicleZDistance;
    yield ['fordward', vehicleZDistance];

    const vehicleXDistance = data.x - vehiclePosition.x;
    vehiclePosition.x += vehicleXDistance;
    yield ['right', vehicleXDistance];
  }
}

function* moveObjects() {
  // const step = new THREE.Vector3();

  for (let [movement, delta] of generateMovements()) {
    // const currentDestination = destination.position;

    if (movement === 'fordward') {
      for (let i = 0; i <= delta; ++i) {
        vehicle.position.z -= 1;
        yield;
      }
    } else if (movement === 'right') {
      for (let i = 0; i <= delta; ++i) {
        vehicle.position.x += 1;
        yield;
      }
    }

    /*
    const handPosition = hand.getWorldPosition();
    const speedFactor = 8; //multiplied to make it slower.
    const distance = handPosition.distanceTo(currentDestination) * speedFactor;
    step.subVectors(currentDestination, handPosition);
    step.divideScalar(distance);

    //Move from rest position to current destination.
    for (let i = 0; i <= distance; ++i) {
      hand.position.add(step);
      mesh.rotation.y += 0.02;
      yield;
    }

    //reverse motion untill rest position.
    for (let i = 0; i <= distance; ++i) {
      hand.position.sub(step);
      mesh.rotation.y -= 0.02;
      yield;
    }
    */
  }
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
