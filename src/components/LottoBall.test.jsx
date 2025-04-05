import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, jest } from '@jest/globals'

// Three.js 및 관련 라이브러리 모킹
jest.mock('three', () => ({
  CanvasTexture: jest.fn()
}))

jest.mock('@react-three/rapier', () => ({
  RigidBody: jest.fn(({ children }) => <div data-testid="rigid-body">{children}</div>),
  BallCollider: jest.fn(() => <div data-testid="ball-collider" />)
}))

jest.mock('@react-three/drei', () => ({
  Sphere: jest.fn(({ children }) => <div data-testid="sphere">{children}</div>)
}))

jest.mock('@react-spring/three', () => ({
  useSpring: jest.fn(() => [{}, { start: jest.fn() }]),
  animated: {
    group: jest.fn(({ children }) => <div data-testid="animated-group">{children}</div>),
    meshStandardMaterial: jest.fn(() => <div data-testid="animated-material" />)
  }
}))

// 캔버스 API 모킹
global.document.createElement = jest.fn().mockImplementation((tag) => {
  if (tag === 'canvas') {
    return {
      width: 0,
      height: 0,
      getContext: jest.fn(() => ({
        fillStyle: '',
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        font: '',
        textAlign: '',
        textBaseline: '',
        fillText: jest.fn()
      }))
    }
  }
  return {}
})

describe('LottoBall 컴포넌트', () => {
  it('기본 props로 렌더링되어야 함', () => {
    const onClick = jest.fn()
    render(<LottoBall number={1} onClick={onClick} />)

    // 필요한 컴포넌트들이 렌더링되었는지 확인
    expect(document.querySelector('[data-testid="animated-group"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="rigid-body"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="ball-collider"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="sphere"]')).toBeInTheDocument()
  })

  it('drawing prop이 true일 때 공의 위치가 변경되어야 함', () => {
    const { useSpring } = require('@react-spring/three')

    render(<LottoBall number={1} drawing={true} onClick={jest.fn()} />)

    // useSpring이 [0, 5, 0] 위치로 설정되었는지 확인
    expect(useSpring).toHaveBeenCalledWith(
      expect.objectContaining({
        position: [0, 5, 0]
      })
    )
  })
})

describe('LottoBalls 컴포넌트', () => {
  it('지정된 개수만큼 공이 렌더링되어야 함', () => {
    // LottoBall 컴포넌트를 모킹하여 렌더링된 공의 수 확인
    const originalLottoBall = require('../LottoBall').default
    jest.mock('../LottoBall', () => jest.fn(() => <div data-testid="lotto-ball" />))

    render(<LottoBalls count={5} />)

    // 5개의 공이 렌더링되었는지 확인
    const balls = screen.getAllByTestId('lotto-ball')
    expect(balls).toHaveLength(5)
  })

  it('drawing prop이 변경될 때 해당 공만 drawing 상태여야 함', () => {
    render(<LottoBalls count={5} drawing={3} />)

    // LottoBall 컴포넌트 호출을 확인하고 drawing prop이 올바르게 전달되는지 검사
    const { default: LottoBall } = require('../LottoBall')

    // LottoBall 호출 횟수 확인
    expect(LottoBall).toHaveBeenCalledTimes(5)

    // 3번 공만 drawing prop이 true로 설정되었는지 확인
    const calls = LottoBall.mock.calls
    const drawingBall = calls.find((call) => call[0].number === 3)
    expect(drawingBall[0].drawing).toBe(true)

    // 다른 공들은 drawing prop이 false인지 확인
    const nonDrawingBalls = calls.filter((call) => call[0].number !== 3)
    nonDrawingBalls.forEach((call) => {
      expect(call[0].drawing).toBe(false)
    })
  })
})
