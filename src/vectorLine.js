import * as THREE from 'three';

export default function(length, color) {
  const lineThickness = 0.2;
  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(length, lineThickness),
    new THREE.MeshBasicMaterial({ color: color })
  );
  line.position.x = length / 2;

  const tail = new THREE.Mesh(
    new THREE.CircleGeometry(lineThickness, 32),
    new THREE.MeshBasicMaterial({ color: 'lawngreen' })
  );
  tail.position.x = length / -2;
  line.add(tail);

  const triangleHeight = 0.5;
  const triangle = new THREE.Geometry();
  triangle.vertices.push(
    new THREE.Vector3(triangleHeight, 0, 0),
    new THREE.Vector3(-triangleHeight, triangleHeight, 0),
    new THREE.Vector3(-triangleHeight, -triangleHeight, 0)
  );
  triangle.faces.push(new THREE.Face3(0, 1, 2));

  const head = new THREE.Object3D();
  head.position.x = length / 2;
  line.add(head);

  const arrowHead = new THREE.Mesh(
    triangle,
    new THREE.MeshBasicMaterial({ color: 'magenta', wireframe: true })
  );
  arrowHead.position.x = -triangleHeight;
  head.add(arrowHead);

  const vectorLine = new THREE.Object3D();
  vectorLine.add(line);
  vectorLine.head = head;
  return vectorLine;
}
