'use client'

import { Cylinder } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import React from 'react'

export default function LottoContainer() {
  const wallThickness = 0.4
  const height = 6
  const radius = 6

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[radius, wallThickness / 2, radius]} position={[0, -height / 2, 0]} />

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <CuboidCollider
            key={i}
            args={[wallThickness / 2, height / 2, (radius * Math.PI) / 8]} // 너비 근사
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
          />
        )
      })}

      <Cylinder args={[radius, radius, height, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="lightblue" transparent opacity={0.9} />
      </Cylinder>
    </RigidBody>
  )
}
