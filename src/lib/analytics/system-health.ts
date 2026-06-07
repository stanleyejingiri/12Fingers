import * as Sentry from '@sentry/react';

export const monitorSystemHealth = () => {
  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // 50ms threshold for long tasks
          Sentry.addBreadcrumb({
            category: 'performance',
            message: 'Long Task Detected',
            data: {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
              attribution: entry.toJSON(),
            },
            level: 'warning',
          });
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  }

  // Monitor resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLElement) {
      Sentry.addBreadcrumb({
        category: 'resource',
        message: 'Resource Loading Error',
        data: {
          tagName: event.target.tagName,
          src: (event.target as HTMLImageElement | HTMLScriptElement).src,
          href: (event.target as HTMLLinkElement).href,
          id: event.target.id,
          className: event.target.className,
        },
        level: 'error',
      });
    }
  }, true);
};

export const initSystemMonitoring = () => {
  monitorSystemHealth();

  // Network status monitoring
  window.addEventListener('online', () => {
    Sentry.addBreadcrumb({
      category: 'system',
      message: 'Network connection restored',
      level: 'info',
    });
  });

  window.addEventListener('offline', () => {
    Sentry.addBreadcrumb({
      category: 'system',
      message: 'Network connection lost',
      level: 'warning',
    });
  });

  // Monitor page visibility
  document.addEventListener('visibilitychange', () => {
    Sentry.addBreadcrumb({
      category: 'system',
      message: `Page visibility changed to ${document.visibilityState}`,
      level: 'info',
    });
  });

  // Monitor performance metrics instead of direct memory access
  if ('performance' in window) {
    setInterval(() => {
      const perfEntries = performance.getEntriesByType('resource');
      const totalResourceSize = perfEntries.reduce((total, entry) => {
        // @ts-ignore - encodedBodySize exists on PerformanceResourceTiming
        return total + (entry.encodedBodySize || 0);
      }, 0);

      if (totalResourceSize > 50 * 1024 * 1024) { // 50MB threshold
        Sentry.addBreadcrumb({
          category: 'system',
          message: 'High resource usage detected',
          data: {
            totalResourceSize,
            numResources: perfEntries.length,
          },
          level: 'warning',
        });
      }
    }, 30000); // Check every 30 seconds
  }
};