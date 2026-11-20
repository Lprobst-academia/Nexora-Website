import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Text, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject, PointerEvent as ReactPointerEvent } from 'react'
import * as THREE from 'three'
import type { Game } from './data'
import defaultLogo from './nexora-logo.png'

type Props = {
  games: Game[]
  storeName: string
  primary: string
  theme: string
  onSelect: (game: Game) => void
  interactive?: boolean
  logo?: string
}
type MoveInput = { forward: number; strafe: number }
type LookInput = { x: number; y: number }
type Spot = { p: THREE.Vector3; g: Game }

function positionFor(index: number, count: number): [number, number, number] {
  const angle = (Math.PI * 2 * index) / Math.max(count, 1)
  const radius = count > 8 ? 8.5 : 7.2
  return [Math.sin(angle) * radius, 0, Math.cos(angle) * radius]
}

function Floor({ primary }: { primary: string }) {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
      <planeGeometry args={[34, 34]} />
      <meshStandardMaterial color="#f4f8f4" roughness={0.92} />
    </mesh>
    <gridHelper args={[34, 34, '#b9d8c1', '#e2ece4']} position={[0, -0.065, 0]} />
    {[-16, 16].map(x => <mesh key={`wx${x}`} position={[x, 3, 0]}><boxGeometry args={[.16, 6, 34]}/><meshStandardMaterial color="#fff"/></mesh>)}
    {[-16, 16].map(z => <mesh key={`wz${z}`} position={[0, 3, z]}><boxGeometry args={[34, 6, .16]}/><meshStandardMaterial color="#fff"/></mesh>)}
    <mesh position={[0, 6, 0]}><boxGeometry args={[32, .16, 32]}/><meshStandardMaterial color="#edf4ee"/></mesh>
    {[-12, -6, 0, 6, 12].map(x => <mesh key={`lx${x}`} position={[x, 5.91, 0]}><boxGeometry args={[.025, .02, 31]}/><meshBasicMaterial color={primary}/></mesh>)}
    {[-12, -6, 0, 6, 12].map(z => <mesh key={`lz${z}`} position={[0, 5.91, z]}><boxGeometry args={[31, .02, .025]}/><meshBasicMaterial color="#dce9de"/></mesh>)}
  </group>
}

function GameDisplay({ game, position, primary, onSelect }: { game: Game; position: [number, number, number]; primary: string; onSelect: () => void }) {
  const cover = useTexture(game.cover)
  const angle = Math.atan2(-position[0], -position[2])
  const group = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  return <group ref={group} position={position} rotation={[0, angle, 0]} onClick={onSelect} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
    <mesh position={[0, .14, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.12, 1.2, .28, 32]} />
      <meshStandardMaterial color="#e9eee9" roughness={.62} />
    </mesh>
    <mesh position={[0, .30, 0]}>
      <cylinderGeometry args={[1.07, 1.07, .035, 32]} />
      <meshStandardMaterial color={game.accent || primary} roughness={.45} />
    </mesh>
    <mesh position={[0, .92, -.08]} castShadow>
      <boxGeometry args={[1.42, 1.55, .13]} />
      <meshStandardMaterial color="#ffffff" roughness={.4} />
    </mesh>
    <mesh position={[0, 1.30, .002]}>
      <planeGeometry args={[1.25, .70]} />
      <meshBasicMaterial map={cover} toneMapped={false} />
    </mesh>
    <Text position={[0, .82, .012]} fontSize={.125} maxWidth={1.25} color="#183323" anchorX="center" anchorY="middle" textAlign="center" fontWeight="bold">
      {game.title.toUpperCase()}
    </Text>
    <Text position={[0, .62, .012]} fontSize={.085} color="#607267" anchorX="center" anchorY="middle">
      {`${game.genre}  ·  €${game.price.toFixed(2)}`}
    </Text>
    <mesh position={[0, .43, .014]}>
      <planeGeometry args={[.82, .20]} />
      <meshBasicMaterial color={hover ? '#17683e' : primary} />
    </mesh>
    <Text position={[0, .43, .022]} fontSize={.082} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
      VIEW GAME
    </Text>
    <mesh position={[-.72, .90, -.1]} rotation={[0, 0, -.13]}><boxGeometry args={[.07, 1.25, .07]}/><meshStandardMaterial color={game.accent}/></mesh>
    <mesh position={[.72, .90, -.1]} rotation={[0, 0, .13]}><boxGeometry args={[.07, 1.25, .07]}/><meshStandardMaterial color={game.accent}/></mesh>
    <pointLight position={[0, 1.5, .4]} color={game.accent || primary} intensity={hover ? .8 : .25} distance={2.8} />
  </group>
}

