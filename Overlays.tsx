import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, CreditCard, Gamepad2, Play, ShoppingBag, X, Zap } from 'lucide-react'
import type { Game } from './data'
import { money } from './data'

export function GameModal({ game, onClose, onBuy, onDemo }: { game: Game; onClose: () => void; onBuy: () => void; onDemo: () => void }) {
  const [tab, setTab] = useState<'overview' | 'media'>('overview')
  return <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="game-modal">
      <button className="icon-btn modal-close" onClick={onClose} type="button" aria-label="Close"><X /></button>
      <div className="game-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(8,25,15,.94) 4%,rgba(8,25,15,.75) 48%,rgba(8,25,15,.08)),url(${game.cover})` }}>
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> FEATURED RELEASE <span>／ {game.genre.toUpperCase()}</span></div>
          <h1>{game.title}</h1><p className="tagline">{game.tagline}</p><p className="game-desc">{game.description}</p>
          <div className="hero-actions"><button className="btn-primary" onClick={onBuy} type="button"><ShoppingBag size={17} /> BUY NOW · {money(game.price)}</button>{game.demo && <button className="btn-ghost" onClick={onDemo} type="button"><Play size={16} /> PLAY DEMO</button>}</div>
        </div>
      </div>
      <div className="modal-body">
        <div className="tab-row"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')} type="button">OVERVIEW</button><button className={tab === 'media' ? 'active' : ''} onClick={() => setTab('media')} type="button">MEDIA & TRAILER</button></div>
        {tab === 'overview' ? <div className="info-grid"><div><span className="field-label">GENRE</span><b>{game.genre}</b></div><div><span className="field-label">PLATFORM</span><b>PC · WINDOWS</b></div><div><span className="field-label">STORE ID</span><b>NA-{game.id.toUpperCase()}</b></div><div><span className="field-label">PRICE</span><b>{money(game.price)}</b></div></div> :
          <div className="media-preview"><div className="video-placeholder" style={{ backgroundImage: `linear-gradient(0deg,rgba(5,10,18,.6),rgba(5,10,18,.15)),url(${game.cover})` }}><span>{game.trailer ? 'TRAILER AVAILABLE' : 'TRAILER PREVIEW · COMING SOON'}</span></div><div className="media-thumbs"><div style={{ backgroundImage: `url(${game.cover})` }} /><div style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500)' }} /><div style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500)' }} /></div></div>}
        <div className="modal-footer"><span><span className="live-dot" /> AVAILABLE NOW</span><button className="text-btn" onClick={onClose} type="button"><ArrowLeft size={15} /> BACK TO STORE</button></div>
      </div>
    </section>
  </div>
}

export function Checkout({ game, onClose, onSuccess }: { game: Game; onClose: () => void; onSuccess: (game: Game) => void }) {
  const [done, setDone] = useState(false)
  return <div className="overlay top-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="checkout-card">
    <button className="icon-btn modal-close" onClick={onClose} type="button" aria-label="Close"><X /></button>
    {done ? <div className="success-state"><div className="success-icon"><Check /></div><span className="eyebrow">ORDER CONFIRMED</span><h2>It's yours.</h2><p>Your demo order for <b>{game.title}</b> has been confirmed.</p><div className="order-ref">ORDER REF · NA-2026-{game.id.toUpperCase()}</div><button className="btn-primary full" onClick={() => onSuccess(game)} type="button">ADD TO MY GAMES <ChevronRight size={17} /></button></div> :
      <><span className="eyebrow">SECURE CHECKOUT · DEMO</span><h2>Complete your order</h2><div className="checkout-item"><img src={game.cover} alt="" /><div><b>{game.title}</b><span>{game.genre} · Digital edition</span></div><strong>{money(game.price)}</strong></div><div className="checkout-line"><span>Subtotal</span><b>{money(game.price)}</b></div><div className="checkout-line"><span>Tax</span><b>Included</b></div><div className="checkout-total"><span>TOTAL</span><strong>{money(game.price)}</strong></div><div className="demo-notice"><CreditCard size={16} /> Prototype checkout — no real payment will be taken.</div><button className="btn-primary full" onClick={() => setDone(true)} type="button"><Zap size={16} /> CONFIRM DEMO PURCHASE</button><button className="text-btn centered" onClick={onClose} type="button">CANCEL</button></>}
  </section></div>
}

type DemoSpec = { title: string; instruction: string; action: string; kind: 'tap' | 'targets' | 'resources' | 'signal' | 'build' | 'path' }
function demoFor(game: Game): DemoSpec {
  const specs: Record<string, DemoSpec> = {
    evo: { title: 'NIGHT DRIVE', instruction: 'Build boost by tapping the accelerator before the timer runs out.', action: 'BOOST', kind: 'tap' },
    shadow: { title: 'TARGET LOCK', instruction: 'Tap the moving target to tag it. Every hit earns a point.', action: 'TAG TARGET', kind: 'targets' },
    kingdoms: { title: 'KINGDOM BUILDER', instruction: 'The banner asks for a resource. Choose the matching supply to grow your settlement.', action: 'GATHER', kind: 'resources' },
    space: { title: 'SIGNAL MATCH', instruction: 'Match the signal shown at the top by choosing the same symbol below.', action: 'MATCH SIGNAL', kind: 'signal' },
    pixel: { title: 'PIXEL BUILDER', instruction: 'Fill the six empty tiles to finish your tiny build.', action: 'PLACE BLOCK', kind: 'build' },
    night: { title: 'LANTERN TRAIL', instruction: 'Follow the lantern sequence in the right order: 1, 2, then 3.', action: 'FOLLOW LIGHT', kind: 'path' },
  }
  return specs[game.id] ?? { title: `${game.title} · FIRST LOOK`, instruction: `Try a short challenge inspired by ${game.title}.`, action: 'PLAY', kind: 'tap' }
}

