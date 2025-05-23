// utils/mailer.js

/**
 * Stubbed mailer: logs the reset link instead of sending real email.
 */
export async function sendResetEmail(email, token) {
  const resetUrl = `https://your-app.com/auth/reset-password?token=${token}`;
  console.log(`[MAILER] Password reset for ${email}: ${resetUrl}`);
  return Promise.resolve();
}
