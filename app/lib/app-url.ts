/**
 * The app's public origin (scheme + host, no trailing slash).
 *
 * Normalises a misconfigured NEXT_PUBLIC_APP_URL so internal server-to-server
 * fetches and generated links can't silently break:
 *   - blank            -> falls back to https://nubhub.baby
 *   - missing scheme   -> prefixes https:// (e.g. "nubhub.baby")
 *   - trailing slashes -> stripped
 *
 * This is the same normalisation create-checkout already applies to its Stripe
 * return_url; centralising it keeps every internal URL builder consistent.
 */
export function getAppOrigin(): string {
  let appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/+$/, '')
  if (!appUrl) return 'https://nubhub.baby'
  if (!/^https?:\/\//i.test(appUrl)) appUrl = `https://${appUrl}`
  return appUrl
}
