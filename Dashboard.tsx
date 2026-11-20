import { useRef, useState } from 'react'
import { ArrowLeft, Eye, Gamepad2, ImagePlus, LayoutGrid, Palette, Plus, Store, Trash2, WandSparkles } from 'lucide-react'
import type { ChangeEvent } from 'react'
import type { Game } from './data'
import Store3D from './Store3D'
import { money } from './data'

type Props = { games: Game[]; setGames: (g: Game[]) => void; storeName: string; setStoreName: (s: string) => void; primary: string; setPrimary: (s: string) => void; theme: string; setTheme: (s: string) => void; logo: string; setLogo: (s: string) => void; onBack: () => void }

async function compressImage(file: File): Promise<string> {
  const source = await new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.onload = () => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error('Invalid image')); image.src = String(reader.result) }
    reader.readAsDataURL(file)
  })
  const scale = Math.min(1, 1200 / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(source.width * scale); canvas.height = Math.round(source.height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image processing is unavailable')
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', .78)
}

export default function Dashboard(p: Props) {
  const [section, setSection] = useState('appearance')
  const [selected, setSelected] = useState(p.games[0]?.id ?? '')
  const [preview, setPreview] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const logoInput = useRef<HTMLInputElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)
  const game = p.games.find(g => g.id === selected)
  const update = (id: string, patch: Partial<Game>) => p.setGames(p.games.map(g => g.id === id ? { ...g, ...patch } : g))
  const add = () => {
    const g: Game = { id: `game-${Date.now()}`, title: 'NEW RELEASE', genre: 'Adventure', price: 29.99, description: 'Add your game description here.', cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000', accent: '#7dd3fc', tagline: 'YOUR NEXT ADVENTURE', trailer: '', demo: true }
    p.setGames([...p.games, g]); setSelected(g.id); setSection('games')
  }
  const upload = async (event: ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadMessage('Please choose an image file.'); return }
    try { const url = await compressImage(file); callback(url); setUploadMessage('Image uploaded. Changes are saved in this browser.') }
    catch { setUploadMessage('That image could not be processed. Try another file.') }
    event.target.value = ''
  }

  return <div className="dashboard">
    <aside className="dash-sidebar"><div className="brand-lockup"><div className="brand-mark small-mark">N<span>.</span></div><div><b>NEXORA<span> ARCADE</span></b><small>STORE BUILDER</small></div></div><div className="workspace"><div className="workspace-avatar">N</div><div><b>{p.storeName || 'Untitled Store'}</b><small>DEMO WORKSPACE</small></div><span className="workspace-dot"/></div>
      <div className="side-label">WORKSPACE</div>{[{ id: 'appearance', name: 'Appearance', icon: Palette }, { id: 'games', name: 'Game library', icon: Gamepad2 }, { id: 'layout', name: 'Store layout', icon: LayoutGrid }].map(x => <button key={x.id} className={`side-link ${section === x.id ? 'selected' : ''}`} onClick={() => setSection(x.id)} type="button"><x.icon size={17}/>{x.name}</button>)}
      <div className="side-bottom"><div className="plan-card"><WandSparkles size={17}/><b>Studio plan</b><span>All customisation tools unlocked for this demo.</span></div><button className="side-link" onClick={p.onBack} type="button"><ArrowLeft size={17}/> Exit builder</button></div>
    </aside>
    <main className="dash-main"><header className="dash-header"><div><span className="eyebrow">STORE BUILDER / {section.toUpperCase()}</span><h1>{section === 'appearance' ? 'Make it yours' : section === 'games' ? 'Your game library' : 'Shape the experience'}</h1><p>Changes are reflected in your store preview instantly.</p></div><div className="header-actions"><span className="saved-status"><span className="live-dot"/> ALL CHANGES LIVE</span><button className="btn-primary compact" onClick={() => setPreview(!preview)} type="button"><Eye size={16}/>{preview ? 'EDIT STORE' : 'PREVIEW STORE'}</button></div></header>
      {preview ? <div className="preview-full"><div className="preview-toolbar"><span><span className="live-dot"/> LIVE PREVIEW</span><button className="text-btn" onClick={() => setPreview(false)} type="button">BACK TO EDITOR</button></div><Store3D games={p.games} storeName={p.storeName} primary={p.primary} theme={p.theme} logo={p.logo} onSelect={() => {}} interactive={false}/></div> :
      <div className="dash-content"><section className="editor-panel">
        {section === 'appearance' && <>
          <div className="panel-heading"><div className="panel-icon"><Store/></div><div><h3>Store identity</h3><p>Your brand, your virtual destination.</p></div></div>
          <label className="field">STORE NAME<input value={p.storeName} onChange={e => p.setStoreName(e.target.value)} placeholder="Your store name"/></label>
          <div className="field">STORE LOGO<div className="logo-upload"><img className="builder-logo-preview" src={p.logo} alt="Store logo preview"/><div><b>Centrepiece logo</b><small>Displayed in the showroom's green ring</small></div><button className="btn-ghost mini" onClick={() => logoInput.current?.click()} type="button"><ImagePlus size={14}/> Upload image</button><input ref={logoInput} className="visually-hidden" type="file" accept="image/*" onChange={e => upload(e, p.setLogo)}/></div></div>
          <div className="divider-line"/><div className="panel-heading"><div className="panel-icon"><Palette/></div><div><h3>Colour system</h3><p>Choose the signature colours of your store.</p></div></div>
          <div className="color-field"><label>PRIMARY ACCENT</label><div className="color-options">{['#238653', '#17683e', '#65a879', '#a7cdb0', '#d5e9da'].map(c => <button key={c} className={p.primary === c ? 'chosen' : ''} style={{ background: c }} onClick={() => p.setPrimary(c)} type="button"/>)}<input type="color" value={p.primary} onChange={e => p.setPrimary(e.target.value)}/></div></div>
          <div className="divider-line"/><div className="panel-heading"><div className="panel-icon"><WandSparkles/></div><div><h3>Atmosphere</h3><p>Set the mood inside your 3D showroom.</p></div></div>
          <div className="theme-options">{[{ id: 'dark', name: 'Obsidian', desc: 'Dark & futuristic' }, { id: 'minimal', name: 'Minimal', desc: 'Clean & architectural' }, { id: 'colorful', name: 'Spectrum', desc: 'Bright & expressive' }].map(t => <button key={t.id} className={`theme-option ${p.theme === t.id ? 'chosen' : ''}`} onClick={() => p.setTheme(t.id)} type="button"><div className={`theme-swatch ${t.id}`}/><b>{t.name}</b><small>{t.desc}</small></button>)}</div>
        </>}
        {section === 'games' && <>
          <div className="library-heading"><div><h3>Published games <span>{p.games.length}</span></h3><p>Manage the titles displayed in your virtual store.</p></div><button className="btn-primary compact" onClick={add} type="button"><Plus size={16}/> ADD GAME</button></div>
          <div className="game-list">{p.games.map(g => <button key={g.id} className={`library-item ${selected === g.id ? 'chosen' : ''}`} onClick={() => setSelected(g.id)} type="button"><img src={g.cover} alt=""/><span><b>{g.title}</b><small>{g.genre} · {money(g.price)}</small></span><span className="list-dot"/></button>)}</div>
          {game && <div className="game-edit"><div className="divider-line"/><div className="edit-title"><h3>Edit listing</h3><button className="delete-btn" onClick={() => { p.setGames(p.games.filter(g => g.id !== game.id)); setSelected(p.games.find(g => g.id !== game.id)?.id ?? '') }} type="button"><Trash2 size={15}/> Remove</button></div>
            <label className="field">GAME TITLE<input value={game.title} onChange={e => update(game.id, { title: e.target.value })}/></label><div className="two-fields"><label className="field">PRICE (€)<input type="number" min="0" step=".01" value={game.price} onChange={e => update(game.id, { price: Number(e.target.value) })}/></label><label className="field">GENRE<select value={game.genre} onChange={e => update(game.id, { genre: e.target.value })}>{['Action', 'Adventure', 'Racing', 'Strategy', 'Sci-Fi', 'Sandbox', 'RPG', 'Puzzle', 'Sports'].map(g => <option key={g}>{g}</option>)}</select></label></div>
            <label className="field">DESCRIPTION<textarea rows={3} value={game.description} onChange={e => update(game.id, { description: e.target.value })}/></label><label className="field">COVER IMAGE URL<input value={game.cover} onChange={e => update(game.id, { cover: e.target.value })}/></label>
            <div className="cover-upload-row"><img src={game.cover} alt="Cover preview"/><button className="btn-ghost mini" onClick={() => coverInput.current?.click()} type="button"><ImagePlus size={14}/> Upload cover image</button><input ref={coverInput} className="visually-hidden" type="file" accept="image/*" onChange={e => upload(e, url => update(game.id, { cover: url }))}/></div>
            <label className="toggle-row"><span><b>Playable demo</b><small>Show this game's individual mini-game</small></span><input type="checkbox" checked={game.demo} onChange={e => update(game.id, { demo: e.target.checked })}/></label>
          </div>}
        </>}
        {section === 'layout' && <><div className="panel-heading"><div className="panel-icon"><LayoutGrid/></div><div><h3>Showroom layout</h3><p>Choose how visitors discover your games.</p></div></div><div className="layout-options"><button className="layout-choice chosen" type="button"><div className="layout-art six"><i/><i/><i/><i/><i/><i/></div><b>Orbit showroom</b><small>Games arranged around a central logo</small></button><button className="layout-choice" type="button" disabled><div className="layout-art central"><i/><i/><i/></div><b>Central gallery</b><small>Coming in a future version</small><span className="soon-tag">COMING SOON</span></button></div><div className="divider-line"/><div className="toggle-row"><span><b>Featured game spotlight</b><small>Highlight the first featured title</small></span><input type="checkbox" defaultChecked/></div></>}
        {uploadMessage && <p className="upload-message" role="status">{uploadMessage}</p>}
      </section>
      <section className="preview-panel"><div className="preview-toolbar"><div><span className="live-dot"/> LIVE CANVAS</div><span className="preview-size">DESKTOP · 3D</span></div><div className="preview-viewport"><Store3D games={p.games} storeName={p.storeName} primary={p.primary} theme={p.theme} logo={p.logo} onSelect={() => {}} interactive={false}/><div className="preview-label">LIVE STORE PREVIEW</div></div><div className="preview-foot"><div><b>{p.storeName}</b><span>{p.games.length} games · {p.theme} theme</span></div><span className="live-dot"/></div></section></div>}
    </main>
  </div>
}
