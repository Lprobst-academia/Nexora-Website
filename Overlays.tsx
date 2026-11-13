import { useEffect, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, CreditCard, Gamepad2, Play, ShoppingBag, X, Zap } from 'lucide-react'
import type { Game } from '../data'
import { money } from '../data'

export function GameModal({game,onClose,onBuy,onDemo}:{game:Game;onClose:()=>void;onBuy:()=>void;onDemo:()=>void}) {
  const [tab,setTab]=useState<'overview'|'media'>('overview')
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="game-modal">
      <button className="icon-btn modal-close" onClick={onClose}><X/></button>
      <div className="game-hero" style={{backgroundImage:`linear-gradient(90deg,#090e17 4%,rgba(9,14,23,.86) 42%,rgba(9,14,23,.12)),url(${game.cover})`}}>
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> FEATURED RELEASE <span>／ {game.genre.toUpperCase()}</span></div>
          <h1>{game.title}</h1><p className="tagline">{game.tagline}</p><p className="game-desc">{game.description}</p>
          <div className="hero-actions"><button className="btn-primary" onClick={onBuy}><ShoppingBag size={17}/> BUY NOW · {money(game.price)}</button>{game.demo&&<button className="btn-ghost" onClick={onDemo}><Play size={16}/> PLAY DEMO</button>}</div>
        </div>
      </div>
      <div className="modal-body">
        <div className="tab-row"><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>OVERVIEW</button><button className={tab==='media'?'active':''} onClick={()=>setTab('media')}>MEDIA & TRAILER</button></div>
        {tab==='overview'?<div className="info-grid"><div><span className="field-label">GENRE</span><b>{game.genre}</b></div><div><span className="field-label">PLATFORM</span><b>PC · WINDOWS</b></div><div><span className="field-label">STORE ID</span><b>NA-{game.id.toUpperCase()}-01</b></div><div><span className="field-label">PRICE</span><b>{money(game.price)}</b></div></div>:
          <div className="media-preview"><div className="video-placeholder" style={{backgroundImage:`linear-gradient(0deg,rgba(5,10,18,.6),rgba(5,10,18,.15)),url(${game.cover})`}}><button className="play-circle" onClick={()=>{}}><Play fill="currentColor"/></button><span>TRAILER PREVIEW · COMING SOON</span></div><div className="media-thumbs"><div style={{backgroundImage:`url(${game.cover})`}}/><div style={{backgroundImage:`url(https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500)`}}/><div style={{backgroundImage:`url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500)`}}/></div></div>}
        <div className="modal-footer"><span><span className="live-dot"/> AVAILABLE NOW</span><button className="text-btn" onClick={onClose}><ArrowLeft size={15}/> BACK TO STORE</button></div>
      </div>
    </section>
  </div>
}
export function Checkout({game,onClose,onSuccess}:{game:Game;onClose:()=>void;onSuccess:()=>void}) {
  const [done,setDone]=useState(false)
  return <div className="overlay top-overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="checkout-card">
    <button className="icon-btn modal-close" onClick={onClose}><X/></button>
    {done?<div className="success-state"><div className="success-icon"><Check/></div><span className="eyebrow">ORDER CONFIRMED</span><h2>It's yours.</h2><p>Your demo order for <b>{game.title}</b> has been confirmed.</p><div className="order-ref">ORDER REF · NA-2026-{game.id.toUpperCase()}</div><button className="btn-primary full" onClick={onSuccess}>RETURN TO STORE <ChevronRight size={17}/></button></div>:
    <><span className="eyebrow">SECURE CHECKOUT · DEMO</span><h2>Complete your order</h2><div className="checkout-item"><img src={game.cover}/><div><b>{game.title}</b><span>{game.genre} · Digital edition</span></div><strong>{money(game.price)}</strong></div><div className="checkout-line"><span>Subtotal</span><b>{money(game.price)}</b></div><div className="checkout-line"><span>Tax</span><b>Included</b></div><div className="checkout-total"><span>TOTAL</span><strong>{money(game.price)}</strong></div><div className="demo-notice"><CreditCard size={16}/> Prototype checkout — no real payment will be taken.</div><button className="btn-primary full" onClick={()=>setDone(true)}><Zap size={16}/> CONFIRM DEMO PURCHASE</button><button className="text-btn centered" onClick={onClose}>CANCEL</button></>}
  </section></div>
}
export function DemoGame({onClose}:{onClose:()=>void}) {
  const [score,setScore]=useState(0),[time,setTime]=useState(20),[active,setActive]=useState(false)
  useEffect(()=>{if(!active||time<=0)return;const id=window.setInterval(()=>setTime(t=>t-1),1000);return()=>clearInterval(id)},[active,time])
  useEffect(()=>{const f=(e:KeyboardEvent)=>{if(e.code==='Space'&&active&&time>0){e.preventDefault();setScore(s=>s+1)}};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f)},[active,time])
  return <div className="overlay top-overlay"><section className="demo-modal"><div className="demo-top"><div><span className="eyebrow">EVO RACING · ARCADE CHALLENGE</span><h2>BOOST RUN</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
    <div className="arcade-screen"><div className="arcade-scan"/><div className="arcade-stats"><span>SCORE <b>{score.toString().padStart(3,'0')}</b></span><span>TIME <b>00:{time.toString().padStart(2,'0')}</b></span></div><div className="road"><div className="road-lines"/><div className="car">▰</div><div className="obstacle" style={{left:`${20+(score*19)%65}%`}}>◆</div></div>{!active||time===0?<div className="arcade-start"><h3>{time===0?'RUN COMPLETE':'READY TO RACE?'}</h3><p>{time===0?`Final score: ${score} boosts`:'Press SPACE as fast as you can to boost through the course.'}</p><button className="btn-primary" onClick={()=>{setScore(0);setTime(20);setActive(true)}}>{time===0?'PLAY AGAIN':'START DEMO'}</button></div>:<div className="arcade-hint">PRESS <b>SPACE</b> TO BOOST</div>}</div>
    <div className="demo-bottom"><span><Gamepad2 size={15}/> KEYBOARD · SPACE TO BOOST</span><button className="text-btn" onClick={onClose}>EXIT DEMO</button></div>
  </section></div>
}
