import * as THREE from 'three';

function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3c2415';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 180; i++) {
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(24, 13, 7, 0.38)' : 'rgba(92, 57, 34, 0.25)';
    ctx.lineWidth = 1 + Math.random() * 3;
    ctx.beginPath();
    const y = (i / 180) * 512;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + Math.sin(i) * 8, 340, y - Math.cos(i) * 8, 512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildArchitecture(scene, theme) {
  const group = new THREE.Group();
  const woodTex = createWoodTexture();

  // Shared Materials (Performance Best Practice)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x151311,
    roughness: 0.78,
    metalness: 0.1
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1c1815,
    roughness: 0.9,
    metalness: 0.05
  });

  const walnutMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: theme.woodColor,
    roughness: 0.42,
    metalness: 0.08
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: theme.stoneColor,
    roughness: 0.25,
    metalness: 0.18
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: theme.brassColor,
    roughness: 0.28,
    metalness: 0.86
  });

  // Floor Platform
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 0.16, 48), floorMat);
  floor.position.y = -0.08;
  floor.receiveShadow = true;
  group.add(floor);

  // Curved Architectural Backdrop Wall
  const backWall = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.4, 3.4, 48, 1, true, Math.PI * 0.72, Math.PI * 0.56),
    wallMat
  );
  backWall.position.y = 1.7;
  backWall.receiveShadow = true;
  group.add(backWall);

  // Main Espresso & Pour-Over Counter
  const counterBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.92, 0.95), walnutMat);
  counterBase.position.set(-0.7, 0.46, 0.15);
  counterBase.castShadow = true;
  counterBase.receiveShadow = true;
  group.add(counterBase);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.07, 1.08), stoneMat);
  counterTop.position.set(-0.7, 0.955, 0.15);
  counterTop.castShadow = true;
  counterTop.receiveShadow = true;
  group.add(counterTop);

  // Brass Foot Rail
  const footRail = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.5, 16), brassMat);
  footRail.rotation.z = Math.PI / 2;
  footRail.position.set(-0.7, 0.18, 0.72);
  group.add(footRail);

  // Instanced Bar Stools (Single Draw Call)
  const stoolTopGeo = new THREE.CylinderGeometry(0.19, 0.17, 0.06, 24);
  const stoolLegGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.64, 16);
  const stoolTops = new THREE.InstancedMesh(stoolTopGeo, walnutMat, 3);
  const stoolLegs = new THREE.InstancedMesh(stoolLegGeo, brassMat, 3);
  const dummy = new THREE.Object3D();

  [-1.55, -0.7, 0.15].forEach((x, idx) => {
    dummy.position.set(x, 0.65, 1.05);
    dummy.updateMatrix();
    stoolTops.setMatrixAt(idx, dummy.matrix);

    dummy.position.set(x, 0.32, 1.05);
    dummy.updateMatrix();
    stoolLegs.setMatrixAt(idx, dummy.matrix);
  });
  stoolTops.castShadow = true;
  group.add(stoolTops, stoolLegs);

  // Floating Back-Bar Shelving
  [1.75, 2.25].forEach((y) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.32), walnutMat);
    shelf.position.set(-0.7, y, -1.15);
    shelf.castShadow = true;
    group.add(shelf);
  });

  // Brass Pendant Lamps
  [-1.15, -0.25, 1.25].forEach((x, i) => {
    const z = i === 2 ? -0.4 : 0.2;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.9, 8), brassMat);
    cord.position.set(x, 2.95, z);

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.16, 24, 1, true), brassMat);
    shade.position.set(x, 2.45, z);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffc68a })
    );
    bulb.position.set(x, 2.4, z);

    group.add(cord, shade, bulb);
  });

  scene.add(group);
  return group;
}
