'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
  MarchingCubes,
  MarchingCube,
} from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'
import { Color, MathUtils } from 'three'

type Source = {
  base: [number, number, number]
  color: Color
  phase: number
}

const COLS = 9
const ROWS = 6
const FIELD_W = 1.8
const FIELD_H = 1.1

function hash(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return h - Math.floor(h)
}

function CubeField() {
  const refs = useRef<(Group | null)[]>([])

  const sources = useMemo<Source[]>(() => {
    const palette = ['#1e4fff', '#3a6dff', '#5b85ff', '#7aa0ff', '#9bb8ff'].map(
      (c) => new Color(c),
    )
    const list: Source[] = []
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (hash(x, y) < 0.4) continue
        const px = -FIELD_W / 2 + ((x + 0.5) / COLS) * FIELD_W
        const py = -FIELD_H / 2 + ((y + 0.5) / ROWS) * FIELD_H
        list.push({
          base: [px, py, 0],
          color: palette[(x + y * 2) % palette.length],
          phase: hash(x + 7, y + 13) * Math.PI * 2,
        })
      }
    }
    return list
  }, [])

  useFrame((state) => {
    const { pointer, clock } = state
    const t = clock.getElapsedTime()
    const px = pointer.x * (FIELD_W / 2)
    const py = pointer.y * (FIELD_H / 2)

    sources.forEach((s, i) => {
      const ref = refs.current[i]
      if (!ref) return

      const dx = px - s.base[0]
      const dy = py - s.base[1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist / 0.7)

      const wobbleX = Math.sin(t * 0.5 + s.phase) * 0.015
      const wobbleY = Math.cos(t * 0.4 + s.phase) * 0.015

      const targetX = s.base[0] + dx * influence * 0.35 + wobbleX
      const targetY = s.base[1] + dy * influence * 0.35 + wobbleY
      const targetZ = s.base[2] + influence * 0.25

      ref.position.x = MathUtils.lerp(ref.position.x, targetX, 0.1)
      ref.position.y = MathUtils.lerp(ref.position.y, targetY, 0.1)
      ref.position.z = MathUtils.lerp(ref.position.z, targetZ, 0.1)
      ref.updateMatrixWorld()
    })
  }, -0.5)

  return (
    <MarchingCubes resolution={64} maxPolyCount={20000} enableUvs={false} enableColors>
      {sources.map((s, i) => (
        <MarchingCube
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          strength={0.35}
          subtract={10}
          color={s.color}
          position={s.base}
        />
      ))}
      <meshStandardMaterial vertexColors roughness={0.45} metalness={0.2} />
    </MarchingCubes>
  )
}

function FrozenScreen() {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.position.x = state.pointer.x * 0.02
    ref.current.position.y = state.pointer.y * 0.02 + Math.sin(t * 0.4) * 0.005
  })

  return (
    <mesh ref={ref} position={[0, 0, 0.55]}>
      <planeGeometry args={[3.2, 2, 32, 32]} />
      <MeshTransmissionMaterial
        transmission={1}
        thickness={0.3}
        roughness={0.3}
        ior={1.2}
        chromaticAberration={0.01}
        anisotropy={0.1}
        distortion={0.1}
        distortionScale={0.15}
        temporalDistortion={0.04}
        attenuationDistance={4}
        attenuationColor="#ffffff"
        color="#ffffff"
        backside
      />
    </mesh>
  )
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#ffffff']} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-5, -3, 2]} intensity={0.6} color="#dbe6ff" />

      <CubeField />
      <FrozenScreen />

      <OrbitControls enablePan={false} enableZoom={false} />
      <Environment preset="studio" />
    </Canvas>
  )
}
