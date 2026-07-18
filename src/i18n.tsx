import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ro'

/* Only translatable text lives here. Language-independent data (icon paths,
   step numbers, stat values, accent colors) stays in the components and is
   zipped with these arrays by index. */
export interface Content {
  nav: { links: string[]; cta: string }
  hero: {
    eyebrow: string
    h1pre: string
    h1accent: string
    sub: string
    cta: string
    link: string
    assure: string
    consoleLive: string
    cells: string[]
  }
  trust: string[]
  platform: {
    eyebrow: string
    h2pre: string
    h2accent: string
    p: string
    features: { h: string; tag: string; p: string }[]
  }
  how: { eyebrow: string; h2: string; steps: { h: string; p: string }[] }
  publish: {
    marquee: string[]
    h2pre: string
    h2accent: string
    h2post: string
    p: string
    cta: string
  }
  stats: { l: string; d: string }[]
  closing: { h2pre: string; h2accent: string; p: string; cta: string; assure: string }
  footer: {
    blurb: string
    productH: string
    companyH: string
    legalH: string
    product: string[]
    openAdonis: string
    company: string[]
    legal: string[]
    bottom: string
  }
}

const en: Content = {
  nav: { links: ['Platform', 'How it works', 'Publishing'], cta: 'Start free →' },
  hero: {
    eyebrow: 'Ad intelligence · live',
    h1pre: 'Run your entire ad operation from ',
    h1accent: 'one deck.',
    sub: 'Adonis reads the ads that are winning, turns the pattern into content, and publishes it across every platform — while it audits your pages and surfaces warm leads.',
    cta: 'Analyze your first ad — free →',
    link: 'see how it works',
    assure: 'Free to start · no credit card · first teardown in ~3 min',
    consoleLive: '4 platforms · live',
    cells: ['Signals', 'Per ad', 'Queued'],
  },
  trust: ['Free to start — no card', 'Your data stays yours', 'Cancel anytime', '4 platforms, one deck'],
  platform: {
    eyebrow: 'The platform',
    h2pre: 'Everything your ad operation needs, ',
    h2accent: 'in one deck.',
    p: 'From the ad that is already winning to the post that is live — Adonis runs the whole loop, so you stop stitching six tools together.',
    features: [
      { h: 'Analyze', tag: '30+ signals / ad', p: 'Reverse-engineer any winning ad — hook, cut, pacing, sentiment, scenes, audio. The playbook a strategist charges thousands for, in minutes.' },
      { h: 'Generate', tag: 'scripts · captions · video', p: 'Turn the pattern into content that sounds like you — scripts, captions and rendered video, on-brand and ready to ship.' },
      { h: 'Publish', tag: 'IG · FB · TikTok', p: 'Feed, Stories and Carousels to Instagram, Facebook and TikTok — scheduled, AI-labelled, tracked. One post, every platform.' },
      { h: 'Audit', tag: 'SEO · speed · tech', p: 'Score any landing page on SEO, speed, tech and trends — then fix what is quietly costing you conversions.' },
      { h: 'Warm leads', tag: 'already engaging', p: 'Surface the accounts already engaging in your niche — warm, scored, and ready before your competitors notice them.' },
    ],
  },
  how: {
    eyebrow: 'How it works',
    h2: 'Five moves. One pipeline.',
    steps: [
      { h: 'Analyze', p: 'Drop a URL. Get the teardown.' },
      { h: 'Generate', p: 'Pattern becomes content.' },
      { h: 'Publish', p: 'Everywhere, at once.' },
      { h: 'Audit', p: 'Fix the leaks.' },
      { h: 'Convert', p: 'Warm leads, surfaced.' },
    ],
  },
  publish: {
    marquee: ['Analyze', 'Generate', 'Publish everywhere', 'Stories', 'Carousel', 'Reels'],
    h2pre: 'Publish ',
    h2accent: 'everywhere.',
    h2post: 'All at once.',
    p: 'One post, every platform — Feed, Stories and Carousels to Instagram, Facebook and TikTok, with the AI-generated label handled for you.',
    cta: 'Start publishing →',
  },
  stats: [
    { l: 'Platforms', d: 'YouTube · Instagram · Facebook · TikTok' },
    { l: 'Signals / ad', d: 'hooks · cuts · faces · sentiment · audio' },
    { l: 'From URL to plan', d: 'a full written playbook per ad' },
    { l: 'Yours', d: 'your research and accounts stay yours' },
  ],
  closing: {
    h2pre: 'Run your next campaign ',
    h2accent: 'on Adonis.',
    p: 'The whole loop — analyze, generate, publish, audit, convert — in one deck. Open it and ship something today.',
    cta: 'Analyze your first ad — free →',
    assure: 'No credit card · cancel anytime · your research stays yours',
  },
  footer: {
    blurb: 'The intelligent ads platform for paid social — analyze, generate, publish, audit, convert.',
    productH: 'Product',
    companyH: 'Company',
    legalH: 'Legal',
    product: ['Platform', 'How it works', 'Publishing'],
    openAdonis: 'Open Adonis',
    company: ['App', 'Contact'],
    legal: ['Privacy Policy', 'Terms of Service'],
    bottom: '© 2026 Adonis. Built for paid social.',
  },
}

