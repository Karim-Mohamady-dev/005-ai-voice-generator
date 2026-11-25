import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Microphone } from '@phosphor-icons/react'
import { useLang } from '../i18n.tsx'
import { Reveal, SectionHead } from './ui.tsx'

const BARS = [10, 18, 26, 14, 30, 20, 34, 16, 24, 12, 28, 18, 32, 14, 22, 10, 26, 18]

export function HeroDemo() {
  const { t, ta } = useLang()
  const voices = ta<{ name: string; lang: string; desc: string; seconds: number }>('demo.voices')
  const [playing, setPlaying] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current) }, [])
  const toggle = (i: number) => {
    if (timer.current) window.clearInterval(timer.current)
    if (playing === i) { setPlaying(null); return }
    setPlaying(i); setElapsed(0)
    timer.current = window.setInterval(() => {
      setElapsed((e) => {
        const total = voices[i]?.seconds ?? 10
        if (e + 1 >= total) { if (timer.current) window.clearInterval(timer.current); setPlaying(null); return 0 }
        return e + 1
      })
    }, 1000)
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {voices.map((v, i) => {
        const active = playing === i
        const pct = active ? Math.min(100, (elapsed / v.seconds) * 100) : 0
        return (
          <article key={v.name} className="rounded-2xl border p-4" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => toggle(i)} aria-label={`${active ? t('demo.pause') : t('demo.play')} ${v.name}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95" style={{ background: 'var(--color-accent)' }}>
                {active ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="min-w-0">
                <p className="title-2 truncate">{v.name}</p>
                <p className="caption-2 opacity-70">{v.lang} · {v.seconds}s · {t('demo.sample')}</p>
              </div>
            </div>
            <div className="mt-4 flex h-8 items-center gap-1" aria-hidden="true">
              {BARS.map((h, j) => (
                <span key={j} className={`w-1 rounded-full ${active ? 'anim-bar' : ''}`} style={{ height: `${h}px`, background: 'var(--color-accent)', opacity: active ? 1 : 0.4, animationDelay: `${j * 45}ms` }} />
              ))}
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-muted)' }} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${v.name} ${t('demo.progress')}`}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--color-accent)', transition: 'width 500ms cubic-bezier(0.22,1,0.36,1)' }} />
            </div>
            <p className="body-6 mt-4 opacity-80">{v.desc}</p>
          </article>
        )
      })}
    </div>
  )
}

export function Examples() {
  const { t, ta } = useLang()
  const langs = ta<{ name: string; native: string }>('examples.languages')
  const cases = ta<{ title: string; text: string }>('examples.cases')
  return (
    <section id="examples" aria-labelledby="examples-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
      <SectionHead eyebrow={t('examples.eyebrow')} title={t('examples.title')} sub={t('examples.sub')} />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {cases.map((c, i) => (
          <Reveal key={i}>
            <article className="h-full rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
              <Microphone size={22} className="mb-4" style={{ color: 'var(--color-accent)' }} />
              <h3 className="title-1">{c.title}</h3>
              <p className="body-6 mt-4 opacity-80">{c.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <h3 className="heading-5 mt-16 text-center">{t('examples.langTitle')}</h3>
      <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
        {langs.map((l) => (
          <li key={l.name} className="button-sm rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)' }}>
            {l.native} <span className="opacity-60">({l.name})</span>
          </li>
        ))}
      </ul>
      <p className="caption-2 mt-8 text-center opacity-60">{t('examples.langNote')}</p>
    </section>
  )
}
