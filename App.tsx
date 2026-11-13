import { useEffect, useState } from 'react'
import { ArrowRight, ChevronRight, Compass, Gamepad2, Mouse, Move, ShieldCheck, Sparkles, Volume2 } from 'lucide-react'
import { initialGames, type Game } from './data'
import Store3D from './components/Store3D'
import Dashboard from './components/Dashboard'
import { Checkout, DemoGame, GameModal } from './components/Overlays'

export default function App() {
  const [page,setPage]=useState<'home'|'store'|'admin'>('home')
  const [games,setGames]=useState<Game[]>(initialGames)
  const [storeName,setStoreName]=useState('NEON ARCADE')
  const [primary,setPrimary]=useState('#72e5c1')
  const [theme,setTheme]=useState('dark')
  const [selected,setSelected]=useState<Game|null>(null)
  const [checkout,setCheckout]=useState<Game|null>(null)
  const [demo,setDemo]=useState(false)
  const [entered,setEntered]=useState(false)
  useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.code==='KeyE'&&page==='store'&&!selected&&!checkout&&!demo){const el=document.querySelector('.near-card button') as HTMLButtonElement|null;el?.click()}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[page,selected,checkout,demo])
  if(page==='admin') return <Dashboard games={games} setGames={setGames} storeName={storeName} setStoreName={setStoreName} primary={primary} setPrimary={setPrimary} theme={theme} setTheme={setTheme} onBack={()=>setPage('home')}/>
  if(page==='store') return <main className="store-page">
    <Store3D games={games} storeName={storeName} primary={primary} theme={theme} onSelect={setSelected}/>
    <div className="store-topbar"><button className="store-brand" onClick={()=>setPage('home')}><span className="brand-mark tiny">N<span>.</span></span><b>{storeName}</b></button><div className="store-top-right"><span className="store-live"><i/> SHOWROOM LIVE</span><button className="exit-store" onClick={()=>setPage('home')}>EXIT STORE <span>↗</span></button></div></div>
    <div className="store-controls"><div><span className="keycap">W</span><span className="keycap">A</span><span className="keycap">S</span><span className="keycap">D</span><small>MOVE</small></div><div><span className="mouse-icon"><Mouse size={18}/></span><small>LOOK</small></div><div><span className="keycap">E</span><small>INTERACT</small></div><div><span className="keycap">ESC</span><small>UNLOCK</small></div></div>
    {!entered&&<div className="store-welcome"><div className="welcome-card"><span className="eyebrow"><span className="live-dot"/> WELCOME TO YOUR NEXT LEVEL</span><h2>Explore.<br/><em>Discover.</em> Play.</h2><p>Step into the showroom and explore our latest collection of worlds.</p><button className="btn-primary" onClick={()=>{setEntered(true);document.querySelector('canvas')?.requestPointerLock?.()}}>ENTER SHOWROOM <ArrowRight size={17}/></button><span className="welcome-note">BEST EXPERIENCED WITH A MOUSE & KEYBOARD</span></div></div>}
    <div className="store-bottom"><span><Sparkles size={14}/> SIX WORLDS. ONE DESTINATION.</span><span>POWERED BY NEON ARCADE EXPERIENCE ENGINE</span></div>
    {selected&&<GameModal game={selected} onClose={()=>setSelected(null)} onBuy={()=>{setCheckout(selected);setSelected(null)}} onDemo={()=>setDemo(true)}/>}
    {checkout&&<Checkout game={checkout} onClose={()=>setCheckout(null)} onSuccess={()=>setCheckout(null)}/>}
    {demo&&<DemoGame onClose={()=>setDemo(false)}/>}
  </main>
  return <main className="home">
    <div className="home-grid"/><nav className="home-nav"><div className="brand-lockup"><div className="brand-mark">N<span>.</span></div><div><b>NEON<span>ARCADE</span></b><small>VIRTUAL GAME STORES</small></div></div><div className="nav-center"><span>THE NEXT ERA OF GAME DISCOVERY</span></div><div className="nav-right"><span className="live-dot"/> INTERACTIVE SHOWCASE <span className="nav-version">V 1.0</span></div></nav>
    <section className="home-hero"><div className="hero-left"><div className="eyebrow"><span className="live-dot"/> THE FUTURE OF DIGITAL COMMERCE</div><h1>Not just a store.<br/><em>A whole new</em><br/>world to play in.</h1><p className="home-lead">We turn online game shops into immersive 3D destinations. Walk in, discover new worlds, try a demo and make your next game yours.</p><div className="home-actions"><button className="btn-primary large" onClick={()=>{setPage('store');setEntered(false)}}><Gamepad2 size={18}/> ENTER THE STORE <ArrowRight size={17}/></button><button className="btn-ghost large" onClick={()=>setPage('admin')}>OPEN STORE BUILDER <ChevronRight size={17}/></button></div><div className="hero-proof"><div><b>01</b><span>EXPLORE IN 3D</span></div><div><b>02</b><span>TRY BEFORE YOU BUY</span></div><div><b>03</b><span>BUILT FOR YOUR BRAND</span></div></div></div>
      <div className="hero-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><div className="core-ring"/><div className="core-logo">N<span>.</span></div><span className="core-caption">YOUR WORLD<br/>YOUR RULES</span></div><div className="floating-chip chip-top"><span className="chip-dot"/> IMMERSIVE BY DESIGN</div><div className="floating-chip chip-bottom"><Gamepad2 size={16}/> 3D GAME DISCOVERY</div><div className="visual-cross cross-a">+</div><div className="visual-cross cross-b">+</div></div>
    </section>
    <section className="entry-cards"><button className="entry-card store-entry" onClick={()=>{setPage('store');setEntered(false)}}><div className="entry-icon"><Compass/></div><div className="entry-meta">01 / CUSTOMER EXPERIENCE</div><h2>Enter the store<span>↗</span></h2><p>Walk through a virtual showroom. Explore game displays, watch previews and try a demo.</p><div className="entry-bottom"><span>EXPLORE THE 3D WORLD</span><ArrowRight size={18}/></div></button><button className="entry-card admin-entry" onClick={()=>setPage('admin')}><div className="entry-icon"><ShieldCheck/></div><div className="entry-meta">02 / COMPANY PLATFORM</div><h2>Store builder<span>↗</span></h2><p>Make the experience yours. Customize your brand, manage your games and preview changes live.</p><div className="entry-bottom"><span>OPEN YOUR WORKSPACE</span><ArrowRight size={18}/></div></button></section>
    <footer className="home-footer"><span>© 2026 NEON ARCADE EXPERIENCE</span><span>MADE FOR THE NEXT GENERATION OF GAME STORES</span><span><Volume2 size={13}/> SOUND OFF</span></footer>
  </main>
}
