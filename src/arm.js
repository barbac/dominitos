import * as THREE from 'three';
import rotationControlValues from './robots/controlValues.js';

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

function makeArm() {
  const {
    vehicleHeight,

    baseHeight,
    armHeight,
    forarmHeight,
    //base + gripper = 15.8
    gripperBaseHeight,
    gripperHeight,
    gripperThickness,
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
    new THREE.MeshBasicMaterial({ color: 0x4613f4, wireframe: wireframeParts })
  );
  gripperBase.position.y = gripperBaseHeight / 2;
  wrist.add(gripperBase);

  const gripper = new THREE.Mesh(
    new THREE.BoxGeometry(baseWidth, gripperHeight, gripperThickness),
    new THREE.MeshBasicMaterial({ color: 0x46f3ff, wireframe: wireframeParts })
  );
  gripper.position.y = gripperBaseHeight / 2 + gripperHeight / 2;
  gripperBase.add(gripper);

  const gripperMarcSize = gripperThickness / 3;
  const gripperMarc = new THREE.Mesh(
    new THREE.BoxGeometry(gripperMarcSize, gripperMarcSize, gripperMarcSize),
    new THREE.MeshBasicMaterial({ color: 'orange' })
  );
  gripperMarc.position.y = gripperHeight / -2 + gripperMarcSize / 2;
  gripperMarc.position.z = gripperThickness - gripperMarcSize / 2;
  gripper.add(gripperMarc);

  const controls = new Map();
  controls.set(...rotationControlValues(base, 'waist', 'y'));
  controls.set(...rotationControlValues(shoulder, 'shoulder', 'x'));
  controls.set(...rotationControlValues(elbow, 'elbow', 'x'));
  controls.set(...rotationControlValues(wrist, 'wrist pitch', 'x'));
  controls.set(...rotationControlValues(gripper, 'wrist roll', 'y'));

  return {
    controls,
    model: base,
  };
}

export default makeArm;
export { armDimensions, makeArm };
