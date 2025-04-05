import React from 'react'
import { render } from '@testing-library/react'
import LottoMachine from '../LottoMachine'

// Three.js 관련 라이브러리 모킹
jest.mock('@react-three/drei', () => ({
  OrbitControls: jest.fn(() => <div data-testid="orbit-controls" />)
}))

jest.mock('@react-three/fiber', () => ({
  Canvas: jest.fn(({ children }) => <div data-testid="canvas">{children}</div>)
}))

jest.mock('@react-three/rapier', () => ({
  Physics: jest.fn(({ children }) => <div data-testid="physics">{children}</div>)
}))

// 다른 컴포넌트 모킹
jest.mock('@/app/components/LottoContainer', () =>
  jest.fn(() => <div data-testid="lotto-container" />)
)
jest.mock('@/app/components/LottoBall', () => ({
  __esModule: true,
  default: jest.fn(({ count, drawing }) => (
    <div data-testid="lotto-balls" data-count={count} data-drawing={drawing} />
  ))
}))

describe('LottoMachine 컴포넌트', () => {
  it('기본 props로 렌더링되어야 함', () => {
    render(<LottoMachine />)

    // 필요한 컴포넌트들이 렌더링되었는지 확인
    expect(document.querySelector('[data-testid="canvas"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="physics"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="lotto-container"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="lotto-balls"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="orbit-controls"]')).toBeInTheDocument()
  })

  it('props가 올바르게 전달되어야 함', () => {
    const drawing = 5
    const count = 10

    render(<LottoMachine drawing={drawing} count={count} />)

    // LottoBalls에 올바른 props가 전달되었는지 확인
    const lottoBalls = document.querySelector('[data-testid="lotto-balls"]')
    expect(lottoBalls).toHaveAttribute('data-count', count.toString())
    expect(lottoBalls).toHaveAttribute('data-drawing', drawing.toString())
  })

  it('Canvas에 올바른 스타일과 카메라 설정이 적용되어야 함', () => {
    render(<LottoMachine />)

    const { Canvas } = require('@react-three/fiber')

    // Canvas 컴포넌트 호출 확인
    expect(Canvas).toHaveBeenCalledWith(
      expect.objectContaining({
        style: { height: '100vh', background: '#ddd' },
        camera: { position: [0, 5, 15], fov: 80 }
      }),
      expect.anything()
    )
  })
})
