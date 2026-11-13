import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Html, PointerLockControls, Stars, Text } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Game } from '../data'

type Props = { games:Game[]; storeName:string; primary:string; theme:string; onSelect:(g:Game)=>void; interactive?:boolean }
const positions:[[number,number,number], ...[number,number,number][]] = [[-5,0,-3],[0,0,-5],[5,0,-3],[-5,0,4],[0,0,5],[5,0,4]]

function Floor({primary}:{primary:string}) {
  return <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]} receiveShadow><planeGeometry args={[32,32]}/><meshStandardMaterial color="#101722" metalness={.55} roughness={.45}/></mesh>
    <gridHelper args={[32,32,'#26364a','#1a2635']} position={[0,-.065,0]}/>
    {[-15,15].map(x=><mesh key={x} position={[x,3,0]}><boxGeometry args={[.16,6,32]}/><meshStandardMaterial color="#263346" metalness={.4}/></mesh>)}
    {[-15,15].map(z=><mesh key={z} position={[0,3,z]}><boxGeometry args={[30,6,.16]}/><meshStandardMaterial color="#263346"/></mesh>)}
    <mesh position={[0,6,0]}><boxGeometry args={[30,.18,30]}/><meshStandardMaterial color="#141d2a" metalness={.35}/></mesh>
    {[-12,-6,0,6,12].map(x=><mesh key={x} position={[x,5.86,0]}><boxGeometry args={[.035,.025,29]}/><meshBasicMaterial color={primary}/></mesh>)}
    {[-12,-6,0,6,12].map(z=><mesh key={z} position={[0,5.86,z]}><boxGeometry args={[29,.025,.035]}/><meshBasicMaterial color="#3e82a7"/></mesh>)}
  </group>
}
function Display({game,position,onSelect,primary}:{game:Game;position:[number,number,number];onSelect:()=>void;primary:string}) {
  const ref=useRef<THREE.Group>(null)
  const [hover,setHover]=useState(false)
  return <group ref={ref} position={position} onClick={onSelect} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)}>
    <mesh position={[0,.13,0]} castShadow><cylinderGeometry args={[1.12,1.22,.26,6]}/><meshStandardMaterial color="#1b2737" metalness={.8} roughness={.22}/></mesh>
    <mesh position={[0,.29,0]}><cylinderGeometry args={[1.08,1.08,.035,6]}/><meshBasicMaterial color={hover?game.accent:primary}/></mesh>
    <mesh position={[0,1.25,0]} castShadow><boxGeometry args={[1.25,1.55,.12]}/><meshStandardMaterial color="#27374b" metalness={.6} roughness={.25}/></mesh>
    <mesh position={[0,1.25,.075]}><planeGeometry args={[1.13,1.42]}/><meshBasicMaterial map={undefined} color={game.accent}/></mesh>
    <Html position={[0,1.25,.16]} transform distanceFactor={3.1} occlude>
      <div className="game-plaque" style={{borderColor:game.accent}}>
        <img src={game.cover} />
        <strong>{game.title}</strong><span>{game.genre} · €{game.price.toFixed(2)}</span>
      </div>
    </Html>
    <Text position={[0,2.2,0]} fontSize={.2} color="#e9f2ff" anchorX="center" outlineWidth={.012} outlineColor="#101722">{game.title}</Text>
    <pointLight position={[0,1.2,0]} color={game.accent} intensity={hover?2.2:1.05} distance={3.4}/>
    <mesh position={[0,.34,0]}><torusGeometry args={[.92,.025,8,6]}/><meshBasicMaterial color={game.accent}/></mesh>
  </group>
}
function Player({onNear, positions:spots}:{onNear:(g:Game|null)=>void;positions:{p:THREE.Vector3;g:Game}[]}) {
  const {camera}=useThree()
  const keys=useRef<Record<string,boolean>>({})
  const velocity=useRef(new THREE.Vector3())
  const forward=useRef(new THREE.Vector3())
  const right=useRef(new THREE.Vector3())
  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{keys.current[e.code]=true}
    const up=(e:KeyboardEvent)=>{keys.current[e.code]=false}
    window.addEventListener('keydown',down);window.addEventListener('keyup',up)
    camera.position.set(0,1.7,11)
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}
  },[camera])
  useFrame((_,dt)=>{
    const speed=5.4
    forward.current.set(0,0,-1).applyQuaternion(camera.quaternion);forward.current.y=0;forward.current.normalize()
    right.current.set(1,0,0).applyQuaternion(camera.quaternion);right.current.y=0;right.current.normalize()
    velocity.current.set(0,0,0)
    if(keys.current.KeyW||keys.current.ArrowUp) velocity.current.add(forward.current)
    if(keys.current.KeyS||keys.current.ArrowDown) velocity.current.sub(forward.current)
    if(keys.current.KeyD||keys.current.ArrowRight) velocity.current.add(right.current)
    if(keys.current.KeyA||keys.current.ArrowLeft) velocity.current.sub(right.current)
    if(velocity.current.lengthSq()) {
      velocity.current.normalize().multiplyScalar(speed*dt)
      const next=camera.position.clone().add(velocity.current)
      const hitsDisplay = spots.some(s => Math.hypot(next.x-s.p.x, next.z-s.p.z) < 1.25)
      if(Math.abs(next.x)<13.8 && Math.abs(next.z)<13.8 && !hitsDisplay) camera.position.copy(next)
    }
    camera.position.y=1.7
    const nearest = spots
      .map(s => ({g:s.g, d:camera.position.distanceTo(s.p)}))
      .filter(s => s.d < 2.7)
      .sort((a,b) => a.d-b.d)[0]
    onNear(nearest?.g ?? null)
  })
  return null
}
export default function Store3D({games,storeName,primary,theme,onSelect,interactive=true}:Props) {
  const spots=useMemo(()=>games.map((g,i)=>({p:new THREE.Vector3(...positions[i%positions.length]),g})),[games])
  const [near,setNear]=useState<Game|null>(null)
  const dark=theme!=='colorful'
  return <div className="store-canvas">
    <Canvas shadows camera={{position:[0,1.7,11],fov:72}} dpr={[1,1.7]} gl={{antialias:true,alpha:false}}>
      <color attach="background" args={[dark?'#080d16':'#17212b']}/>
      <fog attach="fog" args={[dark?'#080d16':'#17212b',18, thirty()]}/>
      <ambientLight intensity={.8}/>
      <directionalLight position={[5,10,4]} intensity={1.8} castShadow shadow-mapSize={[1024,1024]}/>
      <pointLight position={[0,4,0]} color={primary} intensity={2.5} distance={18}/>
      <Suspense fallback={null}>
        <Floor primary={primary}/>
        <Text position={[0,4.2,-12]} fontSize={1.05} color="#edf4ff" anchorX="center" outlineWidth={.015} outlineColor="#0a0f18">{storeName.toUpperCase()}</Text>
        <Text position={[0,3.25,-11.96]} fontSize={.22} color={primary} anchorX="center" letterSpacing={.16}>DISCOVER YOUR NEXT WORLD</Text>
        {games.map((g,i)=><Display key={g.id} game={g} position={positions[i%positions.length]} primary={primary} onSelect={()=>onSelect(g)}/>)}
        <Float speed={1.2} floatIntensity={.2}><mesh position={[0,2.9,0]}><torusGeometry args={[1.5,.035,12,80]}/><meshBasicMaterial color={primary}/></mesh></Float>
        <Stars radius={80} depth={40} count={dark?600:150} factor={3} fade speed={.4}/>
        <Environment preset="city"/>
      </Suspense>
      {interactive&&<><Player onNear={setNear} positions={spots}/><PointerLockControls/></>}
    </Canvas>
    {interactive&&<div className="interaction-hud">
      {near?<div className="near-card"><span className="keycap">E</span><span>INTERACT WITH <b>{near.title}</b></span><button onClick={()=>onSelect(near)}>OPEN <span>↗</span></button></div>:<div className="aim-dot"/>}
    </div>}
  </div>
}
function thirty(){return 30}
