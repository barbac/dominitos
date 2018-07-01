import * as THREE from 'three';

function makeGripper() {
  const width = 5.4;
  const height = 10;
  const thickness = 2;

  const gripperModel = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, thickness),
    new THREE.MeshBasicMaterial({ color: 0x46f3ff, wireframe: true })
  );

  const gripperMarcSize = thickness / 3;
  const gripperMarc = new THREE.Mesh(
    new THREE.BoxGeometry(gripperMarcSize, gripperMarcSize, gripperMarcSize),
    new THREE.MeshBasicMaterial({ color: 'orange' })
  );
  gripperMarc.position.y = height / -2 + gripperMarcSize / 2;
  gripperMarc.position.z = thickness - gripperMarcSize / 2;
  gripperModel.add(gripperMarc);

  this.model = gripperModel;
  this.dimensions = {
    width,
    height,
    thickness,
  };
}

export default makeGripper;
