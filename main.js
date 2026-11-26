import * as THREE from 'three';
import { CAFE_CONFIG } from './config.js';
import { detectQualityProfile } from './systems/performance.js';
import { CameraRig } from './systems/camera.js';
import { buildEnvironment } from './scene/environment.js';
import { buildArchitecture } from './scene/architecture.js';
import { buildHeroProps } from './scene/heroProps.js';
import { HotspotSystem } from './systems/interactions.js';

// 1. Hydrate DOM from Single Config File
function initBrandUI() {
  document.title = `${CAFE_CONFIG.brandName} — Artisanal Roastery & Kitchen`;
  document.documentElement.style.setProperty('--accent', CAFE_CONFIG.theme.accentHex);

  document.getElementById('loaderBrand').textContent = CAFE_CONFIG.brandName;
  document.getElementById('navBrand').textContent = CAFE_CONFIG.brandName;
  document.getElementById('heroEyebrow').textContent = CAFE_CONFIG.eyebrow;
  document.getElementById('heroTitle').innerHTML = CAFE_CONFIG.heroTitle.replace('\n', '<br />');
  document.getElementById('heroSub').textContent = CAFE_CONFIG.heroSubtitle;

  document.getElementById('visitAddress').textContent = CAFE_CONFIG.address;
  document.getElementById('visitHours').textContent = CAFE_CONFIG.hours;
  document.getElementById('visitPhone').textContent = CAFE_CONFIG.displayPhone;
  document.getElementById('mapsBtn').href = CAFE_CONFIG.googleMapsUrl;
  document.getElementById('footerCopy').innerHTML = `&copy; 2026 ${CAFE_CONFIG.brandName}. All rights reserved.`;

  // Default Date to Today
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) dateInput.valueAsDate = new Date();

  // Render Craft Highlights
  const craftGrid = document.getElementById('craftGrid');
  craftGrid.innerHTML = CAFE_CONFIG.craft
    .map(
      (item) => `
      <div class="glass-panel craft-card">
        <span class="eyebrow">${item.eyebrow}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>`
    )
    .join('');

  // Render Menu Category
  const menuGrid = document.getElementById('menuGrid');
  const renderMenu = (category) => {
    const items = CAFE_CONFIG.menu[category] || [];
    menuGrid.innerHTML = items
      .map(
        (item) => `
        <article class="glass-panel menu-item">
          <div>
            <div class="menu-top">
              <h3>${item.name}</h3>
              <span class="price">${item.price}</span>
            </div>
            <p>${item.desc}</p>
          </div>
          <div class="menu-foot">
            <span class="tag">${item.tag}</span>
            <button class="order-mini" data-item="${item.name} (${item.price})">Order on WhatsApp</button>
          </div>
        </article>`
      )
      .join('');
  };

  renderMenu('coffee');

  document.getElementById('menuTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.cat);
  });

  // Quick WhatsApp Item Inquiry
  menuGrid.addEventListener('click', (e) => {
    const orderBtn = e.target.closest('.order-mini');
    if (!orderBtn) return;
    const msg = encodeURIComponent(`Hi ${CAFE_CONFIG.brandName}, I'd like to inquire/pre-order: ${orderBtn.dataset.item}`);
    window.open(`https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${msg}`, '_blank', 'noopener');
  });

  // WhatsApp Table Reservation Form
  document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const guests = document.getElementById('guestCount').value;
    const date = document.getElementById('bookingDate').value;
    const slot = document.getElementById('timeSlot').value;
    const name = document.getElementById('guestName').value.trim();

    const text = encodeURIComponent(
      `Hello ${CAFE_CONFIG.brandName},\nI'd like to reserve a table:\n• Name: ${name}\n• Guests: ${guests}\n• Date: ${date}\n• Slot: ${slot}`
    );
    window.open(`https://wa.me/${CAFE_CONFIG.whatsappNumber}?text=${text}`, '_blank', 'noopener');
  });
}

// 2. Initialize 3D WebGL Scene
function init3DWorld() {
  const canvas = document.getElementById('bg-canvas');
  const quality = detectQualityProfile();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: quality.antialias,
      powerPreference: 'high-performance'
    });
  } catch {
    document.getElementById('webgl-fallback').classList.remove('hidden');
    return;
  }

  renderer.setPixelRatio(quality.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  if (quality.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 60);
  const cameraRig = new CameraRig(camera, canvas);

  const env = buildEnvironment(scene, quality);
  buildArchitecture(scene, CAFE_CONFIG.theme);
  const props = buildHeroProps(scene, CAFE_CONFIG.theme);

  // Hotspot Card Sync
  const hotspotCard = document.getElementById('hotspotCard');
  const hotspots = new HotspotSystem(scene, camera, canvas, CAFE_CONFIG.hotspots, (data) => {
    document.getElementById('hotspotTag').textContent = data.tag;
    document.getElementById('hotspotTitle').textContent = data.title;
    document.getElementById('hotspotDesc').textContent = data.desc;
    hotspotCard.classList.remove('hidden');
    cameraRig.flyTo(data.cameraView);
  });

  document.getElementById('closeHotspot').addEventListener('click', () => {
    hotspotCard.classList.add('hidden');
  });

  // Camera Preset Buttons
  document.querySelectorAll('.cam-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cam-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      cameraRig.flyTo(pill.dataset.view);
    });
  });

  // Smooth Loader Completion
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  let progress = 0;
  const loadTimer = setInterval(() => {
    progress += 25;
    fill.style.width = `${Math.min(progress, 100)}%`;
    pct.textContent = `${Math.min(progress, 100)}%`;
    if (progress >= 100) {
      clearInterval(loadTimer);
      setTimeout(() => document.getElementById('loader').classList.add('fade-out'), 200);
    }
  }, 90);

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 60FPS Render Loop with Visibility Pause
  const clock = new THREE.Clock();
  let isPaused = false;

  document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
    if (!isPaused) clock.getDelta();
  });

  renderer.setAnimationLoop(() => {
    if (isPaused) return;
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    cameraRig.update(delta);
    env.update(elapsed);
    props.update(elapsed);
    hotspots.update(elapsed);

    renderer.render(scene, camera);
  });
}

initBrandUI();
init3DWorld();
