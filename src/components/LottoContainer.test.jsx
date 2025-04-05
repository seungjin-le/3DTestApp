import React from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, jest } from '@jest/globals'

// Three.js 관련 라이브러리 모킹
jest.mock('@react-three/drei', () => ({
  Cylinder: jest.fn(({ children }) => <div data-testid="cylinder">{children}</div>)
}))

jest.mock('@react-three/rapier', () => ({
  CuboidCollider: jest.fn(({ children }) => <div data-testid="cuboid-collider">{children}</div>),
  RigidBody: jest.fn(({ children }) => <div data-testid="rigid-body">{children}</div>)
}))

describe('LottoContainer 컴포넌트', () => {
  it('렌더링시 에러가 발생하지 않아야 함', () => {
    expect(() => render(<LottoContainer />)).not.toThrow()
  })

  it('8개의 벽 충돌체(CuboidCollider)를 렌더링해야 함', () => {
    render(<LottoContainer />)

    const { CuboidCollider } = require('@react-three/rapier')

    // 바닥 충돌체 1개 + 벽 충돌체 8개 = 총 9번 호출되어야 함
    expect(CuboidCollider).toHaveBeenCalledTimes(9)
  })

  it('RigidBody와 Cylinder를 렌더링해야 함', () => {
    render(<LottoContainer />)

    const { RigidBody } = require('@react-three/rapier')
    const { Cylinder } = require('@react-three/drei')

    expect(RigidBody).toHaveBeenCalledTimes(1)
    expect(Cylinder).toHaveBeenCalledTimes(1)

    // Cylinder의 인자가 올바르게 전달되었는지 확인
    expect(Cylinder).toHaveBeenCalledWith(
      expect.objectContaining({
        args: [6, 6, 6, 32],
        position: [0, 0, 0]
      }),
      expect.anything()
    )
  })
})
