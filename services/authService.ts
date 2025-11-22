import bcrypt from 'bcryptjs';

/**
 * Verify admin password
 * For simplicity, we'll use a bcrypt-hashed password stored in env
 *
 * To generate a hash for your password, run:
 * node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
 */
export function verifyAdminPassword(password: string): boolean {
  const hashedPassword = process.env.ADMIN_PASSWORD_HASH;

  if (!hashedPassword) {
    console.error('ADMIN_PASSWORD_HASH not configured');
    return false;
  }

  try {
    return bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const matches = authHeader.match(/^Bearer (.+)$/);
  return matches ? matches[1] : null;
}

/**
 * For simplicity, we'll use the password itself as the bearer token
 * In production, you'd want to use JWTs or session tokens
 */
export function verifyAdminAuth(authHeader: string | undefined): boolean {
  const token = extractBearerToken(authHeader);

  if (!token) {
    return false;
  }

  return verifyAdminPassword(token);
}
