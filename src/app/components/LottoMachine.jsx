'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import React from 'react'
import LottoContainer from '@/app/components/LottoContainer'
import LottoBalls from '@/app/components/LottoBall'
// import { BallMixer } from './BallMixer';

// import { Physics } from '@react-three/cannon'; // Cannon.js 사용 시

export default function LottoMachine() {
  return (
    <Canvas
      style={{ height: '100vh', background: '#f0f0f0' }}
      camera={{ position: [0, 5, 15], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <OrbitControls />

      {/* 물리 엔진 설정 */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* 여기에 로또 통과 공들을 추가합니다. */}
        <LottoContainer />
        <LottoBalls count={45} />
      </Physics>
    </Canvas>
  )
}
