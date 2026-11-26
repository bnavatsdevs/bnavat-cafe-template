import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const CAMERA_PRESETS = {
  counter: { pos: new THREE.Vector3(-1.65, 2.05, 3.15), target: new THREE.Vector3(-0.3, 1.15, 0.1) },
  roastery: { pos: new THREE.Vector3(2.35, 2.15, 2.55), target: new THREE.Vector3(0.85, 1.25, -0.3) },
  lounge: { pos: new THREE.Vector3(0.15, 2.75, 4.35), target: new THREE.Vector3(0, 1.0, 0) }
};

export class CameraRig {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enablePan = false;
    this.controls.minDistance = 2.1;
    this.controls.maxDistance = 6.2;
    this.controls.minPolarAngle = Math.PI * 0.18;
    this.controls.maxPolarAngle = Math.PI * 0.47;

    this.targetPos = CAMERA_PRESETS.counter.pos.clone();
    this.targetLook = CAMERA_PRESETS.counter.target.clone();
    this.isTransitioning = false;

    this.camera.position.copy(this.targetPos);
    this.controls.target.copy(this.targetLook);

    this.controls.addEventListener('start', () => {
      this.isTransitioning = false;
    });
  }

  flyTo(presetKey) {
    const preset = CAMERA_PRESETS[presetKey];
    if (!preset) return;
    this.targetPos.copy(preset.pos);
    this.targetLook.copy(preset.target);
    this.isTransitioning = true;
  }

  update(delta) {
    if (this.isTransitioning) {
      const step = Math.min(1, delta * 3.2);
      this.camera.position.lerp(this.targetPos, step);
      this.controls.target.lerp(this.targetLook, step);
      if (this.camera.position.distanceTo(this.targetPos) < 0.02) {
        this.isTransitioning = false;
      }
    }
    this.controls.update();
  }
}
