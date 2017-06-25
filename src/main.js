import * as THREE from 'three';


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


init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 1, 10000
  );
  camera.position.z = 1000;

  const handGeometry = new THREE.SphereGeometry(15, 32, 32);
  const handMaterial = new THREE.MeshBasicMaterial({ color: 0x7CFC00 });
  hand = new THREE.Mesh(handGeometry, handMaterial);
  hand.position.x = -1600;
  hand.position.y = 0;
  hand.position.z = -600;
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

function animate() {

  renderer.render(scene, camera);
}
