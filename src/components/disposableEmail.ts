/**
 * Disposable / temporary inbox providers we don't accept on the waitlist.
 * Free personal webmail (Gmail, Outlook, iCloud…) is deliberately allowed.
 *
 * This is a hand-picked list of the most common services, not an exhaustive one.
 * New throwaway domains appear constantly, so the server should run the same
 * check against a maintained list when the waitlist endpoint exists.
 */
export const DISPOSABLE_EMAIL_DOMAINS = [
  // Mailinator and its alias domains
  'mailinator.com', 'mailinator.net', 'mailinator2.com', 'mailinater.com', 'notmailinator.com',
  'binkmail.com', 'bobmail.info', 'chammy.info', 'devnullmail.com', 'letthemeatspam.com',
  'reallymymail.com', 'safetymail.info', 'sogetthis.com', 'spamherelots.com', 'spamthisplease.com',
  'suremail.info', 'thisisnotmyrealemail.com', 'tradermail.info', 'veryrealemail.com', 'zippymail.info',
  // Guerrilla Mail
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.info', 'guerrillamailblock.com', 'sharklasers.com', 'grr.la', 'pokemail.net', 'spam4.me',
  // Timed inboxes
  '10minutemail.com', '10minutemail.net', '20minutemail.com', 'mailexpire.com',
  // Temp-mail style services
  'temp-mail.org', 'temp-mail.io', 'tempmail.com', 'tempmail.net', 'tempmailo.com', 'tempail.com',
  'tempr.email', 'tempinbox.com', 'tempmailaddress.com', 'mytemp.email', 'tmpmail.org', 'tmpmail.net',
  'emltmp.com', 'mail.tm', 'mail.gw', '1secmail.com', '1secmail.net', '1secmail.org',
  // YOPmail
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  // Other well-known throwaway providers
  'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'trashmail.de', 'getnada.com', 'nada.email',
  'dispostable.com', 'discard.email', 'discardmail.com', 'maildrop.cc', 'mailnesia.com', 'mintemail.com',
  'mohmal.com', 'mailcatch.com', 'fakeinbox.com', 'fakemail.net', 'emailfake.com', 'emailondeck.com',
  'spamgourmet.com', 'spambox.us', 'spamex.com', 'moakt.com', 'burnermail.io', 'mailpoof.com',
  'getairmail.com', 'inboxkitten.com', 'harakirimail.com', 'mailsac.com', 'incognitomail.org',
  'jetable.org', 'crazymailing.com', 'mvrht.com',
  // Fake Mail Generator
  'armyspy.com', 'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com',
  'rhyta.com', 'superrito.com', 'teleworm.us',
]

const escapeForRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Matches an email whose domain is a listed provider or any subdomain of one,
 * e.g. "x@yopmail.com" and "x@inbox.mailinator.com", but not "x@notyopmail.com".
 */
export const DISPOSABLE_EMAIL_PATTERN = new RegExp(
  `@(?:[a-z0-9-]+\\.)*(?:${DISPOSABLE_EMAIL_DOMAINS.map(escapeForRegex).join('|')})$`,
  'i',
)

export function isDisposableEmail(email: string): boolean {
  return DISPOSABLE_EMAIL_PATTERN.test(email.trim())
}
