global.HTMLCanvasElement.prototype.getContext = () => ({
  fillStyle: '',
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  font: '',
  textAlign: '',
  textBaseline: '',
  fillText: jest.fn()
})

// matchMedia 모킹 (React Three Fiber에서 필요할 수 있음)
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    }
  }
