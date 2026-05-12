import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { Close, Arrow } from './Icons'

interface Props {
  onClose: () => void
  onSubmit?: (email: string) => Promise<void>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EnrollModal({ onClose, onSubmit }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(id)
  }, [])

  const valid = EMAIL_RE.test(email)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    if (onSubmit) {
      try {
        await onSubmit(email)
      } catch {
        return
      }
    }
    setSubmitted(true)
  }

  return (
    <Modal onClose={onClose} className="enroll">
      <button className="td__close" onClick={onClose} aria-label="close" style={{ position: 'absolute', top: 16, right: 16 }}>
        <Close />
      </button>

      {!submitted ? (
        <>
          <div className="pill"><span className="dot" /> enroll · q2 2026</div>
          <h2 className="enroll__h">Be in the first hundred.</h2>
          <p className="enroll__p">
            We ship the desktop binary to the first hundred enrollments before public release.
            One email when it's ready. No drip campaign, no marketing, no third party.
          </p>
          <form className="enroll__form" onSubmit={submit}>
            <input
              ref={inputRef}
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              className={`enroll__input ${touched && !valid ? 'is-invalid' : ''}`}
            />
            <button type="submit" className="btn btn--primary enroll__btn" disabled={touched && !valid}>
              Enroll <Arrow />
            </button>
          </form>
          <div className="enroll__meta muted">
            {touched && !valid ? (
              <span className="orange">that looks off — check the email</span>
            ) : (
              'no credit card · self-hosted at launch · cancel by ignoring us'
            )}
          </div>
          <div className="enroll__stats">
            <div><span className="enroll__statN">214</span><span className="enroll__statL">enrolled</span></div>
            <div><span className="enroll__statN">86</span><span className="enroll__statL">seats left in cohort</span></div>
            <div><span className="enroll__statN">Q2</span><span className="enroll__statL">'26 ship target</span></div>
          </div>
        </>
      ) : (
        <div className="enroll__done">
          <div className="enroll__check">
            <svg viewBox="0 0 32 32" width="44" height="44">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#6fd1c7" strokeWidth="2" />
              <path d="M9 16 L14 21 L23 12" fill="none" stroke="#6fd1c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="enroll__h">You're in.</h2>
          <p className="enroll__p">
            Locked seat <span className="mint">#215</span> in the cohort. We'll email{' '}
            <span className="font-mono mint">{email}</span> when the binary is ready — sometime in Q2 2026, probably late.
          </p>
          <div className="enroll__meta muted">
            you'll get one email. that's the whole list.
          </div>
          <button className="btn btn--ghost" onClick={onClose} style={{ marginTop: 24 }}>close</button>
        </div>
      )}
    </Modal>
  )
}
