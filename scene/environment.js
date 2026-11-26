import * as THREE from 'three';

export function buildEnvironment(scene, quality) {
  scene.background = new THREE.Color(0x0c0a08);
  scene.fog = new THREE.FogExp2(0x0c0a08, 0.085);

  // 1. Key Light (Warm Sunlight / Studio Key)
  const keyLight = new THREE.DirectionalLight(0xffefd7, 2.2);
  keyLight.position.set(3.5, 5.5, 3.2);
  if (quality.shadows) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 15;
    const frustum = 4.2;
    keyLight.shadow.camera.left = -frustum;
    keyLight.shadow.camera.right = frustum;
    keyLight.shadow.camera.top = frustum;
    keyLight.shadow.camera.bottom = -frustum;
    keyLight.shadow.bias = -0.0005;
  }
  scene.add(keyLight);

  // 2. Hemisphere Ambient Fill (Warm Sky / Espresso Ground)
  const hemiLight = new THREE.HemisphereLight(0xffe6cc, 0x261a12, 0.75);
  scene.add(hemiLight);

  // 3. Cool Rim / Fill Light for Architectural Depth
  const fillLight = new THREE.DirectionalLight(0x88aadd, 0.45);
  fillLight.position.set(-4.0, 2.8, -2.5);
  scene.add(fillLight);

  // Warm Pendant Point Lights over Bar & Roaster
  const barGlow = new THREE.PointLight(0xff9442, 2.4, 5.5, 1.6);
  barGlow.position.set(-0.85, 2.35, 0.25);
  scene.add(barGlow);

  const roasterGlow = new THREE.PointLight(0xff8533, 2.0, 5.0, 1.6);
  roasterGlow.position.set(1.25, 2.35, -0.4);
  scene.add(roasterGlow);

  // Floating Ambient Aroma / Dust Particles
  const count = quality.particleCount;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5.2;
    positions[i * 3 + 1] = 0.4 + Math.random() * 2.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    speeds[i] = 0.08 + Math.random() * 0.14;
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const dustMat = new THREE.PointsMaterial({
    color: 0xffd2a6,
    size: 0.024,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const dustPoints = new THREE.Points(dustGeo, dustMat);
  scene.add(dustPoints);

  return {
    update(elapsed) {
      const posAttr = dustGeo.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = posAttr.getY(i) + speeds[i] * 0.012;
        if (y > 2.95) y = 0.45;
        posAttr.setY(i, y);
        posAttr.setX(i, posAttr.getX(i) + Math.sin(elapsed * 0.6 + i) * 0.0006);
      }
      posAttr.needsUpdate = true;
    }
  };
}
