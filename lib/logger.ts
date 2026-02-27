import * as Sentry from "@sentry/nextjs";

/**
 * Logger function
 */
export function logger(
  message: string,
  context?: Record<string, unknown>,
): void {
  const logMessage = {
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.log("[Logger]", logMessage);
  } else {
    console.log("[Logger]", logMessage);
    Sentry.logger.info(message, context);
  }
}
