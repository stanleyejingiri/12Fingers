import ReactGA from 'react-ga4';

export const initGA = (measurementId: string) => {
  if (!measurementId) {
    console.warn('GA4 measurement ID not provided');
    return;
  }

  try {
    ReactGA.initialize(measurementId);
    console.log('GA4 initialized successfully');
  } catch (error) {
    console.error('Error initializing GA4:', error);
  }
};

export const trackPageView = (path: string) => {
  try {
    ReactGA.send({ 
      hitType: "pageview", 
      page: path 
    });
    console.log('Page view tracked:', path);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = (category: string, action: string, label?: string) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
    });
    console.log('Event tracked:', { category, action, label });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};
