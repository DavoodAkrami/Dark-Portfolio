import "server-only";

import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;

const TOKEN_VERSION = "v1";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}
function digest(value) {
  return crypto.createHash("sha256").update(value).digest();
}

function safeEqual(left, right) {
  return crypto.timingSafeEqual(digest(String(left)), digest(String(right)));
}

function sign(value) {
  return crypto
    .createHmac("sha256", requireEnv("ADMIN_SESSION_SECRET"))
    .update(value)
    .digest("base64url");
}

export function verifyAdminCredentials(email, password) {
  if (typeof email !== "string" || typeof password !== "string") return false;
  return (
    safeEqual(email.trim().toLowerCase(), requireEnv("ADMIN_EMAIL").trim().toLowerCase()) &&
    safeEqual(password, requireEnv("ADMIN_PASSWORD"))
  );
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const nonce = crypto.randomBytes(18).toString("base64url");
  const payload = `${TOKEN_VERSION}.${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token) {
  if (typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== TOKEN_VERSION) return false;

  const payload = parts.slice(0, 3).join(".");
  const expiresAt = Number(parts[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  try {
    return safeEqual(parts[3], sign(payload));
  } catch {
    return false;
  }
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function isAdminRequest(request, { requireSameOrigin = false } = {}) {
  if (requireSameOrigin && !isSameOrigin(request)) return false;
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
