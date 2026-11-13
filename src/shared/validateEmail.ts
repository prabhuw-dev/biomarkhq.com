import { isDisposableEmail } from './disposableEmail'

/**
 * local@domain.tld — letters, digits and . _ % + - before the @,
 * a dotted domain after it, and a TLD of at least two letters.
 */
export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

/** Longest address SMTP allows. */
const MAX_EMAIL_LENGTH = 254

/**
 * Shared by the waitlist form and the /api/waitlist Pages Function.
 * Returns a message to show the visitor, or null when the email is acceptable.
 */
export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return 'Please enter your email address.'
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return 'Please enter a valid email address, like name@example.com.'
  }
  if (isDisposableEmail(email)) return "Temporary email addresses can't join the waitlist. Please use your usual email."
  return null
}

/** The form we store and send to: trimmed and lower-cased so duplicates match. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}
