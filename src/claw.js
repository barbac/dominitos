import * as THREE from 'three';
import RotationControlValues from './robots/controlValues.js';

const PI = Math.PI;
const BASE_HEIGHT = 4;

function makeTalonMesh() {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.bezierCurveTo(-4.9954, -0.1806, -10.3856, 5.7571, -10.7075, 10.4989);
  shape.bezierCurveTo(-11.0409, 15.4116, -6.0968, 21.2416, -6.0968, 21.2416);
  shape.lineTo(-6.0968, 30.691);
  shape.bezierCurveTo(-6.0968, 30.691, -23.1764, 48.6782, -21.2159, 74.3472);
  shape.bezierCurveTo(-18.8135, 105.8013, 5.923, 120.4644, 8.03, 120.7438);
  shape.bezierCurveTo(10.0435, 121.0109, 12.452, 119.2719, 13.0855, 117.342);
  shape.bezierCurveTo(13.6385, 115.657, 12.5571, 113.5747, 11.2901, 112.3338);
  shape.bezierCurveTo(9.8825, 110.9555, -12.4912, 90.8667, -11.4573, 73.4521);
  shape.bezierCurveTo(-10.6705, 60.1992, 1.2737, 37.4946, 1.2737, 37.4946);
  shape.lineTo(6.1874, 30.502);
  shape.lineTo(5.9984, 21.1471);
  shape.bezierCurveTo(5.9984, 21.1471, 10.1002, 17.5011, 10.1332, 11.485);
  shape.bezierCurveTo(10.1662, 5.4688, 5.1021, 0.1845, 0.0, 0.0);
  shape.lineTo(0, 0);

  const extrudeSettings = { depth: 1, bevelEnabled: false, steps: 1 };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshBasicMaterial({
    color: 'hotpink',
    wireframe: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.position.z = -40;
  const scaleFactor = 0.2;
  mesh.scale.x = scaleFactor;
  mesh.scale.y = scaleFactor;
  mesh.scale.z = scaleFactor;
  return mesh;
}

function makeBase() {
  const geometry = new THREE.BoxGeometry(9.5, BASE_HEIGHT, 9.5);
  const material = new THREE.MeshBasicMaterial({
    color: 'pink',
    wireframe: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function makeClaw() {
  const talonsDistrance = 2.5;

  const talon1 = makeTalonMesh();
  talon1.position.x = -talonsDistrance;
  talon1.position.z -= 5;

  const talon2 = makeTalonMesh();
  talon2.rotation.y = PI;
  talon2.position.x = talonsDistrance;
  talon2.position.z -= 5;

  const talon3 = makeTalonMesh();
  talon3.position.x = -talonsDistrance;
  talon3.position.z += 5;

  const talon4 = makeTalonMesh();
  talon4.rotation.y = PI;
  talon4.position.x = talonsDistrance;
  talon4.position.z += 5;

  const base = makeBase();

  const clawObject3d = new THREE.Object3D();
  clawObject3d.add(base, talon1, talon2, talon3, talon4);

  const controls = new Map();
  function setRadians(value) {
    const rotation = PI / 2 - value / 2;
    talon1.rotation.z = rotation;
    talon2.rotation.z = rotation;
    talon3.rotation.z = rotation;
    talon4.rotation.z = rotation;
  }

  const control = new RotationControlValues(clawObject3d, 'claw', 'y', setRadians);
  controls.set(control.name, control);
  controls.get('claw').degrees = 0; //set the initial angles.

  const claw = {
    controls,
    model: clawObject3d,
    dimensions: {
      height: BASE_HEIGHT,
    },
  };

  return claw;
}

export default makeClaw;
