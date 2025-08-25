export const LoggingMiddleware = {
  log: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logObject = {
      timestamp,
      message,
      data,
      environment: process.env.NODE_ENV || 'development',
      level: 'info'
    };

    console.log('[AFFORDMED-LOG]', JSON.stringify(logObject));
  },

  error: (message, error = {}) => {
    const timestamp = new Date().toISOString();
    const logObject = {
      timestamp,
      message,
      error: error.message || error,
      stack: error.stack,
      environment: process.env.NODE_ENV || 'development',
      level: 'error'
    };

    console.error('[AFFORDMED-ERROR]', JSON.stringify(logObject));
  }
};
