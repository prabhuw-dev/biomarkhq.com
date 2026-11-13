import { useId } from 'react'
import type { FormEvent } from 'react'

type WaitlistFormProps = {
  note: string
  centered?: boolean
}

export function WaitlistForm({ note, centered = false }: WaitlistFormProps) {
  const id = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: send the email to the waitlist endpoint once it exists.
  }

  return (
    <>
      <form
        className={centered ? 'waitlist-form waitlist-form--center' : 'waitlist-form'}
        onSubmit={handleSubmit}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input id={id} className="field" type="email" name="email" placeholder="Your email" autoComplete="email" required />
        <button className="btn" type="submit">
          Join the waitlist
        </button>
      </form>
      <p className="waitlist-note">{note}</p>
    </>
  )
}
