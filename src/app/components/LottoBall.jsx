'use client'

import React, { useEffect, useCallback, useState, useMemo, memo } from 'react'
import { RigidBody, BallCollider } from '@react-three/rapier'
import { Sphere } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

const LottoBall = memo(({ number, drawing = false, onClick }) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const context = canvas.getContext('2d')

    if (context) {
      context.fillStyle = 'black'
      context.beginPath()
      context.arc(100, 100, 100, 0, Math.PI * 2)
      context.fill()

      context.fillStyle = 'white'
      context.font = '40px Arial'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(number.toString(), 100, 100)
    }

    return new THREE.CanvasTexture(canvas)
  }, [number])

  const randomPos = useCallback(
    () => [(Math.random() - 0.5) * 5, Math.random() * 3 + 4, (Math.random() - 0.5) * 5],
    []
  )
  const animatedPosition = useMemo(() => (drawing ? [0, 5, 0] : randomPos()), [drawing, randomPos])

  const [spring, api] = useSpring(() => ({
    position: animatedPosition,
    config: { duration: 1000 }
  }))
  useEffect(() => {
    if (drawing) {
      api.start({
        to: {
          position: [0, 5, 0],
          opacity: 1
        },
        from: {
          position: [0, 0, 0],
          opacity: 0
        },
        config: { duration: 500 }
      })
    }
  }, [drawing])

  return (
    <animated.group position={spring.position}>
      <RigidBody
        onClick={() => drawing && onClick(number)}
        key={drawing ? `fixed-${number}` : `dynamic-${number}`}
        restitution={0.4}
        friction={0.5}
        linearDamping={0.5}
        angularDamping={0.5}
        type={drawing ? 'fixed' : 'dynamic'}
        rotation={[0, -1.5, 0]}
      >
        <BallCollider args={[0.5]} />
        <Sphere args={[0.5, 32, 32]} castShadow>
          <animated.meshStandardMaterial map={texture} />
        </Sphere>
      </RigidBody>
    </animated.group>
  )
})

// LottoMachine 컴포넌트 내부에 공 생성 로직 추가
export default function LottoBalls({ count, drawing }) {
  const [visibleCount, setVisibleCount] = useState(0)

  const actualCount = drawing ? count : Math.min(count, visibleCount)

  const balls = useMemo(() => {
    return Array.from({ length: count }, (_, i) => i + 1)
  }, [count])

  useEffect(() => {
    if (count > 0 && !drawing) {
      setVisibleCount(0)

      const timer = setInterval(() => {
        setVisibleCount((prev) => {
          const next = prev + 1
          if (next >= count) clearInterval(timer)
          return next
        })
      }, 200)

      return () => clearInterval(timer)
    }
  }, [count, drawing])

  return (
    <>
      {balls.slice(0, actualCount).map((ball) => (
        <LottoBall
          key={ball}
          number={ball}
          drawing={ball === drawing}
          onClick={(id) => console.log(`Clicked ball: ${id}`)}
        />
      ))}
    </>
  )
}
