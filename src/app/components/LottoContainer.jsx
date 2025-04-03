'use client'

import { Cylinder } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

import React, { useMemo } from 'react'

export default function LottoContainer() {
  const wallThickness = 0.4
  const height = 6
  const radius = 6

  const colliders = useMemo(() => {
    const arr = new Array(8).fill((i) => i + 1)
    const cos = (i) => Math.cos((i / 8) * Math.PI * 2) * radius
    const sin = (i) => Math.sin((i / 8) * Math.PI * 2) * radius
    return arr.map((_, i) => (
      <CuboidCollider
        key={i}
        args={[wallThickness / 2, height / 2, (radius * Math.PI) / 8]} // 너비 근사
        position={[cos(i), 0, sin(i)]}
        rotation={[0, -(i / 8) * Math.PI * 2, 0]}
      />
    ))
  }, [])

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[radius, wallThickness / 2, radius]} position={[0, -height / 2, 0]} />

      {colliders}

      <Cylinder args={[radius, radius, height, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="lightblue" transparent opacity={0.9} />
      </Cylinder>
    </RigidBody>
  )
}
