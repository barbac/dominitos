import * as THREE from 'three';

let scene, camera, renderer;

const planeSize = 130;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  const cameraPosition = [planeSize / 2, planeSize / 4, planeSize / 2];
  camera.position.fromArray(cameraPosition);
  camera.lookAt(new THREE.Vector3());

  //helper grids

  const grid = new THREE.GridHelper(planeSize, planeSize);
  scene.add(grid);

  const middleLineColor = 'yellow';

  const gridLeftX = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'red'
  );
  gridLeftX.rotateZ(Math.PI / 2);
  gridLeftX.position.x = -halfPlaneSize;
  scene.add(gridLeftX);

  const gridRightX = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'orange'
  );
  gridRightX.rotateZ(Math.PI / 2);
  gridRightX.position.x = halfPlaneSize;
  scene.add(gridRightX);

  const gridFarZ = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'green'
  );
  gridFarZ.rotateX(Math.PI / 2);
  gridFarZ.position.z = -halfPlaneSize;
  scene.add(gridFarZ);

  const gridCloseZ = new THREE.GridHelper(
    planeSize,
    planeSize,
    middleLineColor,
    'blue'
  );
  gridCloseZ.rotateX(Math.PI / 2);
  gridCloseZ.position.z = halfPlaneSize;
  scene.add(gridCloseZ);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log(renderer.domElement);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function worldView() {
  init();
  animate();
}

export default worldView;
