import * as Sentry from "@sentry/nestjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN || 'https://95918b50ade549ed856df352d9fd8089@o4509033353379840.ingest.us.sentry.io/4509033357770752',
  tracesSampleRate: 1.0,              // For performance monitoring
  profileSessionSampleRate: 1.0,             // For profiling
  environment: process.env.NODE_ENV || 'development',
  release: 'virtual-hr-api@1.0.0',    // Optional version tag
});