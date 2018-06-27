import * as THREE from 'three';
import RotationControlValues from './controlValues.js';
import Macro from '../macros/Macro.js';

const wireframeParts = true;

const armDimensions = {
  vehicleHeight: 10,
  vehicleWidth: 10,

  baseHeight: 10.8,
  armHeight: 13,
  forarmHeight: 14.8,
  //base + gripper = 15.8
  gripperBaseHeight: 5.8,

  gripperHeight: 10,
  gripperThickness: 2,
};

function makeArm(endEffector) {
  const {
    vehicleHeight,

    baseHeight,
    armHeight,
    forarmHeight,
    //base + gripper = 15.8
    gripperBaseHeight,
    // gripperHeight,
    // gripperThickness,
  } = armDimensions;

  const baseWidth = baseHeight / 2;

  const jointRadius = baseHeight / 4;
  const joinGeometry = new THREE.CylinderGeometry(
    jointRadius,
    jointRadius,
    baseWidth,
    32
  );
  const jointMaterial = new THREE.MeshBasicMaterial({ color: 0x7cfc00 });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(baseWidth, baseHeight, baseWidth),
    new THREE.MeshBasicMaterial({
      color: 0xff3311,
      wireframe: wireframeParts,
    })
  );
  base.position.y = vehicleHeight / 2 + baseHeight / 2;

  const shoulder = new THREE.Object3D();
  shoulder.position.y = baseHeight / 2;
  base.add(shoulder);
  const shoulderMesh = new THREE.Mesh(joinGeometry, jointMaterial);
  shoulderMesh.rotation.z = Math.PI / 2;
  shoulder.add(shoulderMesh);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(baseWidth, armHeight, baseWidth),
    new THREE.MeshBasicMaterial({ color: 0xfff311, wireframe: wireframeParts })
  );
  arm.position.y = armHeight / 2;
  shoulder.add(arm);

  const elbow = new THREE.Object3D();
  elbow.position.y = armHeight / 2;
  arm.add(elbow);
  const elbowMesh = new THREE.Mesh(joinGeometry, jointMaterial);
  elbowMesh.rotation.z = Math.PI / 2;
  elbow.add(elbowMesh);

  const forarm = new THREE.Mesh(
    new THREE.BoxGeometry(baseWidth, armHeight, baseWidth),
    new THREE.MeshBasicMaterial({ color: 0x41f314, wireframe: wireframeParts })
  );
  forarm.position.y = forarmHeight / 2;
  elbow.add(forarm);

  const wrist = new THREE.Object3D();
  wrist.position.y = forarmHeight / 2;
  forarm.add(wrist);
  const wristMesh = new THREE.Mesh(joinGeometry, jointMaterial);
  wristMesh.rotation.z = Math.PI / 2;
  wrist.add(wristMesh);

  const gripperBase = new THREE.Mesh(
    new THREE.BoxGeometry(baseWidth, gripperBaseHeight, baseWidth),
    new THREE.MeshBasicMaterial({ color: 'red', wireframe: wireframeParts })
  );
  gripperBase.position.y = gripperBaseHeight / 2;
  wrist.add(gripperBase);

  gripperBase.add(endEffector.model);
  endEffector.model.position.y =
    gripperBaseHeight / 2 + endEffector.dimensions.height / 2;

  const macro = new Macro('default macro');

  const controls = new Map();

  let control = new RotationControlValues(base, 'waist', 'y', macro);
  controls.set(control.name, control);

  control = new RotationControlValues(shoulder, 'shoulder', 'x', macro);
  controls.set(control.name, control);

  control = new RotationControlValues(elbow, 'elbow', 'x', macro);
  controls.set(control.name, control);

  control = new RotationControlValues(wrist, 'wrist pitch', 'x', macro);
  controls.set(control.name, control);

  control = new RotationControlValues(
    endEffector.model,
    'wrist roll',
    'y',
    macro
  );
  controls.set(control.name, control);

  if (endEffector.controls) {
    for (const [name, control] of endEffector.controls.entries()) {
      control.macro = macro;
      controls.set(name, control);
    }
  }

  return {
    controls,
    model: base,
    macro,
  };
}

export default makeArm;
export { armDimensions, makeArm };
