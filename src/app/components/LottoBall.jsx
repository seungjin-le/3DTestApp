'use client'

import React, { useEffect, useCallback, useState, useMemo, memo } from 'react'
import { RigidBody, BallCollider } from '@react-three/rapier'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import html2canvas from 'html2canvas'
import { useSpring, animated } from '@react-spring/three'

const LottoBall = memo(({ position, number, drawing = false, onClick }) => {
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

  // 공이 정면을 바라보도록 방향 설정
  const ballRotation = useMemo(() => (drawing ? [0, -1.5, 0] : [0, -1.5, 0]), [drawing])

  // 공이 3초 동안 천천히 이동하는 애니메이션 설정
  const test = useSpring(
    {
      position: drawing
        ? [0, 5, 0]
        : [(Math.random() - 0.5) * 4, Math.random() * 3 + 2, (Math.random() - 0.5) * 4],
      color: drawing ? '#ffd700' : '#ffffff', // 금색과 흰색
      config: {
        mass: 5, // 무거운 질량 (느린 시작)
        tension: 170, // 스프링 텐션
        friction: 50, // 마찰 (늦게 도착)
        duration: 3000 // 3초 동안 애니메이션
      }
    },
    [drawing]
  )

  const animatedPosition = useMemo(
    () =>
      drawing
        ? [0, 5, 0]
        : [(Math.random() - 0.5) * 5, Math.random() * 3 + 4, (Math.random() - 0.5) * 5],
    [drawing]
  )
  console.log(test?.[0]?.color)
  return (
    <animated.group position={animatedPosition}>
      <RigidBody
        onClick={() => drawing && onClick(number)}
        key={drawing ? `fixed-${number}` : `dynamic-${number}`}
        restitution={0.4}
        friction={0.5}
        linearDamping={0.5}
        angularDamping={0.5}
        type={drawing ? 'fixed' : 'dynamic'}
        rotation={ballRotation}
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
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      position: [(Math.random() - 0.5) * 4, Math.random() * 3 + 2, (Math.random() - 0.5) * 4]
    }))
  }, [count])

  useEffect(() => {
    if (count > 0 && !drawing) {
      setVisibleCount(0)

      const timer = setInterval(() => {
        setVisibleCount((prev) => {
          const next = prev + 1
          if (next >= count) {
            clearInterval(timer)
          }
          return next
        })
      }, 300)

      return () => clearInterval(timer)
    }
  }, [count, drawing])

  return (
    <>
      {balls.slice(0, actualCount).map((ball) => (
        <LottoBall
          key={ball.id}
          position={ball.position}
          number={ball.id}
          drawing={ball.id === drawing}
          onClick={(id) => console.log(`Clicked ball: ${id}`)}
        />
      ))}
    </>
  )
}
