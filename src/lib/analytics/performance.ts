import * as Sentry from '@sentry/react';

export const initPerformanceMonitoring = () => {
  if (window.performance) {
    // Initialize performance monitoring with detailed metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `Performance Entry: ${entry.name}`,
          data: {
            duration: entry.duration,
            startTime: entry.startTime,
            entryType: entry.entryType,
            details: entry.toJSON(),
          },
          level: 'info',
        });

        // Log critical performance issues
        if (entry.duration > 1000) { // 1 second threshold
          Sentry.captureMessage(`Long ${entry.entryType} detected`, {
            level: 'warning',
            tags: {
              type: entry.entryType,
              name: entry.name,
            },
          });
        }
      });
    });

    // Observe various performance metrics
    observer.observe({ 
      entryTypes: [
        'navigation',
        'resource',
        'paint',
        'largest-contentful-paint',
        'layout-shift',
        'first-input',
        'longtask'
      ] 
    });

    console.info('Performance monitoring initialized with enhanced metrics');
  }
};

export const startPerformanceTransaction = (name: string) => {
  const transaction = Sentry.startTransaction({
    name,
    op: 'navigation',
  });

  Sentry.configureScope(scope => {
    scope.setSpan(transaction);
  });

  return transaction;
};

export const trackPagePerformance = (route: string) => {
  if (window.performance) {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');

    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Page Load Metrics - ${route}`,
      data: {
        navigationTiming: navigationEntry?.toJSON(),
        paintTimings: paintEntries.map(entry => entry.toJSON()),
        route,
      },
      level: 'info',
    });
  }
};

export const monitorApiCall = async <T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const transaction = Sentry.startTransaction({
    name: `API Call: ${name}`,
    op: 'http',
  });

  const startTime = performance.now();

  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;

    Sentry.addBreadcrumb({
      category: 'api',
      message: `API Call Complete: ${name}`,
      data: {
        duration,
        success: true,
      },
      level: 'info',
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    Sentry.addBreadcrumb({
      category: 'api',
      message: `API Call Failed: ${name}`,
      data: {
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      level: 'error',
    });

    throw error;
  } finally {
    transaction.finish();
  }
};