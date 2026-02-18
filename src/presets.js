export const DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'connect-src',
  'font-src',
  'frame-ancestors',
  'base-uri',
  'object-src',
];

export const PRESETS = {
  strict: {
    name: 'Strict (recommended baseline)',
    directives: {
      'default-src': "'self'",
      'script-src': "'self'",
      'style-src': "'self'",
      'img-src': "'self'",
      'connect-src': "'self'",
      'font-src': "'self'",
      'frame-ancestors': "'none'",
      'base-uri': "'self'",
      'object-src': "'none'",
    },
  },
  spa: {
    name: 'SPA + Analytics',
    directives: {
      'default-src': "'self'",
      'script-src': "'self' https://www.googletagmanager.com https://www.google-analytics.com",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "'self' data: https://www.google-analytics.com",
      'connect-src': "'self' https://www.google-analytics.com https://analytics.google.com",
      'font-src': "'self' https://fonts.gstatic.com",
      'frame-ancestors': "'none'",
      'base-uri': "'self'",
      'object-src': "'none'",
    },
  },
  reportOnly: {
    name: 'Report-Only Starter',
    directives: {
      'default-src': "'self'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "*",
      'connect-src': "'self'",
      'font-src': "'self' https:",
      'frame-ancestors': "'self'",
      'base-uri': "'self'",
      'object-src': "'none'",
    },
  },
};
