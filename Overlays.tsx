import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { ArrowLeft, Check, ChevronRight, CreditCard, Gamepad2, Maximize2, Minimize2, Play, ShoppingBag, X, Zap } from 'lucide-react'
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

type DemoKind = 'racing' | 'stealth' | 'kingdoms' | 'space' | 'pixel' | 'night'
type DemoProfile = { title: string; genre: string; description: string; controls: string; objective: string; kind: DemoKind }
const profiles: Record<string, DemoProfile> = {
  evo: { title: 'NIGHT CIRCUIT', genre: 'ARCADE RACING', description: 'Thread through city traffic, collect energy cells and chain boosts without losing control.', controls: 'A / D or ← / → to steer · SPACE to boost', objective: 'Reach 1,500 distance before the timer ends.', kind: 'racing' },
  shadow: { title: 'GHOST NETWORK', genre: 'STEALTH PUZZLE', description: 'Slip through a security grid, collect three encrypted data fragments and reach the uplink while patrols scan the corridors.', controls: 'WASD or arrow keys to move one tile at a time', objective: 'Collect all 3 data fragments, then reach the green uplink.', kind: 'stealth' },
  kingdoms: { title: 'FRONTIER STEWARD', genre: 'SETTLEMENT STRATEGY', description: 'Balance supplies, expand your settlement and keep your people fed through a changing season.', controls: 'Choose Gather, Build or Trade actions · touch-friendly', objective: 'Build 3 homes while keeping food above zero.', kind: 'kingdoms' },
  space: { title: 'ORBITAL SALVAGE', genre: 'SPACE SURVIVAL', description: 'Pilot a salvage craft through a debris field. Recover energy cores and avoid drifting wreckage.', controls: 'WASD or arrow keys to pilot · SPACE for a short dash', objective: 'Recover 8 energy cores before the 60-second shift ends.', kind: 'space' },
  pixel: { title: 'BLOCKWORKS', genre: 'PUZZLE BUILDER', description: 'Fit falling shapes into the grid, complete full rows and keep the stack below the ceiling.', controls: '← / → move · ↓ soft drop · ↑ rotate · SPACE hard drop', objective: 'Clear 5 rows to complete the build.', kind: 'pixel' },
  night: { title: 'LANTERNKEEP', genre: 'EXPLORATION ADVENTURE', description: 'Explore the twilight garden, light five waypoints and avoid the roaming mist until the gate opens.', controls: 'WASD or arrow keys to walk', objective: 'Light all 5 lanterns, then reach the glowing gate.', kind: 'night' },
}
const fallbackProfile: DemoProfile = { title: 'FIRST LOOK', genre: 'ARCADE CHALLENGE', description: 'Explore a short playable challenge inspired by this game.', controls: 'WASD or arrow keys to move', objective: 'Complete the challenge and beat your best score.', kind: 'space' }

type Engine = {
  kind: DemoKind; keys: Set<string>; started: number; last: number; elapsed: number; score: number; status: string; over: boolean; won: boolean;
  lane: number; obstacles: { lane:number; y:number; type:number }[]; cells: {lane:number;y:number}[]; boost: number; distance: number;
  map: number[][]; player:{x:number;y:number}; shards:{x:number;y:number;got:boolean}[]; guards:{x:number;y:number;dx:number;dy:number;phase:number}[]; moveAt:number; patrolAt:number; caughtAt:number; spaceWasDown:boolean; lives:number;
  wood:number; stone:number; food:number; homes:number; season:number; message:string;
  ship:{x:number;y:number}; rocks:{x:number;y:number;vx:number;vy:number;r:number}[]; cores:{x:number;y:number;got:boolean}[]; dash:number;
  board:number[][]; piece:number[][]; px:number; py:number; lines:number; dropAt:number;
  lanterns:{x:number;y:number;lit:boolean}[]; mist:{x:number;y:number;dx:number;dy:number};
}
const makeEngine = (kind:DemoKind):Engine => ({kind,keys:new Set(),started:0,last:0,elapsed:0,score:0,status:'Ready',over:false,won:false,lane:1,obstacles:[],cells:[],boost:100,distance:0,map:[[1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,1,1,1,0,1],[1,0,1,0,0,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,0,1,0,0,0,1],[1,1,1,1,0,1,0,1,1,1,0,1],[1,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,1,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1]],player:{x:1,y:1},shards:[{x:3,y:3,got:false},{x:8,y:5,got:false},{x:9,y:9,got:false}],guards:[{x:6,y:3,dx:1,dy:0,phase:0},{x:8,y:7,dx:0,dy:1,phase:1}],moveAt:0,patrolAt:0,caughtAt:0,spaceWasDown:false,lives:3,wood:7,stone:5,food:10,homes:0,season:1,message:'Choose your first action.',ship:{x:480,y:390},rocks:[],cores:Array.from({length:8},(_,i)=>({x:90+(i%4)*245,y:115+Math.floor(i/4)*210,got:false})),dash:0,board:Array.from({length:18},()=>Array(10).fill(0)),piece:[[1,1,1],[0,1,0]],px:3,py:0,lines:0,dropAt:0,lanterns:[{x:3,y:1,lit:false},{x:5,y:3,lit:false},{x:2,y:7,lit:false},{x:4,y:9,lit:false},{x:10,y:9,lit:false}],mist:{x:5,y:5,dx:1,dy:0}})

