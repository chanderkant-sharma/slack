import * as Sentry from "@sentry/node";
import { ENV } from "./src/config/env.js";
import { isValidSentryDsn } from "./src/utils/sentry.js";

export const sentryEnabled = isValidSentryDsn(ENV.SENTRY_DSN);

if (sentryEnabled) {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: ENV.NODE_ENV || "development",
    includeLocalVariables: true,
    sendDefaultPii: true,
  });
}
