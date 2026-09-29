const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isAndroid = /Android/i.test(navigator.userAgent);

export const platformProfile = {
  mobile: isTouch,
  android: isAndroid,
  desktop: !isTouch,
  quality: isAndroid ? 'mobile' : 'desktop',
  pixelRatioCap: isAndroid ? 1.5 : 2,
  shadowQuality: isAndroid ? 'low' : 'high',
  particleBudget: isAndroid ? 120 : 500,
  dynamicLights: isAndroid ? 2 : 6
};

export function getRecommendedResolution(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, platformProfile.pixelRatioCap);
  return {
    width: Math.max(1, Math.floor(canvas.clientWidth * ratio)),
    height: Math.max(1, Math.floor(canvas.clientHeight * ratio))
  };
}
