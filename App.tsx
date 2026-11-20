import { useEffect, useState } from 'react'
import { ArrowRight, ChevronRight, Compass, Gamepad2, Mouse, ShieldCheck, ShoppingBag, Sparkles, Volume2, X } from 'lucide-react'
import { initialGames, type Game } from './data'
import Store3D from './Store3D'
import Dashboard from './Dashboard'
import { Checkout, DemoGame, GameModal } from './Overlays'
import defaultLogo from './nexora-logo.png'

type SavedStore = { games: Game[]; storeName: string; primary: string; theme: string; logo?: string; schemaVersion?: number }
function loadStore(): SavedStore | null {
  try { const raw = window.localStorage.getItem('nexora-store-settings'); return raw ? JSON.parse(raw) as SavedStore : null } catch { return null }
}
function loadPurchased(): string[] {
  try { return JSON.parse(window.localStorage.getItem('nexora-purchased-games') || '[]') as string[] } catch { return [] }
}

export default function App() {
  const [saved] = useState<SavedStore | null>(() => typeof window === 'undefined' ? null : loadStore())
  const [page, setPage] = useState<'home' | 'store' | 'admin'>('home')
  const [games, setGames] = useState<Game[]>(saved?.games?.length ? saved.games.map(game => ({ ...game, demo: (saved.schemaVersion ?? 0) >= 3 ? game.demo : true })) : initialGames)
  const [storeName, setStoreName] = useState(saved?.storeName ?? 'NEON ARCADE')
  const [primary, setPrimary] = useState(saved?.primary ?? '#238653')
  const [theme, setTheme] = useState(saved?.theme ?? 'minimal')
  const [logo, setLogo] = useState(saved?.logo ?? defaultLogo)
  const [purchased, setPurchased] = useState<string[]>(() => typeof window === 'undefined' ? [] : loadPurchased())
  const [showOwned, setShowOwned] = useState(false)
  const [selected, setSelected] = useState<Game | null>(null)
  const [checkout, setCheckout] = useState<Game | null>(null)
  const [demo, setDemo] = useState<Game | null>(null)
  const [entered, setEntered] = useState(false)
  const [touchMode, setTouchMode] = useState(false)

  useEffect(() => {
    try { window.localStorage.setItem('nexora-store-settings', JSON.stringify({ games, storeName, primary, theme, logo, schemaVersion: 3 })) } catch { /* local storage quota: app remains usable for this session */ }
  }, [games, storeName, primary, theme, logo])
  useEffect(() => { try { window.localStorage.setItem('nexora-purchased-games', JSON.stringify(purchased)) } catch { /* ignore unavailable storage */ } }, [purchased])
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const update = () => setTouchMode(query.matches || navigator.maxTouchPoints > 0)
    update(); query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const addPurchase = (game: Game) => { setPurchased(current => current.includes(game.id) ? current : [...current, game.id]); setCheckout(null); setSelected(null); setShowOwned(true) }
  const ownedGames = purchased.map(id => games.find(game => game.id === id)).filter((game): game is Game => Boolean(game))

  if (page === 'admin') return <Dashboard games={games} setGames={setGames} storeName={storeName} setStoreName={setStoreName} primary={primary} setPrimary={setPrimary} theme={theme} setTheme={setTheme} logo={logo} setLogo={setLogo} onBack={() => setPage('home')} />

  if (page === 'store') return <main className="store-page">
    <Store3D games={games} storeName={storeName} primary={primary} theme={theme} logo={logo} onSelect={setSelected} />
    <div className="store-topbar">
      <button className="store-brand" onClick={() => setPage('home')} type="button"><span className="brand-mark tiny">N<span>.</span></span><b>{storeName}</b></button>
      <div className="store-top-right"><span className="store-live"><i /> SHOWROOM LIVE</span><button className="owned-toggle" onClick={() => setShowOwned(true)} type="button"><ShoppingBag size={16}/> MY GAMES <span>{purchased.length}</span></button><button className="exit-store" onClick={() => setPage('home')} type="button">EXIT STORE <span>↗</span></button></div>
    </div>
    {!touchMode && <div className="store-controls"><div><span className="keycap">W</span><span className="keycap">A</span><span className="keycap">S</span><span className="keycap">D</span><small>MOVE</small></div><div><span className="mouse-icon"><Mouse size={18}/></span><small>LOOK</small></div><div><span className="keycap">E</span><small>INTERACT</small></div><div><span className="keycap">ESC</span><small>UNLOCK</small></div></div>}
    {!entered && <div className="store-welcome"><div className="welcome-card"><span className="eyebrow"><span className="live-dot"/> WELCOME TO YOUR NEXT LEVEL</span><h2>Explore.<br/><em>Discover.</em> Play.</h2><p>Step into the showroom and explore our latest collection of worlds.</p><button className="btn-primary" onClick={() => { setEntered(true); if (!touchMode) document.querySelector('canvas')?.requestPointerLock?.() }} type="button">{touchMode ? 'START EXPLORING' : 'ENTER SHOWROOM'} <ArrowRight size={17}/></button><span className="welcome-note">{touchMode ? 'USE THE ARROWS TO MOVE · DRAG TO LOOK' : 'WASD TO MOVE · MOUSE TO LOOK · E TO INTERACT'}</span></div></div>}
    <div className="store-bottom"><span><Sparkles size={14}/> SIX WORLDS. ONE DESTINATION.</span><span>POWERED BY NEXORA ARCADE EXPERIENCE ENGINE</span></div>
    {selected && <GameModal game={selected} onClose={() => setSelected(null)} onBuy={() => { setCheckout(selected); setSelected(null) }} onDemo={() => setDemo(selected)} />}
    {checkout && <Checkout game={checkout} onClose={() => setCheckout(null)} onSuccess={addPurchase} />}
    {demo && <DemoGame game={demo} onClose={() => setDemo(null)} />}
    {showOwned && <div className="owned-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowOwned(false)}><aside className="owned-drawer"><header><div><span className="eyebrow">YOUR LIBRARY</span><h2>My games <span>{ownedGames.length}</span></h2></div><button className="icon-btn" onClick={() => setShowOwned(false)} type="button" aria-label="Close library"><X/></button></header>{ownedGames.length ? <div className="owned-list">{ownedGames.map(game => <article key={game.id} className="owned-item"><img src={game.cover} alt=""/><div><b>{game.title}</b><small>{game.genre} · Owned</small></div><span className="owned-check">✓</span></article>)}</div> : <div className="owned-empty"><ShoppingBag size={28}/><h3>Your library is waiting</h3><p>Games you purchase in this demo store will appear here.</p></div>}<button className="btn-primary full" onClick={() => setShowOwned(false)} type="button">BACK TO SHOWROOM</button></aside></div>}
  </main>

  return <main className="home"><div className="home-grid"/><nav className="home-nav"><div className="brand-lockup"><div className="brand-mark">N<span>.</span></div><div><b>NEXORA<span> ARCADE</span></b><small>VIRTUAL GAME STORES</small></div></div><div className="nav-center"><span>THE NEXT ERA OF GAME DISCOVERY</span></div><div className="nav-right"><span className="live-dot"/> INTERACTIVE SHOWCASE <span className="nav-version">V 3.0</span></div></nav>
    <section className="home-hero"><div className="hero-left"><div className="eyebrow"><span className="live-dot"/> THE FUTURE OF DIGITAL COMMERCE</div><h1>Not just a store.<br/><em>A whole new</em><br/>world to play in.</h1><p className="home-lead">We turn online game shops into immersive 3D destinations. Walk in, discover new worlds, try a demo and make your next game yours.</p><div className="home-actions"><button className="btn-primary large" onClick={() => { setPage('store'); setEntered(false) }} type="button"><Gamepad2 size={18}/> ENTER THE STORE <ArrowRight size={17}/></button><button className="btn-ghost large" onClick={() => setPage('admin')} type="button">OPEN STORE BUILDER <ChevronRight size={17}/></button></div><div className="hero-proof"><div><b>01</b><span>EXPLORE IN 3D</span></div><div><b>02</b><span>TRY BEFORE YOU BUY</span></div><div><b>03</b><span>BUILT FOR YOUR BRAND</span></div></div></div>
      <div className="hero-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><img src={logo} alt="Nexora logo" className="nexora-hero-logo"/><div className="core-ring"/><span className="core-caption">YOUR WORLD<br/>YOUR RULES</span></div><div className="floating-chip chip-top"><span className="chip-dot"/> IMMERSIVE BY DESIGN</div><div className="floating-chip chip-bottom"><Gamepad2 size={16}/> 3D GAME DISCOVERY</div></div>
    </section><section className="entry-cards"><button className="entry-card store-entry" onClick={() => { setPage('store'); setEntered(false) }} type="button"><div className="entry-icon"><Compass/></div><div className="entry-meta">01 / CUSTOMER EXPERIENCE</div><h2>Enter the store<span>↗</span></h2><p>Walk through a virtual showroom. Explore game displays, watch previews and try a demo.</p><div className="entry-bottom"><span>EXPLORE THE 3D WORLD</span><ArrowRight size={18}/></div></button><button className="entry-card admin-entry" onClick={() => setPage('admin')} type="button"><div className="entry-icon"><ShieldCheck/></div><div className="entry-meta">02 / COMPANY PLATFORM</div><h2>Store builder<span>↗</span></h2><p>Make the experience yours. Customize your brand, manage your games and preview changes live.</p><div className="entry-bottom"><span>OPEN YOUR WORKSPACE</span><ArrowRight size={18}/></div></button></section><footer className="home-footer"><span>© 2026 NEXORA ARCADE EXPERIENCE</span><span>MADE FOR THE NEXT GENERATION OF GAME STORES</span><span><Volume2 size={13}/> SOUND OFF</span></footer>
  </main>
}