function drawGame(ctx:CanvasRenderingContext2D,e:Engine,w:number,h:number) {
  const sx=w/960, sy=h/540; ctx.save(); ctx.scale(sx,sy)
  const bg=ctx.createLinearGradient(0,0,960,540); bg.addColorStop(0,'#0a1720'); bg.addColorStop(1,'#102c31'); ctx.fillStyle=bg; ctx.fillRect(0,0,960,540)
  ctx.fillStyle='rgba(110,220,175,.06)'; for(let x=0;x<960;x+=40)for(let y=0;y<540;y+=40)ctx.fillRect(x,y,1,1)
  const text=(t:string,x:number,y:number,size=16,color='#e8f4ed',align:CanvasTextAlign='left')=>{ctx.fillStyle=color;ctx.font=`600 ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y)}
  const rounded=(x:number,y:number,ww:number,hh:number,r:number,color:string)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);ctx.fill()}
  if(e.kind==='racing'){
    ctx.fillStyle='#18262b';ctx.beginPath();ctx.moveTo(285,0);ctx.lineTo(675,0);ctx.lineTo(900,540);ctx.lineTo(60,540);ctx.closePath();ctx.fill()
    ctx.strokeStyle='#d7e6db55';ctx.lineWidth=4;ctx.setLineDash([32,28]);for(let x of [415,545]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(480+(x-480)*2.1,540);ctx.stroke()}ctx.setLineDash([])
    for(const o of e.obstacles){const x=360+o.lane*120;rounded(x-25,o.y-22,50,44,8,o.type?'#d38b53':'#b9c6c0');rounded(x-17,o.y-15,34,30,5,o.type?'#74472f':'#445a56')}
    for(const c of e.cells){ctx.fillStyle='#9ce8ba';ctx.beginPath();ctx.arc(360+c.lane*120,c.y,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#eaffef';ctx.stroke()}
    const carX=360+e.lane*120;rounded(carX-24,420,48,76,12,'#36b879');rounded(carX-15,430,30,24,6,'#c9f3dc');ctx.fillStyle='#10251c';ctx.fillRect(carX-29,438,8,18);ctx.fillRect(carX+21,438,8,18)
    text('DISTANCE',34,42,12,'#9bb8a8');text(`${Math.floor(e.distance)} m`,34,72,28);text('BOOST',790,42,12,'#9bb8a8');rounded(790,55,130,12,6,'#304a43');rounded(790,55,130*e.boost/100,12,6,'#75e2a5');text('← / → STEER   SPACE BOOST',480,515,13,'#b9d8c8','center')
  } else if(e.kind==='stealth'||e.kind==='night'){
    const cell=42, ox=228, oy=42;rounded(ox-10,oy-10,cell*12+20,cell*11+20,12,'#102c2a')
    for(let y=0;y<11;y++)for(let x=0;x<12;x++){const wall=e.map[y][x]===1;rounded(ox+x*cell,oy+y*cell,cell-2,cell-2,5,wall?'#38534a':'#173c37');if(!wall){ctx.strokeStyle='#a2d9b222';ctx.strokeRect(ox+x*cell,oy+y*cell,cell-2,cell-2)}}
    if(e.kind==='stealth'){
      e.guards.forEach(g=>{ctx.fillStyle='#d88b64';ctx.beginPath();ctx.arc(ox+g.x*cell+20,oy+g.y*cell+20,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d88b6430';ctx.beginPath();ctx.moveTo(ox+g.x*cell+20,oy+g.y*cell+20);ctx.arc(ox+g.x*cell+20,oy+g.y*cell+20,78,g.phase?-.7:0,g.phase?1.5:2.2);ctx.closePath();ctx.fill()})
      e.shards.forEach(s=>{if(!s.got){ctx.fillStyle='#a5e8d0';ctx.beginPath();ctx.arc(ox+s.x*cell+20,oy+s.y*cell+20,8,0,Math.PI*2);ctx.fill()}})
      rounded(ox+10*cell+6,oy+9*cell+6,28,28,8,e.shards.every(s=>s.got)?'#72e0a3':'#58736a')
    }else{
      e.lanterns.forEach(l=>{ctx.fillStyle=l.lit?'#f7d98a':'#e6a85d';ctx.beginPath();ctx.arc(ox+l.x*cell+20,oy+l.y*cell+20,l.lit?6:10,0,Math.PI*2);ctx.fill();if(!l.lit){ctx.fillStyle='#f3c66a20';ctx.beginPath();ctx.arc(ox+l.x*cell+20,oy+l.y*cell+20,24,0,Math.PI*2);ctx.fill()}})
      ctx.fillStyle='#a9b5c0';ctx.beginPath();ctx.arc(ox+e.mist.x*cell+20,oy+e.mist.y*cell+20,13,0,Math.PI*2);ctx.fill();rounded(ox+10*cell+6,oy+9*cell+6,28,28,8,e.lanterns.every(l=>l.lit)?'#72e0a3':'#58736a')
    }
    ctx.fillStyle='#eaf6ed';ctx.beginPath();ctx.arc(ox+e.player.x*cell+20,oy+e.player.y*cell+20,12,0,Math.PI*2);ctx.fill();text(e.kind==='stealth'?'DATA FRAGMENTS':'LANTERNS',40,80,13,'#9bb8a8');text(e.kind==='stealth'?`${e.shards.filter(s=>s.got).length}/3`:`${e.lanterns.filter(l=>l.lit).length}/5`,40,116,30);text(e.kind==='stealth'?`SIGNAL: ${e.lives} LIVES`:'FOLLOW THE LIGHT',40,155,14)
  } else if(e.kind==='kingdoms'){
    text('FRONTIER SETTLEMENT',55,65,18,'#bfe8ce');[['WOOD',e.wood,'#b98b5b'],['STONE',e.stone,'#aebbc0'],['FOOD',e.food,'#8ecb86']].forEach(([label,val,col],i)=>{const x=55+i*295;text(String(label),x,125,12,'#a8c4b4');rounded(x,142,235,18,8,'#29423b');rounded(x,142,Math.min(235,Number(val)*7),18,8,String(col));text(String(val),x+245,157,17)})
    rounded(70,215,820,245,18,'#1a3c32');for(let i=0;i<e.homes;i++){const x=180+(i%3)*250,y=300+Math.floor(i/3)*95;ctx.fillStyle='#d6b27b';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+45,y-38);ctx.lineTo(x+90,y);ctx.fill();rounded(x+8,y,74,55,6,'#d5e4d1');rounded(x+38,y+25,18,30,3,'#6a8e75')}
    if(!e.homes)text('A new settlement begins with a single camp.',480,330,18,'#d4e7d9','center');text(`HOMES BUILT  ${e.homes}/3`,480,430,15,'#a9dfbd','center');
    const actions=[['GATHER WOOD',55],['QUARRY STONE',275],['HARVEST FOOD',495],['BUILD HOME',715]];actions.forEach(([label,x])=>{rounded(Number(x),475,190,44,9,'#2d8054');text(String(label),Number(x)+95,503,12,'#fff','center')});text(e.message,480,195,16,'#d7eadc','center')
  } else if(e.kind==='space'){
    for(let i=0;i<100;i++){const x=(i*173)%960,y=(i*97)%500;ctx.fillStyle=`rgba(220,245,235,${.25+(i%4)*.15})`;ctx.fillRect(x,y,2,2)}
    e.rocks.forEach(r=>{ctx.fillStyle='#7f9693';ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#bfd0c8';ctx.stroke()});e.cores.forEach(c=>{if(!c.got){ctx.fillStyle='#8ff0c3';ctx.beginPath();ctx.arc(c.x,c.y,10,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d7ffea';ctx.stroke()}})
    ctx.save();ctx.translate(e.ship.x,e.ship.y);ctx.fillStyle='#b8e9ce';ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(18,20);ctx.lineTo(0,12);ctx.lineTo(-18,20);ctx.closePath();ctx.fill();ctx.restore();text('SALVAGE CORES',35,45,12,'#9bb8a8');text(`${e.cores.filter(c=>c.got).length}/8`,35,80,28);text('PILOT  ·  WASD',480,515,13,'#b9d8c8','center')
  } else if(e.kind==='pixel'){
    const size=25,ox=354,oy=54;rounded(ox-12,oy-12,10*size+24,18*size+24,12,'#16332d');for(let y=0;y<18;y++)for(let x=0;x<10;x++){rounded(ox+x*size,oy+y*size,size-2,size-2,3,e.board[y][x]?'#55bd83':'#24443b')}
    e.piece.forEach((row,py)=>row.forEach((v,px)=>{if(v){const x=ox+(e.px+px)*size,y=oy+(e.py+py)*size;if(y>=oy)rounded(x+1,y+1,size-4,size-4,4,'#d0f0dc')}}));text('BLOCKWORKS',45,75,16,'#bfe8ce');text(`ROWS  ${e.lines}/5`,45,118,25);text('← → MOVE',45,175,13);text('↑ ROTATE',45,202,13);text('SPACE DROP',45,229,13)
  }
  if(e.over){rounded(210,170,540,190,18,'#071611ed');text(e.won?'CHALLENGE COMPLETE':'SHIFT OVER',480,235,28,e.won?'#8de5ae':'#f0c18e','center');text(e.status,480,275,15,'#e2efe6','center');text(`SCORE  ${e.score}`,480,315,18,'#bfe8ce','center')}
  ctx.restore()
}

function rotatePiece(piece:number[][]){return piece[0].map((_,i)=>piece.map(row=>row[i]).reverse())}
function collides(board:number[][],piece:number[][],px:number,py:number){return piece.some((row,y)=>row.some((v,x)=>v&&(px+x<0||px+x>=10||py+y>=18||(py+y>=0&&board[py+y][px+x]))))}

function hasLineOfSight(map:number[][],from:{x:number;y:number},to:{x:number;y:number}){
  let x0=from.x,y0=from.y,x1=to.x,y1=to.y;
  const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;
  let err=dx+dy;
  while(x0!==x1||y0!==y1){
    const twice=2*err;
    if(twice>=dy){err+=dy;x0+=sx}
    if(twice<=dx){err+=dx;y0+=sy}
    if(x0===x1&&y0===y1)return true;
    if(map[y0]?.[x0]!==0)return false;
  }
  return true;
}

function nextFloorStep(map:number[][],from:{x:number;y:number},to:{x:number;y:number}){
  const queue=[{x:from.x,y:from.y,first:null as {x:number;y:number}|null}],seen=new Set([from.x+','+from.y]);
  while(queue.length){
    const node=queue.shift()!;
    if(node.x===to.x&&node.y===to.y)return node.first;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const x=node.x+dx,y=node.y+dy,key=x+','+y;
      if(map[y]?.[x]!==0||seen.has(key))continue;
      seen.add(key);queue.push({x,y,first:node.first??{x,y}});
    }
  }
  return null;
}

export function DemoGame({ game, onClose }: { game: Game; onClose: () => void }) {
  const profile = profiles[game.id] ?? fallbackProfile
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const demoShellRef = useRef<HTMLElement>(null)
  const engineRef = useRef<Engine>(makeEngine(profile.kind))
  const [started,setStarted] = useState(false)
  const [fullscreen,setFullscreen] = useState(false)
  const [hud,setHud] = useState({score:0,time:60,status:'Ready to begin',over:false,won:false})
  const engine = engineRef.current
  const toggleFullscreen = async () => {
    if (fullscreen) {
      if (document.fullscreenElement) { try { await document.exitFullscreen() } catch { /* CSS fullscreen remains available */ } }
      setFullscreen(false)
      return
    }
    setFullscreen(true)
    try { await demoShellRef.current?.requestFullscreen?.() } catch { /* iPad Safari uses the CSS fullscreen fallback */ }
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setFullscreen(false) }
    const onFullscreenChange = () => { if (!document.fullscreenElement) setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFullscreenChange) }
  }, [])
  const reset = () => { engineRef.current=makeEngine(profile.kind); engineRef.current.started=performance.now(); engineRef.current.last=performance.now(); setHud({score:0,time:60,status:'In progress',over:false,won:false}); setStarted(true) }
  useEffect(()=>{
    const c=canvasRef.current; if(!c)return
    const ctx=c.getContext('2d'); if(!ctx)return
    let raf=0, lastHud=0
    const resize=()=>{const rect=c.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);c.width=Math.max(1,Math.floor(rect.width*dpr));c.height=Math.max(1,Math.floor(rect.height*dpr));}
    resize();const ro=new ResizeObserver(resize);ro.observe(c)
    const keyDown=(ev:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(ev.code))ev.preventDefault();engineRef.current.keys.add(ev.code)}
    const keyUp=(ev:KeyboardEvent)=>engineRef.current.keys.delete(ev.code)
    window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp)
    const frame=(now:number)=>{
      const e=engineRef.current,dt=Math.min(.04,(now-(e.last||now))/1000);e.last=now
      if(started&&!e.over){e.elapsed=(now-e.started)/1000;const k=e.keys;const held=(...codes:string[])=>codes.some(code=>k.has(code));const justSpace=held('Space')&&!e.spaceWasDown;e.spaceWasDown=held('Space')
        if(e.kind==='racing'){
          if(held('ArrowLeft','KeyA')&&now-(e.moveAt||0)>125){e.lane=Math.max(0,e.lane-1);e.moveAt=now}if(held('ArrowRight','KeyD')&&now-(e.moveAt||0)>125){e.lane=Math.min(2,e.lane+1);e.moveAt=now}
          if(held('Space')&&e.boost>0){e.boost=Math.max(0,e.boost-35*dt);e.distance+=95*dt}else{e.boost=Math.min(100,e.boost+12*dt);e.distance+=42*dt}
          if(Math.random()<dt*.85){
            const busy=new Set(e.obstacles.filter(o=>o.y<105).map(o=>o.lane));
            const safeLanes=[0,1,2].filter(lane=>!busy.has(lane));
            const lane=safeLanes[Math.floor(Math.random()*Math.max(1,safeLanes.length))]??1;
            e.obstacles.push({lane,y:-35,type:Math.random()>.55?1:0});
          }
          if(Math.random()<dt*.48)e.cells.push({lane:Math.floor(Math.random()*3),y:-25})
          e.obstacles.forEach(o=>o.y+=220*dt);e.cells.forEach(o=>o.y+=190*dt)
          e.obstacles=e.obstacles.filter(o=>{if(o.y>430&&o.y<495&&o.lane===e.lane){e.distance=Math.max(0,e.distance-100);e.status='Traffic hit — recover and keep driving';return false}return o.y<570})
          e.cells=e.cells.filter(o=>{if(o.y>420&&o.y<495&&o.lane===e.lane){e.boost=Math.min(100,e.boost+28);e.score+=100;return false}return o.y<570})
          e.score=Math.max(e.score,Math.floor(e.distance));if(e.distance>=1500){e.over=true;e.won=true;e.status='You cleared the night circuit.'}
        } else if(e.kind==='stealth'||e.kind==='night'){
          if(now-e.moveAt>145){let dx=0,dy=0;if(held('ArrowLeft','KeyA'))dx=-1;else if(held('ArrowRight','KeyD'))dx=1;else if(held('ArrowUp','KeyW'))dy=-1;else if(held('ArrowDown','KeyS'))dy=1;if(dx||dy){const nx=e.player.x+dx,ny=e.player.y+dy;if(e.map[ny]?.[nx]===0){e.player={x:nx,y:ny};e.moveAt=now}}}
          if(e.kind==='stealth'){
            e.shards.forEach(s=>{if(!s.got&&s.x===e.player.x&&s.y===e.player.y){s.got=true;e.score+=250;e.status='Encrypted fragment recovered.'}})
            if(now-e.patrolAt>550){
              e.guards.forEach(g=>{
                const preferred=[{x:g.dx,y:g.dy},{x:-g.dy,y:g.dx},{x:g.dy,y:-g.dx},{x:-g.dx,y:-g.dy}];
                const options=preferred.map(v=>({x:g.x+v.x,y:g.y+v.y,dx:v.x,dy:v.y})).filter(v=>e.map[v.y]?.[v.x]===0);
                if(options.length){const next=options[0];g.x=next.x;g.y=next.y;g.dx=next.dx;g.dy=next.dy}
                g.phase=(g.phase+1)%2;
              });
              e.patrolAt=now;
            }
            e.guards.forEach(g=>{
              const distance=Math.hypot(g.x-e.player.x,g.y-e.player.y);
              const seesPlayer=distance<=3.6&&hasLineOfSight(e.map,g,e.player);
              if(seesPlayer&&now-e.caughtAt>1300){
                e.caughtAt=now;e.lives--;e.player={x:1,y:1};e.status='A patrol saw you. Your fragments are safe — try another route.';
                if(e.lives<=0){e.over=true;e.status='The security system locked the network.'}
              }
            })
            if(e.shards.every(s=>s.got)&&e.player.x===10&&e.player.y===9){e.over=true;e.won=true;e.score+=500;e.status='Uplink secured. Clean extraction.'}
          }else{
            e.lanterns.forEach(l=>{if(!l.lit&&l.x===e.player.x&&l.y===e.player.y){l.lit=true;e.score+=150;e.status='A lantern comes back to life.'}})
            if(now-e.patrolAt>900){
              const step=nextFloorStep(e.map,e.mist,e.player);
              if(step)e.mist={...e.mist,x:step.x,y:step.y};
              e.patrolAt=now;
              if(e.mist.x===e.player.x&&e.mist.y===e.player.y){
                e.player={x:1,y:1};e.status='The mist found you. Your lit lanterns remain — take a different path.';
              }
            }
            if(e.lanterns.every(l=>l.lit)&&e.player.x===10&&e.player.y===9){e.over=true;e.won=true;e.score+=500;e.status='The garden gate opens. You made it.'}
          }
        } else if(e.kind==='kingdoms'){
          // Resource decisions are handled by the action buttons below the canvas.
          e.elapsed=Math.min(e.elapsed,90);if(e.food<=0){e.over=true;e.status='The settlement ran out of food.'}if(e.homes>=3){e.over=true;e.won=true;e.score=1000+e.wood*5+e.stone*5+e.food*3;e.status='Your frontier is now a thriving village.'}
        } else if(e.kind==='space'){
          const sp=245*dt;if(held('ArrowLeft','KeyA'))e.ship.x-=sp;if(held('ArrowRight','KeyD'))e.ship.x+=sp;if(held('ArrowUp','KeyW'))e.ship.y-=sp;if(held('ArrowDown','KeyS'))e.ship.y+=sp;if(justSpace&&e.dash<=0)e.dash=.45;if(e.dash>0)e.dash=Math.max(0,e.dash-dt);e.ship.x=THREECLAMP(e.ship.x,25,935);e.ship.y=THREECLAMP(e.ship.y,75,500)
          if(Math.random()<dt*.7)e.rocks.push({x:Math.random()*960,y:-25,vx:(Math.random()-.5)*60,vy:90+Math.random()*100,r:12+Math.random()*16});e.rocks.forEach(r=>{r.x+=r.vx*dt;r.y+=r.vy*dt});e.rocks=e.rocks.filter(r=>r.y<570)
          e.cores.forEach(core=>{if(!core.got&&Math.hypot(core.x-e.ship.x,core.y-e.ship.y)<28){core.got=true;e.score+=100;e.status='Energy core recovered.'}})
          if(e.dash<=0&&now-(e.caughtAt||0)>1100&&e.rocks.some(r=>Math.hypot(r.x-e.ship.x,r.y-e.ship.y)<r.r+15)){
            e.caughtAt=now;e.ship.x=THREECLAMP(e.ship.x-35,25,935);e.ship.y=THREECLAMP(e.ship.y+25,75,500);
            e.status='Hull impact — brief stabilisation. Keep piloting.';e.score=Math.max(0,e.score-25)
          }
          if(e.cores.every(c=>c.got)){e.over=true;e.won=true;e.status='All salvage cores recovered.'}
        } else if(e.kind==='pixel'){
          if(now-e.dropAt>550){e.py++;e.dropAt=now}
          if(held('ArrowLeft','KeyA')&&now-(e.moveAt||0)>120){if(!collides(e.board,e.piece,e.px-1,e.py))e.px--;e.moveAt=now}if(held('ArrowRight','KeyD')&&now-(e.moveAt||0)>120){if(!collides(e.board,e.piece,e.px+1,e.py))e.px++;e.moveAt=now}if(held('ArrowDown','KeyS'))e.dropAt=0
          if(collides(e.board,e.piece,e.px,e.py)){e.py--;e.piece.forEach((row,y)=>row.forEach((v,x)=>{if(v&&e.board[e.py+y])e.board[e.py+y][e.px+x]=1}));const before=e.board.length;e.board=e.board.filter(row=>row.some(v=>!v));const cleared=before-e.board.length;while(e.board.length<18)e.board.unshift(Array(10).fill(0));e.lines+=cleared;e.score=e.lines*100;const pieces=[[[1,1,1],[0,1,0]],[[1,1],[1,1]],[[1,1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];e.piece=pieces[Math.floor(Math.random()*pieces.length)];e.px=3;e.py=0;if(collides(e.board,e.piece,e.px,e.py)){e.over=true;e.status='The stack reached the ceiling.'}}
          if(held('ArrowUp','KeyW')&&now-(e.moveAt||0)>180){const rotated=rotatePiece(e.piece);if(!collides(e.board,rotated,e.px,e.py))e.piece=rotated;e.moveAt=now}if(justSpace){while(!collides(e.board,e.piece,e.px,e.py+1))e.py++;e.dropAt=0}
          if(e.lines>=5){e.over=true;e.won=true;e.status='Five rows cleared. Excellent build.'}
        }
        if(e.elapsed>=60&&!e.over){e.over=true;e.won=e.kind==='racing'?e.distance>=1500:e.kind==='space'?e.cores.filter(c=>c.got).length>=8:false;e.status=e.won?'Shift complete — objective achieved.':'Time is up. Give it another run.'}
      }
      if(ctx)drawGame(ctx,e,c.width,c.height)
      if(now-lastHud>180){setHud({score:e.kind==='racing'?Math.floor(e.distance):e.score,time:Math.max(0,60-Math.floor(e.elapsed)),status:e.status,over:e.over,won:e.won});lastHud=now}
      raf=requestAnimationFrame(frame)
    }
    raf=requestAnimationFrame(frame)
    return()=>{cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp)}
  },[started,profile.kind])
  const kingdomAction=(kind:'wood'|'stone'|'food'|'home')=>{const e=engineRef.current;if(!started||e.over)return;if(kind==='wood'){e.wood+=4;e.food=Math.max(0,e.food-1);e.message='Your foresters bring back timber.'}if(kind==='stone'){e.stone+=3;e.food=Math.max(0,e.food-1);e.message='The quarry yields building stone.'}if(kind==='food'){e.food+=5;e.message='Fresh harvest stored for winter.'}if(kind==='home'){if(e.wood>=8&&e.stone>=5&&e.food>=2){e.wood-=8;e.stone-=5;e.food-=2;e.homes++;e.message='A new home is ready for settlers.'}else e.message='Need 8 wood, 5 stone and 2 food to build.'}e.score=e.homes*300+e.wood*5+e.stone*5+e.food*2;setHud(h=>({...h,score:e.score,status:e.message}))}
  const touchKey=(code:string,down:boolean)=>{if(down)engine.keys.add(code);else engine.keys.delete(code)}
  const canvasClick=(ev:MouseEvent<HTMLCanvasElement>)=>{if(profile.kind!=='kingdoms'||!started)return;const rect=ev.currentTarget.getBoundingClientRect();const x=(ev.clientX-rect.left)/rect.width*960;if(x<250)kingdomAction('wood');else if(x<475)kingdomAction('stone');else if(x<700)kingdomAction('food');else kingdomAction('home')}
  return <div className={`overlay top-overlay demo-overlay ${fullscreen ? 'demo-fullscreen' : ''}`} onMouseDown={event => { if (event.target === event.currentTarget && !fullscreen) onClose() }}><section ref={demoShellRef} className="demo-modal immersive-demo">
    <header className="demo-top"><div><span className="eyebrow">{game.title} · {profile.genre} · PLAYABLE PREVIEW</span><h2>{profile.title}</h2></div><div className="demo-header-actions"><button className="icon-btn fullscreen-toggle" onClick={toggleFullscreen} type="button" aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>{fullscreen ? <Minimize2/> : <Maximize2/>}</button><button className="icon-btn" onClick={async () => { if (document.fullscreenElement) { try { await document.exitFullscreen() } catch { /* ignore */ } } setFullscreen(false); onClose() }} type="button" aria-label="Close demo"><X/></button></div></header>
    <div className="demo-instructions"><div><b>MISSION</b><p>{profile.objective}</p></div><div><b>HOW TO PLAY</b><p>{profile.description}</p><small>{profile.controls}</small></div></div>
    <div className="immersive-stage"><canvas ref={canvasRef} onClick={canvasClick} aria-label={`${profile.title} game canvas`}/>
      {!started&&<div className="demo-start-cover"><span className="eyebrow">NEXORA ARCADE · DEMO BUILD</span><h3>Ready to enter?</h3><p>{profile.description}</p><button className="btn-primary" onClick={reset} type="button">START GAME <Play size={16}/></button></div>}
      {started&&hud.over&&<div className="demo-end-cover"><span className="eyebrow">{hud.won?'MISSION COMPLETE':'RUN ENDED'}</span><h3>{hud.won?'Well played.':'Try another run.'}</h3><p>{hud.status}</p><button className="btn-primary" onClick={reset} type="button">PLAY AGAIN</button></div>}
    </div>
    <div className="demo-hud-row"><span><b>SCORE</b> {hud.score.toLocaleString()}</span><span><b>TIME</b> {String(hud.time).padStart(2,'0')}s</span><span className="demo-live-status">{hud.status}</span></div>
    {profile.kind==='kingdoms'&&started&&!hud.over&&<div className="kingdom-actions"><button onClick={()=>kingdomAction('wood')} type="button">GATHER WOOD <small>+4 wood · −1 food</small></button><button onClick={()=>kingdomAction('stone')} type="button">QUARRY STONE <small>+3 stone · −1 food</small></button><button onClick={()=>kingdomAction('food')} type="button">HARVEST FOOD <small>+5 food</small></button><button onClick={()=>kingdomAction('home')} type="button">BUILD HOME <small>8 wood · 5 stone · 2 food</small></button></div>}
    {(profile.kind==='pixel'||profile.kind==='racing'||profile.kind==='space'||profile.kind==='stealth'||profile.kind==='night')&&started&&!hud.over&&<div className="demo-touch-pad"><button onPointerDown={()=>touchKey('ArrowLeft',true)} onPointerUp={()=>touchKey('ArrowLeft',false)} onPointerLeave={()=>touchKey('ArrowLeft',false)}>←</button><button onPointerDown={()=>touchKey('ArrowUp',true)} onPointerUp={()=>touchKey('ArrowUp',false)} onPointerLeave={()=>touchKey('ArrowUp',false)}>↑</button><button onPointerDown={()=>touchKey('ArrowDown',true)} onPointerUp={()=>touchKey('ArrowDown',false)} onPointerLeave={()=>touchKey('ArrowDown',false)}>↓</button><button onPointerDown={()=>touchKey('ArrowRight',true)} onPointerUp={()=>touchKey('ArrowRight',false)} onPointerLeave={()=>touchKey('ArrowRight',false)}>→</button>{(profile.kind==='racing'||profile.kind==='space'||profile.kind==='pixel')&&<button className="touch-action" onPointerDown={()=>touchKey('Space',true)} onPointerUp={()=>touchKey('Space',false)} onPointerLeave={()=>touchKey('Space',false)}>BOOST / DROP</button>}</div>}
    <footer className="demo-bottom"><span><Gamepad2 size={15}/> {profile.controls}</span><button className="text-btn" onClick={onClose} type="button">EXIT DEMO</button></footer>
  </section></div>
}
function THREECLAMP(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}
