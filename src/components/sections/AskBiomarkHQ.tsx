import { useEffect, useState } from 'react'
import askImg from '../../assets/images/ask.jpg'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { BrandMark } from '../BrandMark'

const CONVERSATIONS = [
  {
    q: 'Why do I feel so flat on my long ride days?',
    a: "Your ferritin has fallen from 62 to 18 ng/mL over two years, fastest in your heaviest training months. Low iron stores are a common reason for low energy, so it's worth raising with your doctor. I've added iron-rich meals to your protocol.",
    t: 'That makes sense, thank you.',
  },
  {
    q: 'My recovery tanks after late dinners. Is that real?',
    a: "It is. Over your last 60 nights, your HRV averaged 18% lower when you ate within two hours of bed, and your resting heart rate ran 4 bpm higher. Try finishing dinner by 8 this week and I'll compare.",
    t: "Deal. Let's test it.",
  },
  {
    q: 'Has my vitamin D improved since I started walking outside?',
    a: "It has. You've gone from 18 to 41 ng/mL across six tests, and you're inside the optimal range for the first time. Your next retest is due in March.",
    t: 'Finally, some good news!',
  },
  {
    q: 'My ApoB went up. Should I be worried?',
    a: "It rose from 92 to 104 mg/dL. That's above optimal but still within the lab range, so it's worth discussing at your next check-up. Meanwhile I've added more fibre to your protocol and set a retest for three months.",
    t: 'Okay, that helps.',
  },
]

const FAQS = [
  {
    q: 'Is this medical advice?',
    a: "No. BiomarkHQ explains your data and suggests lifestyle steps. It doesn't diagnose or prescribe, and it suggests talking to a doctor when a result needs one.",
  },
  {
    q: "Isn't this just another AI chatbot?",
    a: 'A general chatbot only knows what you type into it. BiomarkHQ answers from your own results, history and training, so every answer is about you.',
  },
]

/**
 * Chat phases: 0 empty, 1 question, 2 typing, 3 answer, 4 thanks.
 * Value = how long to wait before entering that phase.
 */
const PHASE_DELAY_MS = [3200, 700, 1300, 1600, 4200]
const PHASE_COUNT = PHASE_DELAY_MS.length

function useChatLoop() {
  const reduceMotion = usePrefersReducedMotion()
  const [{ phase, convo }, setState] = useState({ phase: 0, convo: 0 })

  useEffect(() => {
    if (reduceMotion) return
    const next = (phase + 1) % PHASE_COUNT
    const id = setTimeout(() => {
      setState((s) => ({
        phase: next,
        convo: next === 0 ? (s.convo + 1) % CONVERSATIONS.length : s.convo,
      }))
    }, PHASE_DELAY_MS[next])
    return () => clearTimeout(id)
  }, [phase, reduceMotion])

  return { phase: reduceMotion ? 4 : phase, convo }
}

export function AskBiomarkHQ() {
  const { phase, convo } = useChatLoop()
  const c = CONVERSATIONS[convo]

  return (
    <section id="ask" className="ask">
      <img
        className="ask__photo"
        src={askImg}
        alt="A man sits on a linen sofa at dusk, leaning forward to read his phone by the light of a table lamp."
        loading="lazy"
      />
      <div className="ask__wash" aria-hidden="true" />
      <div className="container ask__inner">
        <div className="ask__column">
          <div>
            <p className="eyebrow">Ask BiomarkHQ</p>
            <h2 className="section-title">
              Ask anything about <em>your own results.</em>
            </h2>
            <p className="section-lede">
              Ask questions in plain language and get clear answers drawn from your biomarkers, sleep and training, not
              generic advice.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="chat" aria-live="polite">
            {phase >= 1 && (
              <div key={`q${convo}`} className="bub bubble-user">
                {c.q}
              </div>
            )}
            {phase >= 2 && (
              <div key={`a${convo}`} className="bub bubble-ai">
                <BrandMark size="lg" />
                <div className="bubble-ai__body">
                  {phase === 2 ? (
                    <span className="dots" aria-label="BiomarkHQ is typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <span className="fade">{c.a}</span>
                  )}
                </div>
              </div>
            )}
            {phase >= 4 && (
              <div key={`t${convo}`} className="bub bubble-user">
                {c.t}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
