'use client'

import { useState } from 'react'
import LottoMachine from '@/app/components/LottoMachine'

export default function Home() {
  const [drawingActive, setDrawingActive] = useState<number | null>(null)
  const [count, setCount] = useState(45)
  const handleDrawClick = () => {
    const randomNumber = Math.floor(Math.random() * 45) + 1 // 1~45 사이 정수
    setDrawingActive(randomNumber)
  }
  return (
    <div>
      <LottoMachine drawing={drawingActive} count={count} />
      <div className="fixed top-[10%] left-[10%] z-[10]">
        <button className="rounded-[10px] bg-black p-2 text-white" onClick={handleDrawClick}>
          추첨 {drawingActive}
        </button>
      </div>
    </div>
  )
}
