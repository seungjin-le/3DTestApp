import React from 'react'
import { render } from '@testing-library/react'
import BallMixer from '../BallMixer'

// @react-three/fiber 및 @react-three/rapier 모킹
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn((callback) => callback({}, 0.1))
}))

jest.mock('@react-three/rapier', () => ({
  useRapier: jest.fn(() => ({
    world: {
      bodies: [
        {
          isDynamic: jest.fn(() => true),
          applyImpulse: jest.fn()
        }
      ]
    }
  }))
}))

describe('BallMixer 컴포넌트', () => {
  it('렌더링시 에러가 발생하지 않아야 함', () => {
    // BallMixer는 null을 반환하므로 렌더링만 확인
    expect(() => render(<BallMixer />)).not.toThrow()
  })

  it('useFrame을 통해 공에 힘을 가하는 함수가 호출되어야 함', () => {
    // useFrame 모킹이 정상적으로 동작하는지 확인
    const { useFrame } = require('@react-three/fiber')
    const { useRapier } = require('@react-three/rapier')

    render(<BallMixer />)

    // useFrame이 호출되었는지 확인
    expect(useFrame).toHaveBeenCalled()

    // 모킹된 world.bodies[0].applyImpulse가 호출되었는지 확인
    const mockedWorld = useRapier().world
    expect(mockedWorld.bodies[0].applyImpulse).toHaveBeenCalled()
  })
})
