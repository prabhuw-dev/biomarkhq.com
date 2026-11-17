import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { BrandMark } from './BrandMark'

/** How long the typing indicator shows before a reply appears. */
const REPLY_DELAY_MS = 900
const COMPOSER_MAX_HEIGHT = 120

type Answer = {
  paragraphs: string[]
  /** A section of this page that covers the topic in more depth. */
  more?: { label: string; href: string }
}

type Topic = Answer & { match: RegExp }

/**
 * Questions about the platform, answered only from what this page already
 * says. Checked in order, so the more specific topics come first.
 */
const TOPICS: Topic[] = [
  {
    match: /\b(price|pricing|cost|costs|pay|paid|free|subscription|plan price|how much)\b/i,
    paragraphs: ["I don't have pricing to share yet. Join the waitlist and we'll email you when your access is ready."],
    more: { label: 'Join the waitlist', href: '#waitlist' },
  },
  {
    match: /\b(medical|doctor|diagnos\w*|prescri\w*|advice|clinician|treatment)\b/i,
    paragraphs: [
      "No, biomarkhq isn't medical advice. It explains your data and suggests lifestyle steps. It doesn't diagnose or prescribe, and it suggests talking to a doctor when a result needs one.",
    ],
  },
  {
    match: /\b(private|privacy|secure|security|encrypt\w*|safe|sell|sold|share|delete|data)\b/i,
    paragraphs: [
      'Your biomarkers are some of the most personal data you have, so we treat them that way. Your data is encrypted, never sold, and yours to delete anytime.',
    ],
    more: { label: 'Privacy', href: '#privacy' },
  },
  {
    match:
      /\b(wearables?|devices?|watch|strava|whoop|apple|health app|fitbit|garmin|oura|sync|connect\w*|integrat\w*)\b/i,
    paragraphs: [
      'biomarkhq brings in sleep, heart rate and recovery from the devices you already wear, such as Apple Health, WHOOP and Fitbit, plus your training from Strava.',
      'Your biomarkers, sleep, recovery and training then sit side by side on one dashboard, so you can see how each one shapes the others.',
    ],
    more: { label: 'How it works', href: '#how' },
  },
  {
    match: /\b(upload|pdf|photo|lab|labs|report|reports|blood test|import)\b/i,
    paragraphs: [
      'Add a PDF or snap a photo of your report, from any lab, anywhere in the world. biomarkhq keeps every result in one timeline, so you can spot slow shifts early.',
    ],
    more: { label: 'How it works', href: '#how' },
  },
  {
    match: /\b(ai|chatbot|chat ?gpt|gpt|insights?)\b/i,
    paragraphs: [
      "biomarkhq's AI reads your biomarkers alongside your sleep, recovery and training, then explains what the patterns mean for you, in plain language.",
      'A general chatbot only knows what you type into it. biomarkhq answers from your own results, history and training.',
    ],
    more: { label: 'Ask biomarkhq', href: '#ask' },
  },
  {
    match: /\b(protocol|plans?|nutrition|sleep|training|lifestyle|retest\w*|remind\w*)\b/i,
    paragraphs: [
      'biomarkhq builds a personalised protocol from your data, with practical steps across nutrition, sleep, training and lifestyle.',
      "It also reminds you when it's time to retest, so you can see whether your changes are working.",
    ],
    more: { label: 'Features', href: '#features' },
  },
  {
    match: /\b(biomarkers?|markers?|tests?|trends?|track\w*|dashboard|range)\b/i,
    paragraphs: [
      "biomarkhq tracks 100+ biomarkers over time. You see every marker at a glance: what's in range, what's drifting, and what deserves your attention first.",
    ],
    more: { label: 'Features', href: '#features' },
  },
  {
    match: /\b(when|launch\w*|access|waitlist|wait list|join|sign ?up|available|beta|start)\b/i,
    paragraphs: [
      "Early access is opening soon. Join the waitlist and be among the first to try biomarkhq. No spam: we'll only email you when your access is ready.",
    ],
    more: { label: 'Join the waitlist', href: '#waitlist' },
  },
  {
    match: /\b(how does|how do|how it works|work|works)\b/i,
    paragraphs: [
      'Upload your lab reports, sync the wearables and training apps you already use, and biomarkhq puts everything on one dashboard. It then explains what the patterns mean and builds a protocol you can act on.',
    ],
    more: { label: 'How it works', href: '#how' },
  },
  {
    match: /\b(what is|what's|who|about|biomarkhq|explain)\b/i,
    paragraphs: [
      'biomarkhq brings your blood results, wearable data and training together, tracks 100+ biomarkers over time, and tells you what actually matters.',
    ],
    more: { label: 'How it works', href: '#how' },
  },
  {
    match: /^\s*(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/i,
    paragraphs: ['Hi! Ask me anything about how biomarkhq works, what it connects to, privacy or early access.'],
  },
]

const FALLBACK: Answer = {
  paragraphs: [
    "I don't have an answer to that yet. I can help with how biomarkhq works, what it connects to, privacy and early access.",
  ],
}

const SUGGESTIONS = ['What is biomarkhq?', 'How does it work?', 'Is my data private?', 'When can I join?']

function answerFor(question: string): Answer {
  return TOPICS.find((t) => t.match.test(question)) ?? FALLBACK
}

type Exchange = { id: number; question: string; answer: Answer | null }

function Byline() {
  return (
    <span className="cw-who">
      <BrandMark />
      biomarkhq
    </span>
  )
}

/**
 * Floating launcher and chat card for questions about the platform (FAQ),
 * built on the design system's chat widget: the visitor on the right in a
 * filled bubble, replies as plain text. Text only. The card and launcher stay
 * mounted and animate between states (see App.css); `inert` keeps whichever is
 * hidden out of the tab order and away from screen readers.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const nextId = useRef(0)
  const timers = useRef<number[]>([])
  const wasOpen = useRef(false)

  // Move focus into the card when it opens, and back to the launcher when it closes.
  useEffect(() => {
    if (open) inputRef.current?.focus()
    else if (wasOpen.current) launcherRef.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [exchanges, open])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  function ask(question: string) {
    const id = nextId.current++
    setExchanges((list) => [...list, { id, question, answer: null }])
    const timer = window.setTimeout(() => {
      setExchanges((list) => list.map((x) => (x.id === id ? { ...x, answer: answerFor(question) } : x)))
    }, REPLY_DELAY_MS)
    timers.current.push(timer)
  }

  function resizeInput() {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_HEIGHT)}px`
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.target.value)
    resizeInput()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = draft.trim()
    if (!question) return
    setDraft('')
    if (inputRef.current) inputRef.current.style.height = ''
    ask(question)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a new line.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') setOpen(false)
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="cw-launcher"
        aria-expanded={open}
        aria-controls="chat-widget"
        data-open={open}
        inert={open}
        onClick={() => setOpen(true)}
      >
        <span className="cw-launcher__mark">
          <BrandMark />
        </span>
        Ask a question
      </button>

      <section
        id="chat-widget"
        className="cw"
        role="dialog"
        aria-labelledby="chat-widget-title"
        data-open={open}
        inert={!open}
        onKeyDown={handlePanelKeyDown}
      >
        <div className="cw-head">
          <BrandMark />
          <div>
            <b id="chat-widget-title">Ask about biomarkhq</b>
            <span>How it works, privacy and early access</span>
          </div>
          <button type="button" className="cw-close" aria-label="Close chat" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" />
            </svg>
          </button>
        </div>

        <div ref={logRef} className="cw-log" aria-live="polite">
          <div className="cw-msg-a">
            <Byline />
            <p>Hi! I can answer questions about biomarkhq: what it does, how it works, privacy and early access.</p>
            <div className="cw-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {exchanges.map((x) => (
            <div key={x.id} className="cw-exchange">
              <div className="cw-msg-u">{x.question}</div>
              <div className="cw-msg-a">
                <Byline />
                {x.answer === null ? (
                  <span className="cw-typing" role="status" aria-label="Writing">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <>
                    {x.answer.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {x.answer.more && (
                      <a className="cw-more" href={x.answer.more.href} onClick={() => setOpen(false)}>
                        {x.answer.more.label}
                      </a>
                    )}
                    {x.answer === FALLBACK && (
                      <div className="cw-suggest">
                        {SUGGESTIONS.map((s) => (
                          <button key={s} type="button" onClick={() => ask(s)}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <form ref={formRef} className="cw-composer" onSubmit={handleSubmit}>
          <label htmlFor="chat-widget-input" className="sr-only">
            Ask a question about biomarkhq
          </label>
          <textarea
            ref={inputRef}
            id="chat-widget-input"
            className="cw-input"
            rows={1}
            placeholder="Ask about biomarkhq…"
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button className="cw-send" type="submit" aria-label="Send" disabled={!draft.trim()}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 16V4M5 9l5-5 5 5" />
            </svg>
          </button>
        </form>
        <p className="cw-foot">Answers cover how biomarkhq works. They aren't medical advice.</p>
      </section>
    </>
  )
}
