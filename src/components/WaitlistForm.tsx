import { useId, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { normalizeEmail, validateEmail } from '../shared/validateEmail'

const WAITLIST_ENDPOINT = '/api/waitlist'
const GENERIC_ERROR = 'Something went wrong. Please try again in a moment.'

type Status = 'idle' | 'submitting' | 'success'

/** POSTs to the Pages Function; resolves to an error message, or null on success. */
async function joinWaitlist(email: string): Promise<string | null> {
  try {
    const res = await fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) return null
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    return res.status === 400 && body?.error ? body.error : GENERIC_ERROR
  } catch {
    return "We couldn't reach the server. Check your connection and try again."
  }
}

type WaitlistFormProps = {
  note: string
  centered?: boolean
}

export function WaitlistForm({ note, centered = false }: WaitlistFormProps) {
  const id = useId()
  const errorId = `${id}-error`
  const inputRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLParagraphElement>(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    // Once an error is showing, re-check as the visitor types so it clears when fixed.
    if (error) setError(validateEmail(event.target.value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const problem = validateEmail(email)
    setError(problem)
    if (problem) {
      inputRef.current?.focus()
      return
    }

    setStatus('submitting')
    const serverProblem = await joinWaitlist(normalizeEmail(email))
    if (serverProblem) {
      setError(serverProblem)
      setStatus('idle')
      inputRef.current?.focus()
      return
    }
    setStatus('success')
    // The form is replaced, so move focus to the confirmation instead of losing it.
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const alignClass = centered ? ' waitlist--center' : ''

  if (status === 'success') {
    return (
      <p ref={successRef} className={`waitlist-success${alignClass}`} role="status" tabIndex={-1}>
        <strong>You're on the list.</strong> We've sent a confirmation to {normalizeEmail(email)}.
      </p>
    )
  }

  const submitting = status === 'submitting'

  return (
    <>
      <form
        className={`waitlist-form${alignClass}`}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={submitting || undefined}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          ref={inputRef}
          id={id}
          className="field"
          type="email"
          name="email"
          placeholder="Your email"
          autoComplete="email"
          required
          value={email}
          onChange={handleChange}
          readOnly={submitting}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Joining…' : 'Join the waitlist'}
        </button>
      </form>
      {error && (
        <p id={errorId} className="waitlist-error" role="alert">
          {error}
        </p>
      )}
      <p className="waitlist-note">{note}</p>
    </>
  )
}
