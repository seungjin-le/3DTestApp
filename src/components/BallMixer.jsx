'use client'

import { useFrame } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';

export default function BallMixer() {
  const { world } = useRapier();

  useFrame((state, delta) => {
    // 예시: 모든 다이나믹 바디(공)에 작은 랜덤 힘 가하기
    world.bodies.forEach(body => {
      if (body.isDynamic()) {
        const impulse = {
          x: (Math.random() - 0.5) * 0.1,
          y: Math.random() * 0.1, // 약간 위쪽으로
          z: (Math.random() - 0.5) * 0.1,
        };
        body.applyImpulse(impulse, true);
      }
    });
  });

  return null; // 시각적 요소 없음
}

// Canvas 내 Physics 컴포넌트 안에 <BallMixer /> 추가