function Centrepiece({ logo, primary }: { logo: string; primary: string }) {
  const texture = useTexture(logo)
  return <group position={[0, 3.25, -1.1]}>
    <mesh rotation={[0, 0, 0]}>
      <torusGeometry args={[2.05, .045, 12, 96]} />
      <meshBasicMaterial color={primary} />
    </mesh>
    <mesh position={[0, 0, .02]}>
      <planeGeometry args={[3.35, 1.16]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  </group>
}

function Player({ onNear, onSelect, spots, moveInput, lookInput, touchMode }: {
  onNear: (game: Game | null) => void
  onSelect: (game: Game) => void
  spots: Spot[]
  moveInput: MutableRefObject<MoveInput>
  lookInput: MutableRefObject<LookInput>
  touchMode: boolean
}) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const forward = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())
  const nearRef = useRef<Game | null>(null)

  useEffect(() => {
    camera.position.set(0, 1.7, 0.7)
    camera.rotation.set(0, 0, 0)
    camera.rotation.order = 'YXZ'
    const down = (event: KeyboardEvent) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) keys.current[event.code] = true
      if (event.code === 'KeyE' && nearRef.current) {
        event.preventDefault()
        onSelect(nearRef.current)
      }
    }
    const up = (event: KeyboardEvent) => { keys.current[event.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [camera, onSelect])

  useFrame((_, delta) => {
    const dt = Math.min(delta, .035)
    if (touchMode) {
      camera.rotation.y -= lookInput.current.x * .0021
      camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - lookInput.current.y * .0021, -1.05, 1.05)
      lookInput.current.x = 0
      lookInput.current.y = 0
    }
    forward.current.set(0, 0, -1).applyQuaternion(camera.quaternion); forward.current.y = 0; forward.current.normalize()
    right.current.set(1, 0, 0).applyQuaternion(camera.quaternion); right.current.y = 0; right.current.normalize()
    const f = (keys.current.KeyW || keys.current.ArrowUp ? 1 : 0) - (keys.current.KeyS || keys.current.ArrowDown ? 1 : 0) + moveInput.current.forward
    const s = (keys.current.KeyD || keys.current.ArrowRight ? 1 : 0) - (keys.current.KeyA || keys.current.ArrowLeft ? 1 : 0) + moveInput.current.strafe
    desired.current.set(0, 0, 0)
    if (f || s) desired.current.addScaledVector(forward.current, f).addScaledVector(right.current, s)
    if (desired.current.lengthSq() > 1) desired.current.normalize()
    desired.current.multiplyScalar(4.0)
    velocity.current.lerp(desired.current, 1 - Math.exp(-(desired.current.lengthSq() ? 10 : 13) * dt))
    const next = camera.position.clone().addScaledVector(velocity.current, dt)
    const blocked = (x: number, z: number) => spots.some(spot => Math.hypot(x - spot.p.x, z - spot.p.z) < 1.55)
    let moved = false
    // Resolve each axis separately so the player can glide along a display instead of vibrating against it.
    if (Math.abs(next.x) < 14.8 && !blocked(next.x, camera.position.z)) { camera.position.x = next.x; moved = true }
    if (Math.abs(next.z) < 14.8 && !blocked(camera.position.x, next.z)) { camera.position.z = next.z; moved = true }
    if (!moved && desired.current.lengthSq() > 0) velocity.current.multiplyScalar(.25)
    camera.position.y = 1.7
    const nearest = spots.map(spot => ({ game: spot.g, distance: Math.hypot(camera.position.x - spot.p.x, camera.position.z - spot.p.z) }))
      .filter(item => item.distance < 3.35).sort((a, b) => a.distance - b.distance)[0]?.game ?? null
    if (nearest?.id !== nearRef.current?.id) { nearRef.current = nearest; onNear(nearest) }
  })
  return null
}

