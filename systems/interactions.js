
import * as THREE from 'three';

export class HotspotSystem {
  constructor(scene, camera, domElement, hotspotsConfig, onSelectHotspot) {
    this.camera = camera;
    this.domElement = domElement;
    this.onSelectHotspot = onSelectHotspot;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.nodes = [];
    this.rings = [];

    const coreGeo = new THREE.SphereGeometry(0.065, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff8c42 });
    const ringGeo = new THREE.RingGeometry(0.09, 0.125, 28);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff8c42,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });

    hotspotsConfig.forEach((data) => {
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(...data.position);
      core.userData = data;

      const ring = new THREE.Mesh(ringGeo, ringMat.clone());
      ring.position.copy(core.position);

      scene.add(core, ring);
      this.nodes.push(core);
      this.rings.push(ring);
    });

    this.domElement.addEventListener('pointerdown', (e) => this.handlePointer(e));
  }

  handlePointer(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.nodes, false);

    if (hits.length > 0) {
      this.onSelectHotspot(hits[0].object.userData);
    }
  }

  update(elapsed) {
    const pulse = 1 + Math.sin(elapsed * 3.2) * 0.22;
    this.rings.forEach((ring) => {
      ring.lookAt(this.camera.position);
      ring.scale.setScalar(pulse);
    });
  }
}
