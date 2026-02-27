export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
};

export const COOKIE_EXPIRY = {
  AUTH_TOKEN: 10,
  REFRESH_TOKEN: 60 * 60 * 24 * 30, // 30 days
  TOKEN_EXPIRY: 60 * 60 * 24 * 10, // 10 days
};

export const COOKIE_PATH = "/";
export const COOKIE_SAME_SITE = "Lax";
export const COOKIE_HTTP_ONLY = true;
export const COOKIE_SECURE = process.env.NODE_ENV === "production";
export const COOKIE_DOMAIN =
  process.env.NODE_ENV === "production" ? ".example.com" : undefined;
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
