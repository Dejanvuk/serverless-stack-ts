import * as Sentry from '@sentry/browser';

const isLocal = process.env.NODE_ENV === 'development';

export function initSentry(): void {
  if (isLocal) {
    return;
  }

  Sentry.init({
    dsn: 'https://5f83aa2e21064e47bab8a1f308f940eb@sentry.io/5185720',
  });
}

export function logError(error: any, errorInfo: any = null): void {
  if (isLocal) {
    return;
  }

  Sentry.withScope(scope => {
    if (errorInfo !== null) scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
}

export function onError(error: any): void {
  let errorType = error;
  let errorInfo = { url: null };
  let message = errorType.toString();

  // Auth errors
  if (!(errorType instanceof Error) && errorType.message) {
    errorInfo = errorType;
    message = errorType.message;
    errorType = new Error(message);
    // API errors
  } else if (errorType.config && errorType.config.url) {
    errorInfo.url = errorType.config.url;
  }

  logError(errorType, errorInfo);

  alert(message);
}
