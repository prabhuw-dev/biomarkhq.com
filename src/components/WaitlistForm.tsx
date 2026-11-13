import { useId, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { isDisposableEmail } from './disposableEmail'

/**
 * local@domain.tld — letters, digits and . _ % + - before the @,
 * a dotted domain after it, and a TLD of at least two letters.
 */
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return 'Please enter your email address.'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address, like name@example.com.'
  if (isDisposableEmail(email)) return "Temporary email addresses can't join the waitlist. Please use your usual email."
  return null
}

type WaitlistFormProps = {
  note: string
  centered?: boolean
}

export function WaitlistForm({ note, centered = false }: WaitlistFormProps) {
  const id = useId()
  const errorId = `${id}-error`
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    // Once an error is showing, re-check as the visitor types so it clears when fixed.
    if (error) setError(validateEmail(event.target.value))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const problem = validateEmail(email)
    setError(problem)
    if (problem) {
      event.currentTarget.querySelector('input')?.focus()
      return
    }
    // TODO: send email.trim() to the waitlist endpoint once it exists.
  }

  return (
    <>
      <form
        className={centered ? 'waitlist-form waitlist-form--center' : 'waitlist-form'}
        onSubmit={handleSubmit}
        noValidate
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          className="field"
          type="email"
          name="email"
          placeholder="Your email"
          autoComplete="email"
          required
          value={email}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button className="btn" type="submit">
          Join the waitlist
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
