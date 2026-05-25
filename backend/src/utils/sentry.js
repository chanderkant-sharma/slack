export const isValidSentryDsn = (dsn) =>
  Boolean(dsn && dsn.startsWith("https://") && !dsn.includes("your_sentry"));
