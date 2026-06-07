import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = (dsn: string) => {
  Sentry.init({
    dsn: dsn,
    tracesSampleRate: 1.0,
    beforeSend(event) {
      // Don't send errors in development
      if (import.meta.env.DEV) {
        console.error('Sentry error:', event);
        return null;
      }
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      return {
        ...breadcrumb,
        timestamp: new Date().getTime(),
      };
    },
    maxBreadcrumbs: 50,
    enableTracing: true,
    tracesSampler: (samplingContext) => {
      // Always sample errors
      if (samplingContext.transactionContext.name.includes('error')) {
        return 1.0;
      }
      // Sample 50% of API calls
      if (samplingContext.transactionContext.name.includes('api')) {
        return 0.5;
      }
      // Sample 10% of other transactions
      return 0.1;
    },
    // Add environment information
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || 'development',
    // Enhanced debugging in development
    debug: import.meta.env.DEV,
    integrations: [
      new BrowserTracing(),
      new Sentry.Integrations.GlobalHandlers({
        onerror: true,
        onunhandledrejection: true,
      }),
      new Sentry.Integrations.Breadcrumbs({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        xhr: true,
      }),
    ],
  });
};

export const logError = (
  error: Error, 
  level: 'fatal' | 'error' | 'warning' = 'error',
  context?: Record<string, any>
) => {
  Sentry.captureException(error, {
    level,
    tags: {
      severity: level,
      ...context?.tags,
    },
    contexts: {
      error: {
        ...context,
        stack: error.stack,
      },
    },
  });

  // Also log to console in development
  if (import.meta.env.DEV) {
    console.error(`[${level.toUpperCase()}]`, error, context);
  }
};

export const logMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>
) => {
  Sentry.captureMessage(message, {
    level,
    tags: context?.tags,
    contexts: context,
  });

  // Also log to console in development
  if (import.meta.env.DEV) {
    const logMethod = level === 'error' ? console.error : 
                     level === 'warning' ? console.warn : 
                     console.info;
    logMethod(`[${level.toUpperCase()}]`, message, context);
  }
};

export const ErrorBoundary = Sentry.ErrorBoundary;