function TouchControls({ moveInput, lookInput }: { moveInput: MutableRefObject<MoveInput>; lookInput: MutableRefObject<LookInput> }) {
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const setMove = (forward: number, strafe: number) => { moveInput.current = { forward, strafe } }
  const startLook = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    lastPoint.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveLook = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!lastPoint.current || event.pointerType === 'mouse') return
    lookInput.current.x += event.clientX - lastPoint.current.x
    lookInput.current.y += event.clientY - lastPoint.current.y
    lastPoint.current = { x: event.clientX, y: event.clientY }
  }
  const endLook = () => { lastPoint.current = null }
  const hold = (forward: number, strafe: number) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); setMove(forward, strafe) },
    onPointerUp: () => setMove(0, 0), onPointerCancel: () => setMove(0, 0), onLostPointerCapture: () => setMove(0, 0),
  })
  return <div className="touch-controls" aria-label="Touch showroom controls">
    <div className="touch-look-zone" onPointerDown={startLook} onPointerMove={moveLook} onPointerUp={endLook} onPointerCancel={endLook}><span>DRAG TO LOOK</span></div>
    <div className="touch-pad"><button type="button" aria-label="Move forward" {...hold(1, 0)}>▲</button><div><button type="button" aria-label="Move left" {...hold(0, -1)}>◀</button><button type="button" aria-label="Move backward" {...hold(-1, 0)}>▼</button><button type="button" aria-label="Move right" {...hold(0, 1)}>▶</button></div></div>
  </div>
}

export default function Store3D({ games, storeName, primary, theme, onSelect, interactive = true, logo = defaultLogo }: Props) {
  const spots = useMemo(() => games.map((game, index) => ({ p: new THREE.Vector3(...positionFor(index, games.length)), g: game })), [games])
  const [near, setNear] = useState<Game | null>(null)
  const [touchMode, setTouchMode] = useState(false)
  const moveInput = useRef<MoveInput>({ forward: 0, strafe: 0 })
  const lookInput = useRef<LookInput>({ x: 0, y: 0 })
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const update = () => setTouchMode(query.matches || navigator.maxTouchPoints > 0)
    update(); query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  const dark = theme === 'dark'
  return <div className={`store-canvas ${touchMode ? 'touch-enabled' : ''}`}>
    <Canvas shadows={!touchMode} camera={{ position: [0, 1.7, .7], fov: touchMode ? 76 : 70 }} dpr={touchMode ? [1, 1.25] : [1, 1.5]} gl={{ antialias: !touchMode, alpha: false, powerPreference: 'high-performance' }} style={{ touchAction: 'none' }}>
      <color attach="background" args={[dark ? '#eaf1eb' : '#f1f7f2']} />
      <fog attach="fog" args={['#f1f7f2', 22, 36]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 10, 4]} intensity={1.7} castShadow={!touchMode} shadow-mapSize={[512, 512]} />
      <pointLight position={[0, 4, 0]} color={primary} intensity={.8} distance={18} />
      <Suspense fallback={null}>
        <Floor primary={primary} />
        <Centrepiece logo={logo} primary={primary} />
        <group position={[0, 0, -13]}>
          <Text position={[0, 4.3, 0]} fontSize={.42} color="#1b3b28" anchorX="center" anchorY="middle" fontWeight="bold">{storeName || 'YOUR GAME STORE'}</Text>
          <Text position={[0, 3.85, 0]} fontSize={.14} color="#668071" anchorX="center" anchorY="middle" letterSpacing={.12}>DISCOVER YOUR NEXT WORLD</Text>
        </group>
        {games.map((game, index) => <GameDisplay key={game.id} game={game} position={positionFor(index, games.length)} primary={primary} onSelect={() => onSelect(game)} />)}
      </Suspense>
      {interactive && <>
        <Player onNear={setNear} onSelect={onSelect} spots={spots} moveInput={moveInput} lookInput={lookInput} touchMode={touchMode} />
        {!touchMode && <PointerLockControls />}
      </>}
    </Canvas>
    {interactive && <>
      <div className="interaction-hud">{near ? <div className="near-card"><span className="keycap">{touchMode ? 'TAP' : 'E'}</span><span>{touchMode ? 'TAP TO OPEN' : 'PRESS E TO OPEN'} <b>{near.title}</b></span><button onClick={() => onSelect(near)} type="button">OPEN ↗</button></div> : !touchMode ? <div className="aim-dot" /> : null}</div>
      {touchMode && <TouchControls moveInput={moveInput} lookInput={lookInput} />}
    </>}
  </div>
}
