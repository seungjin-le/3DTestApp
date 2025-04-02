'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import React from 'react'
import LottoContainer from '@/app/components/LottoContainer'
import LottoBalls from '@/app/components/LottoBall'

export default function LottoMachine({ drawing, count = 0 }) {
  return (
    <Canvas
      style={{ height: '100vh', background: '#ddd' }}
      camera={{ position: [0, 5, 15], fov: 80 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <Physics gravity={[0, -9.81, 0]}>
        <LottoContainer />
        <LottoBalls count={count} drawing={drawing} />
      </Physics>
      <OrbitControls />
    </Canvas>
  )
}