const ro: Content = {
  nav: { links: ['Platformă', 'Cum funcționează', 'Publicare'], cta: 'Începe gratis →' },
  hero: {
    eyebrow: 'Inteligență pe ads · live',
    h1pre: 'Rulează toată operațiunea ta de ads ',
    h1accent: 'dintr-un singur loc.',
    sub: 'Adonis citește reclamele care câștigă, transformă tiparul în conținut și îl publică pe toate platformele — în timp ce îți auditează paginile și îți scoate la suprafață lead-uri calde.',
    cta: 'Analizează prima ta reclamă — gratis →',
    link: 'vezi cum funcționează',
    assure: 'Gratis la start · fără card · primul teardown în ~3 min',
    consoleLive: '4 platforme · live',
    cells: ['Semnale', 'Per reclamă', 'În coadă'],
  },
  trust: ['Gratis la start — fără card', 'Datele tale rămân ale tale', 'Anulezi oricând', '4 platforme, un singur loc'],
  platform: {
    eyebrow: 'Platforma',
    h2pre: 'Tot ce-i trebuie operațiunii tale de ads, ',
    h2accent: 'într-un singur loc.',
    p: 'De la reclama care deja câștigă până la postarea care e live — Adonis rulează tot ciclul, ca să nu mai lipești șase tool-uri între ele.',
    features: [
      { h: 'Analizează', tag: '30+ semnale / reclamă', p: 'Reverse-engineering la orice reclamă care merge — hook, tăieturi, ritm, sentiment, scene, audio. Playbook-ul pentru care un strateg cere mii de euro, în câteva minute.' },
      { h: 'Generează', tag: 'scripturi · captions · video', p: 'Transformă tiparul în conținut care sună a tine — scripturi, captions și video randat, on-brand și gata de trimis.' },
      { h: 'Publică', tag: 'IG · FB · TikTok', p: 'Feed, Stories și Carousel pe Instagram, Facebook și TikTok — programate, etichetate AI, urmărite. O postare, fiecare platformă.' },
      { h: 'Auditează', tag: 'SEO · viteză · tech', p: 'Punctează orice landing page pe SEO, viteză, tech și trenduri — apoi repară ce-ți fură conversii pe tăcute.' },
      { h: 'Lead-uri calde', tag: 'deja interesați', p: 'Scoate la suprafață conturile care deja interacționează în nișa ta — calde, punctate și gata înainte să le observe concurența.' },
    ],
  },
  how: {
    eyebrow: 'Cum funcționează',
    h2: 'Cinci mișcări. Un singur pipeline.',
    steps: [
      { h: 'Analizează', p: 'Pui un URL. Primești teardown-ul.' },
      { h: 'Generează', p: 'Tiparul devine conținut.' },
      { h: 'Publică', p: 'Peste tot, deodată.' },
      { h: 'Auditează', p: 'Repari scurgerile.' },
      { h: 'Convertește', p: 'Lead-uri calde, la suprafață.' },
    ],
  },
  publish: {
    marquee: ['Analizează', 'Generează', 'Publică peste tot', 'Stories', 'Carousel', 'Reels'],
    h2pre: 'Publică ',
    h2accent: 'peste tot.',
    h2post: 'Totul odată.',
    p: 'O postare, fiecare platformă — Feed, Stories și Carousel pe Instagram, Facebook și TikTok, cu eticheta de AI pusă pentru tine.',
    cta: 'Începe să publici →',
  },
  stats: [
    { l: 'Platforme', d: 'YouTube · Instagram · Facebook · TikTok' },
    { l: 'Semnale / reclamă', d: 'hook-uri · tăieturi · fețe · sentiment · audio' },
    { l: 'De la URL la plan', d: 'un playbook scris complet per reclamă' },
    { l: 'Ale tale', d: 'research-ul și conturile tale rămân ale tale' },
  ],
  closing: {
    h2pre: 'Rulează următoarea campanie ',
    h2accent: 'pe Adonis.',
    p: 'Tot ciclul — analizează, generează, publică, auditează, convertește — într-un singur loc. Deschide-l și lansează ceva azi.',
    cta: 'Analizează prima ta reclamă — gratis →',
    assure: 'Fără card · anulezi oricând · research-ul tău rămâne al tău',
  },
  footer: {
    blurb: 'Platforma inteligentă de ads pentru paid social — analizează, generează, publică, auditează, convertește.',
    productH: 'Produs',
    companyH: 'Companie',
    legalH: 'Legal',
    product: ['Platformă', 'Cum funcționează', 'Publicare'],
    openAdonis: 'Deschide Adonis',
    company: ['Aplicație', 'Contact'],
    legal: ['Politică de confidențialitate', 'Termeni și condiții'],
    bottom: '© 2026 Adonis. Construit pentru paid social.',
  },
}

const CONTENT: Record<Lang, Content> = { en, ro }

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'ro') return saved
  } catch { /* ignore */ }
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
  return nav.startsWith('ro') ? 'ro' : 'en'
}

interface I18nValue { lang: Lang; setLang: (l: Lang) => void; c: Content }
const I18nContext = createContext<I18nValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)
  return <I18nContext.Provider value={{ lang, setLang, c: CONTENT[lang] }}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const v = useContext(I18nContext)
  if (!v) throw new Error('useI18n must be used within LangProvider')
  return v
}
