import { initGA } from './analytics/ga';
import { initSentry } from './analytics/sentry';
import { initPerformanceMonitoring } from './analytics/performance';
import { initSystemMonitoring } from './analytics/system-health';

const getCookieConsent = () => {
  return localStorage.getItem('cookie-consent') === 'accepted';
};

export const initAnalytics = () => {
  const hasConsent = getCookieConsent();
  
  if (hasConsent) {
    initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
    initSentry(import.meta.env.VITE_SENTRY_DSN);
    initPerformanceMonitoring();
    initSystemMonitoring();
  }
  
  // Listen for consent changes
  window.addEventListener('cookie-consent-updated', () => {
    const updatedConsent = getCookieConsent();
    if (updatedConsent) {
      initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
      initSentry(import.meta.env.VITE_SENTRY_DSN);
      initPerformanceMonitoring();
      initSystemMonitoring();
    }
  });
};

// Re-export analytics functions
export { initGA } from './analytics/ga';
export { initSentry } from './analytics/sentry';
export { initPerformanceMonitoring } from './analytics/performance';
export { initSystemMonitoring } from './analytics/system-health';
export { trackPageView } from './analytics/ga';
export { startPerformanceTransaction, trackPagePerformance } from './analytics/performance';