export function DemoGame({ game, onClose }: { game: Game; onClose: () => void }) {
  const spec = useMemo(() => demoFor(game), [game])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(25)
  const [active, setActive] = useState(false)
  const [target, setTarget] = useState(1)
  const [placed, setPlaced] = useState<number[]>([])
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState('READY WHEN YOU ARE')
  useEffect(() => { if (!active || time <= 0) return; const id = window.setInterval(() => setTime(t => Math.max(0, t - 1)), 1000); return () => window.clearInterval(id) }, [active, time])
  useEffect(() => { if (spec.kind !== 'targets' || !active) return; const id = window.setInterval(() => setTarget(Math.floor(Math.random() * 6)), 850); return () => window.clearInterval(id) }, [spec.kind, active])
  useEffect(() => { const f = (e: KeyboardEvent) => { if (e.code === 'Space' && active && spec.kind === 'tap') { e.preventDefault(); setScore(s => s + 1) } }; window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f) }, [active, spec.kind])
  const start = () => { setScore(0); setTime(25); setPlaced([]); setStep(0); setActive(true); setFeedback('GO!') }
  const action = (value?: number) => {
    if (!active || time <= 0) return
    if (spec.kind === 'tap') { setScore(s => s + 1); setFeedback('BOOST CHARGED') }
    if (spec.kind === 'targets') { if (value === target) { setScore(s => s + 1); setFeedback('TARGET TAGGED') } else setFeedback('MISSED — TRY AGAIN') }
    if (spec.kind === 'resources') { const wanted = ['WOOD', 'STONE', 'FOOD'][score % 3]; if (value === score % 3) { setScore(s => s + 1); setFeedback(`${wanted} STORED`) } else setFeedback(`THE BANNER NEEDS ${wanted}`) }
    if (spec.kind === 'signal') { if (value === target) { setScore(s => s + 1); setTarget(t => (t + 1) % 3); setFeedback('SIGNAL SYNCHRONISED') } else setFeedback('SIGNAL MISMATCH') }
    if (spec.kind === 'build') { if (value !== undefined && !placed.includes(value)) { const next = [...placed, value]; setPlaced(next); setScore(next.length); setFeedback('BLOCK PLACED') } }
    if (spec.kind === 'path') { if (value === step + 1) { setStep(s => s + 1); setScore(s => s + 1); setFeedback('PATH CONTINUES') } else { setStep(0); setFeedback('PATH RESET — START AT 1') } }
  }
  const signal = ['✦', '◈', '◎'][target]
  return <div className="overlay top-overlay"><section className="demo-modal game-specific-demo">
    <div className="demo-top"><div><span className="eyebrow">{game.title} · EXCLUSIVE MINI DEMO</span><h2>{spec.title}</h2></div><button className="icon-btn" onClick={onClose} type="button" aria-label="Close demo"><X /></button></div>
    <div className={`arcade-screen demo-${spec.kind}`}>
      <div className="arcade-scan"/><div className="arcade-stats"><span>SCORE <b>{score.toString().padStart(3, '0')}</b></span><span>TIME <b>00:{time.toString().padStart(2, '0')}</b></span></div>
      {!active || time === 0 ? <div className="arcade-start"><h3>{time === 0 ? 'DEMO COMPLETE' : 'READY TO PLAY?'}</h3><p>{time === 0 ? `You scored ${score}. Try again and beat your record.` : spec.instruction}</p><button className="btn-primary" onClick={start} type="button">{time === 0 ? 'PLAY AGAIN' : 'START DEMO'}</button></div> : <>
        {spec.kind === 'targets' && <div className="target-grid">{Array.from({ length: 6 }, (_, i) => <button key={i} className={target === i ? 'target-active' : ''} onClick={() => action(i)} type="button">{target === i ? '✦' : '·'}</button>)}</div>}
        {spec.kind === 'resources' && <div className="resource-game"><b>SETTLEMENT NEEDS: {['WOOD', 'STONE', 'FOOD'][score % 3]}</b><div>{['WOOD', 'STONE', 'FOOD'].map((r, i) => <button key={r} onClick={() => action(i)} type="button">{['🪵', '🪨', '🌾'][i]}<small>{r}</small></button>)}</div></div>}
        {spec.kind === 'signal' && <div className="signal-game"><strong>{signal}</strong><div>{['✦', '◈', '◎'].map((s, i) => <button key={s} onClick={() => action(i)} type="button">{s}</button>)}</div></div>}
        {spec.kind === 'build' && <div className="build-grid">{Array.from({ length: 6 }, (_, i) => <button key={i} className={placed.includes(i) ? 'placed' : ''} onClick={() => action(i)} type="button">{placed.includes(i) ? '▦' : '+'}</button>)}</div>}
        {spec.kind === 'path' && <div className="path-game"><p>FOLLOW THE LIGHT · NEXT: {step + 1}</p><div>{[1, 2, 3].map(n => <button key={n} onClick={() => action(n)} type="button">{n}</button>)}</div></div>}
        {spec.kind === 'tap' && <div className="tap-game"><div className="boost-meter"><span style={{ width: `${Math.min(100, score * 4)}%` }}/></div><button onClick={() => action()} type="button">{spec.action}</button></div>}
        <div className="demo-feedback">{feedback}</div>
      </>}
    </div>
    <div className="demo-bottom"><span><Gamepad2 size={15} /> {spec.instruction}</span><button className="text-btn" onClick={onClose} type="button">EXIT DEMO</button></div>
  </section></div>
}
