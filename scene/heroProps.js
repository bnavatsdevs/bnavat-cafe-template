import * as THREE from 'three';

export function buildHeroProps(scene, theme) {
  const group = new THREE.Group();

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe6e2dc,
    roughness: 0.16,
    metalness: 0.92
  });

  const matteBlackMat = new THREE.MeshStandardMaterial({
    color: 0x161618,
    roughness: 0.45,
    metalness: 0.35
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: theme.brassColor,
    roughness: 0.25,
    metalness: 0.88
  });

  const ceramicMat = new THREE.MeshStandardMaterial({
    color: 0xf4eee5,
    roughness: 0.32,
    metalness: 0.04
  });

  // 1. Sculpted Dual-Group Espresso Machine on Counter
  const machine = new THREE.Group();
  machine.position.set(-1.1, 0.99, 0.05);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.42, 0.48), matteBlackMat);
  body.position.y = 0.21;
  body.castShadow = true;

  const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.04, 0.5), chromeMat);
  topRail.position.y = 0.43;

  // Dual Group Heads & Portafilters
  [-0.18, 0.18].forEach((gx) => {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.08, 20), chromeMat);
    head.position.set(gx, 0.25, 0.26);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.16, 12), brassMat);
    handle.rotation.x = Math.PI / 2.2;
    handle.position.set(gx, 0.21, 0.35);

    machine.add(head, handle);
  });

  // Pressure Gauge
  const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 20), brassMat);
  gauge.rotation.x = Math.PI / 2;
  gauge.position.set(0, 0.33, 0.245);
  machine.add(body, topRail, gauge);
  group.add(machine);

  // 2. Ceramic Pour-Over Carafe & Cup (LatheGeometry)
  const cupPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.055, 0.0),
    new THREE.Vector2(0.072, 0.11),
    new THREE.Vector2(0.066, 0.11),
    new THREE.Vector2(0.05, 0.012),
    new THREE.Vector2(0.0, 0.012)
  ];
  const cupGeo = new THREE.LatheGeometry(cupPoints, 28);
  const cup = new THREE.Mesh(cupGeo, ceramicMat);
  cup.position.set(-0.35, 0.99, 0.32);
  cup.castShadow = true;
  group.add(cup);

  // 3. Small-Batch Coffee Roaster Drum (Right Side Hero)
  const roaster = new THREE.Group();
  roaster.position.set(1.25, 0.0, -0.45);

  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.88, 0.72), matteBlackMat);
  stand.position.y = 0.44;
  stand.castShadow = true;

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.62, 28), brassMat);
  drum.rotation.z = Math.PI / 2;
  drum.position.set(0, 1.12, 0);
  drum.castShadow = true;

  const hopper = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.34, 24, 1, true), chromeMat);
  hopper.rotation.x = Math.PI;
  hopper.position.set(0, 1.52, 0);

  const coolingTray = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 28), chromeMat);
  coolingTray.position.set(0, 0.92, 0.34);

  roaster.add(stand, drum, hopper, coolingTray);
  group.add(roaster);

  // 4. Procedural Rising Steam Wisps Above Ceramic Cup
  const steamCount = 18;
  const steamGeo = new THREE.BufferGeometry();
  const steamPos = new Float32Array(steamCount * 3);
  const steamOffsets = new Float32Array(steamCount);

  for (let i = 0; i < steamCount; i++) {
    steamOffsets[i] = i / steamCount;
    steamPos[i * 3] = -0.35;
    steamPos[i * 3 + 1] = 1.12 + steamOffsets[i] * 0.42;
    steamPos[i * 3 + 2] = 0.32;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));

  const steamMat = new THREE.PointsMaterial({
    color: 0xf7efe6,
    size: 0.055,
    transparent: true,
    opacity: 0.22,
    depthWrite: false
  });
  const steamPoints = new THREE.Points(steamGeo, steamMat);
  group.add(steamPoints);

  scene.add(group);

  return {
    update(elapsed) {
      // Gentle roaster drum rotation
      drum.rotation.x = elapsed * 0.85;

      // Smooth rising steam curl
      const attr = steamGeo.attributes.position;
      for (let i = 0; i < steamCount; i++) {
        const cycle = (elapsed * 0.28 + steamOffsets[i]) % 1;
        attr.setY(i, 1.11 + cycle * 0.45);
        attr.setX(i, -0.35 + Math.sin(elapsed * 2.2 + i) * 0.025 * cycle);
        attr.setZ(i, 0.32 + Math.cos(elapsed * 1.8 + i) * 0.025 * cycle);
      }
      attr.needsUpdate = true;
    }
  };
}
