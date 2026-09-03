/**
 * Environment variable validation. Fails fast in production if required
 * secrets are missing or invalid — a misconfigured deployment should not
 * silently run without a working database or auth secret.
 */

const required = ["DATABASE_URL", "NEXTAUTH_SECRET"];

export function assertEnv() {
  const missing = required.filter((key) => !process.env[key]);

  if (process.env.NODE_ENV === "production" && missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Set them in your environment or Vercel project settings before deploying."
    );
  }

  if (process.env.NEXT_PUBLIC_SITE_URL && !/^https?:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL.");
  }
}
