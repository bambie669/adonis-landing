interface Props {
  idx: number
}

export function SceneArt({ idx }: Props) {
  const arts = [
    <svg viewBox="0 0 120 70" key="0">
      <rect width="120" height="70" fill="#0b0b18" />
      <rect x="30" y="14" width="60" height="42" rx="4" fill="#1a1a30" stroke="#6fd1c7" strokeOpacity="0.4" />
      <rect x="46" y="22" width="28" height="6" rx="1" fill="#6fd1c7" fillOpacity="0.4" />
      <rect x="42" y="34" width="36" height="14" rx="2" fill="#6fd1c7" fillOpacity="0.15" />
    </svg>,
    <svg viewBox="0 0 120 70" key="1">
      <rect width="120" height="70" fill="#0b0b18" />
      <circle cx="60" cy="32" r="14" fill="#1a1a30" stroke="#f97316" strokeOpacity="0.5" />
      <path d="M0 35 L120 30" stroke="#f97316" strokeOpacity="0.3" strokeDasharray="4 4" />
      <rect x="20" y="52" width="80" height="3" rx="1" fill="#f97316" fillOpacity="0.3" />
    </svg>,
    <svg viewBox="0 0 120 70" key="2">
      <rect width="120" height="70" fill="#0b0b18" />
      <rect x="10" y="40" width="100" height="20" rx="3" fill="#1a1a30" />
      <rect x="48" y="20" width="24" height="32" rx="2" fill="#6fd1c7" fillOpacity="0.3" stroke="#6fd1c7" strokeOpacity="0.5" />
      <line x1="20" y1="50" x2="48" y2="44" stroke="#6fd1c7" strokeOpacity="0.4" strokeWidth="2" />
      <line x1="100" y1="50" x2="72" y2="44" stroke="#6fd1c7" strokeOpacity="0.4" strokeWidth="2" />
    </svg>,
    <svg viewBox="0 0 120 70" key="3">
      <rect width="120" height="70" fill="#0b0b18" />
      <rect x="14" y="14" width="92" height="42" rx="3" fill="#1a1a30" stroke="#f97316" strokeOpacity="0.4" />
      <rect x="20" y="22" width="60" height="4" fill="#f97316" fillOpacity="0.5" />
      <rect x="20" y="32" width="80" height="3" fill="#fff" fillOpacity="0.2" />
      <rect x="20" y="40" width="68" height="3" fill="#fff" fillOpacity="0.2" />
      <rect x="20" y="48" width="40" height="3" fill="#fff" fillOpacity="0.2" />
    </svg>,
    <svg viewBox="0 0 120 70" key="4">
      <rect width="120" height="70" fill="#0b0b18" />
      <rect x="6" y="10" width="50" height="50" rx="3" fill="#1a1a30" stroke="#6fd1c7" strokeOpacity="0.3" />
      <rect x="64" y="10" width="50" height="50" rx="3" fill="#1a1a30" stroke="#6fd1c7" strokeOpacity="0.6" />
      <rect x="18" y="22" width="26" height="26" rx="2" fill="#6fd1c7" fillOpacity="0.15" />
      <rect x="76" y="22" width="26" height="26" rx="2" fill="#6fd1c7" fillOpacity="0.45" />
      <text x="60" y="38" fontSize="6" fill="#f97316" textAnchor="middle" fontFamily="monospace">→</text>
    </svg>,
    <svg viewBox="0 0 120 70" key="5">
      <rect width="120" height="70" fill="#0b0b18" />
      <rect x="30" y="28" width="60" height="18" rx="9" fill="#f97316" fillOpacity="0.85" />
      <rect x="42" y="34" width="28" height="3" fill="#fff" fillOpacity="0.9" />
      <rect x="36" y="14" width="48" height="3" fill="#fff" fillOpacity="0.4" />
      <text x="100" y="40" fontSize="10" fill="#f97316" fontFamily="monospace">→</text>
    </svg>,
  ]
  return arts[idx % arts.length]
}
