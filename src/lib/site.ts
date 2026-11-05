/** Canonical site URL for metadata. Set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

/** Mailing-list configuration. Nothing is stored unless a provider is set. */
export const newsletter = {
  action: process.env.NEXT_PUBLIC_NEWSLETTER_ACTION ?? "",
  provider: process.env.NEXT_PUBLIC_NEWSLETTER_PROVIDER ?? "",
  emailField: process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL_FIELD ?? "email",
  contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
};
