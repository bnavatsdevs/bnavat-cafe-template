export function detectQualityProfile() {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const ram = navigator.deviceMemory || 4;

  if (isMobile && ram <= 4) {
    return {
      tier: 'low',
      pixelRatio: 1,
      antialias: false,
      shadows: false,
      shadowMapSize: 512,
      particleCount: 28
    };
  }

  if (isMobile) {
    return {
      tier: 'balanced',
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      antialias: true,
      shadows: true,
      shadowMapSize: 1024,
      particleCount: 45
    };
  }

  return {
    tier: 'high',
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    antialias: true,
    shadows: true,
    shadowMapSize: 2048,
    particleCount: 75
  };
}
