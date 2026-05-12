import { Arrow } from './Icons'

interface Props {
  onEnroll: () => void
}

export function StickyMobileCta({ onEnroll }: Props) {
  return (
    <div className="sticky-cta">
      <button className="btn btn--primary sticky-cta__btn" onClick={onEnroll}>
        <span className="dot" />
        Enroll for launch
        <Arrow />
      </button>
    </div>
  )
}
