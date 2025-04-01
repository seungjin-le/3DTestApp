'use client'

import React, { useEffect, useRef, useState } from 'react'
import { RigidBody, BallCollider } from '@react-three/rapier'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import html2canvas from 'html2canvas'

function LottoBall({ position, number }) {
  const [texture, setTexture] = useState(null)

  const loader = new THREE.TextureLoader()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const newDiv = document.createElement('div')

    newDiv.style.backgroundColor = 'black'
    newDiv.textContent = number
    newDiv.style.fontSize = '100px'
    newDiv.style.fontWeight = 'bold'
    newDiv.style.color = 'white'
    newDiv.style.display = 'flex'
    newDiv.style.alignItems = 'center'
    newDiv.style.justifyContent = 'center'
    newDiv.style.width = '300px'
    newDiv.style.height = '200px'

    document.body.appendChild(newDiv)

    html2canvas(newDiv).then((canvas) => {
      const textureFromCanvas = new THREE.CanvasTexture(canvas)
      setTexture(textureFromCanvas)
      setIsLoading(false)

      document.body.removeChild(newDiv)
    })

    return () => texture && texture.dispose()
  }, [])

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <RigidBody
          colliders={false}
          position={position}
          restitution={0.7}
          friction={0.5}
          linearDamping={0.5}
          angularDamping={0.5}
        >
          <BallCollider args={[0.5]} />
          <Sphere args={[0.5, 32, 32]} castShadow>
            <meshStandardMaterial color={'white'} map={texture} />
          </Sphere>
        </RigidBody>
      )}
    </>
  )
}

// LottoMachine 컴포넌트 내부에 공 생성 로직 추가
export default function LottoBalls({ count }) {
  const [balls, setBalls] = useState([])

  useEffect(() => {
    const newBalls = []
    for (let i = 1; i <= count; i++) {
      newBalls.push(
        <LottoBall
          key={i}
          position={[
            (Math.random() - 0.5) * 4, // 통 내부 범위 내 무작위 X
            Math.random() * 3 + 2, // 초기 Y 위치 (바닥 위)
            (Math.random() - 0.5) * 4 // 통 내부 범위 내 무작위 Z
          ]}
          number={i}
        />
      )
    }
    setBalls(() => newBalls)
  }, [count])
  return <>{balls}</>
}
