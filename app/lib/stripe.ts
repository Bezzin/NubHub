import Stripe from 'stripe';

/**
 * Pinned Stripe API version — kept in ONE place so every route uses the same
 * version. Update here (and re-test the full payment flow) when upgrading.
 */
const API_VERSION = '2025-02-24.acacia' as const;

let cached: Stripe | null = null;

/**
 * Lazily-instantiated, memoized server-side Stripe client.
 *
 * Reads STRIPE_SECRET_KEY at call time (not module load) so a missing key
 * surfaces as a clear runtime error in the handler rather than crashing the
 * whole server on import. Memoized to reuse the client across warm invocations.
 */
export function getStripe(): Stripe {
  if (cached) return cached;

  // Trim to guard against a stray newline/space in the env var, which would be
  // embedded into the "Authorization: Bearer <key>" header and throw
  // ERR_INVALID_CHAR ("Invalid character in header content") on every API call.
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  cached = new Stripe(secretKey, { apiVersion: API_VERSION });
  return cached;
}
