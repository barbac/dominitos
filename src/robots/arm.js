import * as THREE from 'three';
import AbstractRobot from './AbstractRobot.js';

const wireframeParts = true;

const armDimensions = {
  // TODO: remove this from here.
  // vehicleHeight: 10,
  vehicleHeight: 0,
  vehicleWidth: 10,

  baseHeight: 10.8,
  armHeight: 13,
  forarmHeight: 14.8,
  //base + gripper = 15.8
  gripperBaseHeight: 5.8,

  gripperHeight: 10,
  gripperThickness: 2,
};

class Arm extends AbstractRobot {
  init() {
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

    const base = new THREE.Object3D();
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth, baseHeight, baseWidth),
      new THREE.MeshBasicMaterial({
        color: 0xff3311,
        wireframe: wireframeParts,
      })
    );
    //TODO: adjist after removing vehicleHeight
    // base.position.y = baseHeight / 2;
    base.position.y = vehicleHeight / 2 + baseHeight / 2;
    baseMesh.rotation.y = Math.PI / -2;
    base.add(baseMesh);
    this.model = base;

    //in front, bottom and right,
    const baseMark = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 'cyan' })
    );
    baseMesh.add(baseMark);
    baseMark.position.x = baseWidth / 4;
    baseMark.position.y = baseHeight / -4;
    baseMark.position.z = baseWidth / -2;

    const shoulder = new THREE.Object3D();
    shoulder.position.y = baseHeight / 2;
    baseMesh.add(shoulder);
    const shoulderMesh = new THREE.Mesh(joinGeometry, jointMaterial);
    shoulderMesh.rotation.z = Math.PI / 2;
    shoulder.add(shoulderMesh);

    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth, armHeight, baseWidth),
      new THREE.MeshBasicMaterial({
        color: 0xfff311,
        wireframe: wireframeParts,
      })
    );
    arm.position.y = armHeight / 2;
    const shoulderJoint = new THREE.Object3D();
    shoulderJoint.add(arm);
    shoulderJoint.rotation.x = Math.PI / -2;
    shoulder.add(shoulderJoint);

    const elbow = new THREE.Object3D();
    elbow.position.y = armHeight / 2;
    arm.add(elbow);
    const elbowMesh = new THREE.Mesh(joinGeometry, jointMaterial);
    elbowMesh.rotation.z = Math.PI / 2;
    elbow.add(elbowMesh);

    const forarm = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth, armHeight, baseWidth),
      new THREE.MeshBasicMaterial({
        color: 0x41f314,
        wireframe: wireframeParts,
      })
    );
    forarm.position.y = forarmHeight / 2;

    const elbowJoint = new THREE.Object3D();
    elbowJoint.add(forarm);
    elbowJoint.rotation.x = Math.PI / -2;

    elbow.add(elbowJoint);

    const wrist = new THREE.Object3D();
    wrist.position.y = forarmHeight / 2;
    const wristMesh = new THREE.Mesh(joinGeometry, jointMaterial);
    wristMesh.rotation.z = Math.PI / 2;
    wrist.add(wristMesh);

    forarm.add(wrist);

    const gripperBase = new THREE.Mesh(
      new THREE.BoxGeometry(baseWidth, gripperBaseHeight, baseWidth),
      new THREE.MeshBasicMaterial({ color: 'red', wireframe: wireframeParts })
    );
    gripperBase.position.y = gripperBaseHeight / 2;

    const wristPitchJoint = new THREE.Object3D();
    wristPitchJoint.add(gripperBase);
    wristPitchJoint.rotation.x = Math.PI / -2;

    wrist.add(wristPitchJoint);

    this.addControl(base, 'waist', 'y');
    this.addControl(shoulder, 'shoulder', 'x');
    this.addControl(elbow, 'elbow', 'x');
    this.addControl(wrist, 'wrist pitch', 'x');

    const endEffector = this.endEffector;
    if (!endEffector) {
      return;
    }

    gripperBase.add(endEffector.model);
    endEffector.model.position.y =
      gripperBaseHeight / 2 + endEffector.dimensions.height / 2;

    this.addControl(endEffector.model, 'wrist roll', 'y');

    this.mergeControls(endEffector);
  }
}

export default Arm;
export { armDimensions, Arm };
