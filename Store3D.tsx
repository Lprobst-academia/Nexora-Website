import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, PointerLockControls } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject, PointerEvent as ReactPointerEvent } from 'react'
import * as THREE from 'three'
import type { Game } from '../data'

type Props = {
  games: Game[]
  storeName: string
  primary: string
  theme: string
  onSelect: (game: Game) => void
  interactive?: boolean
}
type MoveInput = { forward: number; strafe: number }
type LookInput = { x: number; y: number }

const basePositions: [number, number, number][] = [
  [-5, 0, -3], [0, 0, -5], [5, 0, -3],
  [-5, 0, 4], [0, 0, 5], [5, 0, 4],
]

function positionFor(index: number): [number, number, number] {
  if (index < basePositions.length) return basePositions[index] as [number, number, number]
  const angle = (index - basePositions.length) * 2.399
  return [Math.cos(angle) * 9, 0, Math.sin(angle) * 9]
}

function Floor({ primary }: { primary: string }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#f4f8f4" roughness={0.86} />
      </mesh>
      <gridHelper args={[32, 32, '#c8ddce', '#e1ebe3']} position={[0, -0.065, 0]} />
      {[-15, 15].map(x => (
        <mesh key={`wall-x-${x}`} position={[x, 3, 0]}>
          <boxGeometry args={[0.16, 6, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      ))}
      {[-15, 15].map(z => (
        <mesh key={`wall-z-${z}`} position={[0, 3, z]}>
          <boxGeometry args={[30, 6, 0.16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[30, 0.18, 30]} />
        <meshStandardMaterial color="#edf5ef" roughness={0.9} />
      </mesh>
      {[-12, -6, 0, 6, 12].map(x => (
        <mesh key={`ceiling-x-${x}`} position={[x, 5.86, 0]}>
          <boxGeometry args={[0.035, 0.025, 29]} />
          <meshBasicMaterial color={primary} />
        </mesh>
      ))}
      {[-12, -6, 0, 6, 12].map(z => (
        <mesh key={`ceiling-z-${z}`} position={[0, 5.86, z]}>
          <boxGeometry args={[29, 0.025, 0.035]} />
          <meshBasicMaterial color="#d5e8da" />
        </mesh>
      ))}
    </group>
  )
}

function Display({
  game,
  position,
  onSelect,
  primary,
}: {
  game: Game
  position: [number, number, number]
  onSelect: () => void
  primary: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <group
      position={position}
      onClick={onSelect}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[1.12, 1.22, 0.26, 8]} />
        <meshStandardMaterial color="#e7eee8" metalness={0.12} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.29, 0]}>
        <cylinderGeometry args={[1.08, 1.08, 0.035, 8]} />
        <meshBasicMaterial color={hover ? game.accent : primary} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[1.25, 1.55, 0.12]} />
        <meshStandardMaterial color="#ffffff" metalness={0.08} roughness={0.45} />
      </mesh>
      <Html position={[0, 1.25, 0.09]} transform distanceFactor={3.1} occlude>
        <button
          className="game-plaque"
          style={{ borderColor: game.accent }}
          onClick={onSelect}
          type="button"
        >
          <img src={game.cover} alt={`${game.title} cover`} loading="lazy" />
          <strong>{game.title}</strong>
          <span>{game.genre} · €{game.price.toFixed(2)}</span>
          <small>VIEW GAME</small>
        </button>
      </Html>
      <pointLight position={[0, 1.2, 0]} color={game.accent || primary} intensity={hover ? 1.25 : 0.45} distance={3.4} />
      <mesh position={[0, 0.34, 0]}>
        <torusGeometry args={[0.92, 0.025, 8, 8]} />
        <meshBasicMaterial color={game.accent || primary} />
      </mesh>
    </group>
  )
}

function Player({
  onNear,
  spots,
  moveInput,
  lookInput,
  touchMode,
}: {
  onNear: (game: Game | null) => void
  spots: { p: THREE.Vector3; g: Game }[]
  moveInput: MutableRefObject<MoveInput>
  lookInput: MutableRefObject<LookInput>
  touchMode: boolean
}) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new THREE.Vector3())
  const forward = useRef(new THREE.Vector3())
  const right = useRef(new THREE.Vector3())

  useEffect(() => {
    const down = (event: KeyboardEvent) => { keys.current[event.code] = true }
    const up = (event: KeyboardEvent) => { keys.current[event.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    camera.position.set(0, 1.7, 11)
    camera.rotation.order = 'YXZ'
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [camera])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    if (touchMode) {
      const look = lookInput.current
      camera.rotation.y -= look.x * 0.0025
      camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - look.y * 0.0025, -1.15, 1.15)
      look.x = 0
      look.y = 0
    }

    forward.current.set(0, 0, -1).applyQuaternion(camera.quaternion)
    forward.current.y = 0
    forward.current.normalize()
    right.current.set(1, 0, 0).applyQuaternion(camera.quaternion)
    right.current.y = 0
    right.current.normalize()
    velocity.current.set(0, 0, 0)

    const forwardKey = keys.current.KeyW || keys.current.ArrowUp ? 1 : 0
    const backKey = keys.current.KeyS || keys.current.ArrowDown ? 1 : 0
    const rightKey = keys.current.KeyD || keys.current.ArrowRight ? 1 : 0
    const leftKey = keys.current.KeyA || keys.current.ArrowLeft ? 1 : 0
    const mobile = moveInput.current

    if (forwardKey || mobile.forward > 0) velocity.current.add(forward.current.clone().multiplyScalar(Math.max(forwardKey, mobile.forward)))
    if (backKey || mobile.forward < 0) velocity.current.add(forward.current.clone().multiplyScalar(Math.min(-backKey, mobile.forward)))
    if (rightKey || mobile.strafe > 0) velocity.current.add(right.current.clone().multiplyScalar(Math.max(rightKey, mobile.strafe)))
    if (leftKey || mobile.strafe < 0) velocity.current.add(right.current.clone().multiplyScalar(Math.min(-leftKey, mobile.strafe)))

    if (velocity.current.lengthSq() > 0) {
      velocity.current.normalize().multiplyScalar(4.6 * dt)
      const next = camera.position.clone().add(velocity.current)
      const hitsDisplay = spots.some(spot => Math.hypot(next.x - spot.p.x, next.z - spot.p.z) < 1.25)
      if (Math.abs(next.x) < 13.8 && Math.abs(next.z) < 13.8 && !hitsDisplay) camera.position.copy(next)
    }

    camera.position.y = 1.7
    const nearest = spots
      .map(spot => ({ game: spot.g, distance: camera.position.distanceTo(spot.p) }))
      .filter(spot => spot.distance < 3.2)
      .sort((a, b) => a.distance - b.distance)[0]
    onNear(nearest?.game ?? null)
  })
  return null
}

