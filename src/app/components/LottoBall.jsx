'use client'

import React, { useRef } from 'react'
import { RigidBody, BallCollider } from '@react-three/rapier'
import { Sphere, Html, Text } from '@react-three/drei'

function LottoBall({ position, number, color }) {
  const ballRef = useRef(null)

  return (
    <RigidBody
      ref={ballRef}
      colliders={false} // 콜라이더 직접 추가
      position={position}
      restitution={0.7} // 반발력
      friction={0.5} // 마찰력
      linearDamping={0.5} // 선형 감속
      angularDamping={0.5} // 각속도 감속
    >
      <BallCollider args={[0.5]} /> {/* 반지름 0.5 */}
      <Sphere args={[0.5, 32, 32]} castShadow>
        <meshStandardMaterial color={color} />
      </Sphere>
      {/* 숫자 텍스트 (위치/크기 조절 필요) */}
      <Html
        position={[0, 0, 0.5001]} // 공 표면과 거의 붙임 // 공 표면 바로 앞에 위치
        center
        occlude={true} // 다른 3D 객체에 가려지도록 설정
        occludeOptions={{
          radius: 0, // 가림 범위 (로또 공 크기보다 약간 크게 설정)
          depth: 1 // 깊이기 검사의 깊이
        }}
        distanceFactor={8} // 화면에서의 거리에 따른 크기 조절
        transform // 3D 로써 요소가 처리됨
      >
        <div
          className={'flex size-[60px] items-center justify-center rounded-full bg-[black]'}
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none' // 마우스 클릭이 배경을 통과하지 않도록
          }}
        >
          {number}
        </div>
      </Html>
    </RigidBody>
  )
}

// LottoMachine 컴포넌트 내부에 공 생성 로직 추가
export default function LottoBalls({ count }) {
  const balls = []
  const colors = ['gold', 'red', 'blue', 'green', 'purple', 'orange'] // 예시 색상
  for (let i = 1; i <= count; i++) {
    balls.push(
      <LottoBall
        key={i}
        position={[
          (Math.random() - 0.5) * 4, // 통 내부 범위 내 무작위 X
          Math.random() * 3 + 2, // 초기 Y 위치 (바닥 위)
          (Math.random() - 0.5) * 4 // 통 내부 범위 내 무작위 Z
        ]}
        number={i}
        color={colors[i % colors.length]}
      />
    )
  }
  return <>{balls}</>
}
