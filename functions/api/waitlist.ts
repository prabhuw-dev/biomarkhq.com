import { normalizeEmail, validateEmail } from '../../src/shared/validateEmail'

interface Env {
  DB: D1Database
  /** Secret. When unset (e.g. local dev), signups are stored but no email is sent. */
  RESEND_API_KEY?: string
  /** e.g. "BiomarkHQ <hello@biomarkhq.com>"; the domain must be verified in Resend. */
  WAITLIST_FROM: string
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

/**
 * POST /api/waitlist  { "email": "name@example.com" }
 *
 * 200 { ok: true }      stored (or already on the list; we don't reveal which)
 * 400 { error }         invalid or disposable email, message safe to show
 * 403 / 415 / 500       cross-site request, wrong content type, or storage failure
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  // Only accept submissions from our own pages.
  const origin = request.headers.get('Origin')
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: 'Forbidden.' }, 403)
  }
  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return json({ error: 'Expected a JSON body.' }, 415)
  }

  let raw: unknown
  try {
    raw = ((await request.json()) as { email?: unknown } | null)?.email
  } catch {
    return json({ error: 'Please enter a valid email address, like name@example.com.' }, 400)
  }
  const problem = typeof raw === 'string' ? validateEmail(raw) : 'Please enter your email address.'
  if (problem) return json({ error: problem }, 400)
  const email = normalizeEmail(raw as string)

  let isNew: boolean
  try {
    const result = await env.DB.prepare('INSERT INTO waitlist (email) VALUES (?) ON CONFLICT (email) DO NOTHING')
      .bind(email)
      .run()
    isNew = result.meta.changes > 0
  } catch (err) {
    console.error('waitlist: insert failed', err)
    return json({ error: 'Something went wrong on our side. Please try again in a moment.' }, 500)
  }

  // Send the confirmation after responding, so a slow or failing email
  // provider never loses a signup or keeps the visitor waiting.
  if (isNew) waitUntil(sendConfirmation(env, email))

  return json({ ok: true })
}

async function sendConfirmation(env: Env, email: string): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn('waitlist: RESEND_API_KEY is not set, skipping confirmation email')
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        // Resend drops repeats of the same key, so a retry can't double-send.
        'Idempotency-Key': `waitlist-${email}`,
      },
      body: JSON.stringify({
        from: env.WAITLIST_FROM,
        to: [email],
        subject: "You're on the BiomarkHQ waitlist",
        text: CONFIRMATION_TEXT,
        html: CONFIRMATION_HTML,
      }),
    })
    if (!res.ok) {
      console.error('waitlist: Resend returned', res.status, await res.text())
      return
    }
    await env.DB.prepare(
      "UPDATE waitlist SET confirmation_sent_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE email = ?",
    )
      .bind(email)
      .run()
  } catch (err) {
    console.error('waitlist: confirmation email failed', err)
  }
}

const CONFIRMATION_TEXT = `Thanks for joining the BiomarkHQ waitlist.

We're building a way to read all your blood work as one story: every marker, every trend, and a plan you can act on.

We'll email you when your spot opens up. Until then, there's nothing else you need to do.

— The BiomarkHQ team

You're receiving this because this address was entered on biomarkhq.com. If that wasn't you, ignore this email and you won't hear from us again.`

const CONFIRMATION_HTML = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#faf4e8;font-family:Helvetica,Arial,sans-serif;color:#453d33;">
    <div style="max-width:520px;margin:0 auto;background:#fefaf0;border:1px solid #e7ddc9;border-radius:16px;padding:32px;">
      <p style="margin:0 0 20px;font-size:18px;font-weight:700;">BiomarkHQ</p>
      <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;">You're on the list.</h1>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Thanks for joining the BiomarkHQ waitlist. We're building a way to read all your blood work as one story: every marker, every trend, and a plan you can act on.</p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">We'll email you when your spot opens up. Until then, there's nothing else you need to do.</p>
      <p style="margin:0;font-size:16px;">— The BiomarkHQ team</p>
    </div>
    <p style="max-width:520px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#6f665a;text-align:center;">You're receiving this because this address was entered on biomarkhq.com. If that wasn't you, ignore this email and you won't hear from us again.</p>
  </body>
</html>`
