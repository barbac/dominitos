import * as THREE from 'three';

function box() {
  return new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshBasicMaterial({ color: 'cyan' })
  );
}

export default box;
