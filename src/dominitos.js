import * as THREE from 'three';
import makeArm from './arm.js';
import moveCommands from './moveCommands.js';

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
  {
    x: 50,
    y: 0,
    z: 0,
    color: 'blue',
  },
];

const planeSize = 130;

const vehicleHeight = 10;
const vehicleWidth = 10;
const vehicleStartPosition = new THREE.Vector3(
  -planeSize / 2 + 10,
  vehicleHeight / 2,
  planeSize / 2 - 10
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
let vehicle, arm;
let destination;
let dominoMeshes;
let processFrame;

const cameraPositions = {
  bottomRight: [planeSize / 2, planeSize / 4, planeSize / 2],
  middleRight: [planeSize / 1.5, planeSize / 4, 0],
  inFrontOfVehicle: [vehicleStartPosition.x, vehicleHeight, vehicleWidth * -2],
};
let cameraPosition = cameraPositions.inFrontOfVehicle;
let cameraFollowVehicle = false;
if (cameraPosition === cameraPositions.inFrontOfVehicle) {
  cameraFollowVehicle = true;
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  camera.position.fromArray(cameraPosition);
  camera.lookAt(new THREE.Vector3());

  //plane

  const grid = new THREE.GridHelper(planeSize, planeSize);
  scene.add(grid);

  const sphere = new THREE.SphereGeometry(1, 32, 32);

  const centerIndicator = new THREE.Mesh(
    sphere,
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  scene.add(centerIndicator);

  //vehicle

  vehicle = new THREE.Mesh(
    new THREE.BoxGeometry(vehicleWidth, vehicleHeight, vehicleWidth),
    new THREE.MeshBasicMaterial({ color: 0xff8c00, wireframe: true })
  );
  vehicle.position.copy(vehicleStartPosition);
  scene.add(vehicle);

  const markWidth = vehicleWidth / 10;
  const topRightMark = new THREE.Mesh(
    new THREE.BoxGeometry(markWidth, markWidth, markWidth),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  topRightMark.position.set(
    vehicleWidth / 2,
    vehicleHeight / 2 - markWidth / 2,
    -vehicleWidth / 2
  );
  vehicle.add(topRightMark);

  const dispenser = new THREE.Mesh(
    new THREE.BoxGeometry(dominoHeight, dominoThickness, dominoHeight),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  dispenser.position.copy(dominoDispenserLocation);
  vehicle.add(dispenser);

  //arm

  arm = makeArm(vehicleHeight);
  vehicle.add(arm.base);

  //dominoes

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

function* moveObjects() {
  const rotationStep = Math.PI / 180;
  const partSettings = {
    shoulderDown: {
      part: arm.shoulder,
      step: -rotationStep,
    },
    shoulderUp: {
      part: arm.shoulder,
      step: rotationStep,
    },
  };

  for (let [movement, delta] of moveCommands(
    dominoes,
    vehicle.position,
    vehicleWidth,
    destination
  )) {
    if (movement === 'fordward') {
      if (cameraFollowVehicle) {
        camera.lookAt(vehicle.position);
      }

      const initialZPosition = vehicle.position.z;
      for (let i = 0; i <= delta; ++i) {
        vehicle.position.z -= 1;
        yield;
      }
      //since delta is not an integer the for loop can get a little farder.
      vehicle.position.z = initialZPosition - delta;
      yield;
    } else if (movement === 'right') {
      const initialPosition = vehicle.position.x;
      for (let i = 0; i <= delta; ++i) {
        vehicle.position.x += 1;

        if (cameraFollowVehicle) {
          camera.position.x = vehicle.position.x;
          camera.lookAt(vehicle.position);
        }

        yield;
      }

      //since delta is not an integer the for loop can get a little farder.
      vehicle.position.x = initialPosition + delta;
      yield;
    } else {
      const settings = partSettings[movement];
      for (let i = 0; i <= delta; i += rotationStep) {
        settings.part.rotation.x += settings.step;
        yield;
      }
    }
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

function dominitos() {
  init();
  animationInit();
  animate();
}

export default dominitos;