function TouchControls({
  moveInput,
  lookInput,
}: {
  moveInput: MutableRefObject<MoveInput>
  lookInput: MutableRefObject<LookInput>
}) {
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
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      setMove(forward, strafe)
    },
    onPointerUp: () => setMove(0, 0),
    onPointerCancel: () => setMove(0, 0),
    onLostPointerCapture: () => setMove(0, 0),
  })

  return (
    <div className="touch-controls" aria-label="Touch showroom controls">
      <div
        className="touch-look-zone"
        onPointerDown={startLook}
        onPointerMove={moveLook}
        onPointerUp={endLook}
        onPointerCancel={endLook}
      >
        <span>DRAG TO LOOK</span>
      </div>
      <div className="touch-pad">
        <button type="button" aria-label="Move forward" {...hold(1, 0)}>▲</button>
        <div>
          <button type="button" aria-label="Move left" {...hold(0, -1)}>◀</button>
          <button type="button" aria-label="Move backward" {...hold(-1, 0)}>▼</button>
          <button type="button" aria-label="Move right" {...hold(0, 1)}>▶</button>
        </div>
      </div>
    </div>
  )
}

export default function Store3D({
  games,
  storeName,
  primary,
  theme,
  onSelect,
  interactive = true,
}: Props) {
  const spots = useMemo(
    () => games.map((game, index) => ({ p: new THREE.Vector3(...positionFor(index)), g: game })),
    [games],
  )
  const [near, setNear] = useState<Game | null>(null)
  const [touchMode, setTouchMode] = useState(false)
  const moveInput = useRef<MoveInput>({ forward: 0, strafe: 0 })
  const lookInput = useRef<LookInput>({ x: 0, y: 0 })

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const update = () => setTouchMode(query.matches || navigator.maxTouchPoints > 0)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const dark = theme === 'dark'
  return (
    <div className={`store-canvas ${touchMode ? 'touch-enabled' : ''}`}>
      <Canvas
        shadows={!touchMode}
        camera={{ position: [0, 1.7, 11], fov: touchMode ? 78 : 72 }}
        dpr={touchMode ? [1, 1.25] : [1, 1.6]}
        gl={{ antialias: !touchMode, alpha: false, powerPreference: 'high-performance' }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={[dark ? '#f5f9f5' : '#f1f7f2']} />
        <fog attach="fog" args={['#f5f9f5', 18, 30]} />
        <ambientLight intensity={1.35} />
        <directionalLight position={[5, 10, 4]} intensity={2.0} castShadow={!touchMode} shadow-mapSize={[512, 512]} />
        <pointLight position={[0, 4, 0]} color={primary} intensity={1.2} distance={18} />
        <Suspense fallback={null}>
          <Floor primary={primary} />
          <Html position={[0, 4.2, -12]} center>
            <div className="showroom-sign">
              <strong>{storeName || 'YOUR GAME STORE'}</strong>
              <span>DISCOVER YOUR NEXT WORLD</span>
            </div>
          </Html>
          {games.map((game, index) => (
            <Display
              key={game.id}
              game={game}
              position={positionFor(index)}
              primary={primary}
              onSelect={() => onSelect(game)}
            />
          ))}
          <Float speed={1.2} floatIntensity={0.12}>
            <mesh position={[0, 2.9, 0]}>
              <torusGeometry args={[1.5, 0.035, 12, 64]} />
              <meshBasicMaterial color={primary} />
            </mesh>
          </Float>
        </Suspense>
        {interactive && (
          <>
            <Player
              onNear={setNear}
              spots={spots}
              moveInput={moveInput}
              lookInput={lookInput}
              touchMode={touchMode}
            />
            {!touchMode && <PointerLockControls />}
          </>
        )}
      </Canvas>
      {interactive && (
        <>
          <div className="interaction-hud">
            {near ? (
              <div className="near-card">
                <span className="keycap">{touchMode ? 'TAP' : 'E'}</span>
                <span>VIEW <b>{near.title}</b></span>
                <button onClick={() => onSelect(near)} type="button">OPEN ↗</button>
              </div>
            ) : !touchMode ? <div className="aim-dot" /> : null}
          </div>
          {touchMode && <TouchControls moveInput={moveInput} lookInput={lookInput} />}
        </>
      )}
    </div>
  )
}
