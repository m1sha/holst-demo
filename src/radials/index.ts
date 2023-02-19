import { Scene, DynamicRenderer2D, Size, Point } from 'holst'

const size: Size = { width: 800, height: 600 }

export function createDemo (div: HTMLDivElement) {
  const scene = new Scene()

  const c = new Point(size.width / 2, size.height / 2)
  const rx = 150
  const ry = 120
  const layer = scene.createLayer()
  for (let o = 0; o < 20000; o++) {
    const shape = layer.createShape({ stroke: '#800000', lineWidth: 2 })
    for (let i = -180; i < 180; i++) {
      const a = i * Math.PI / 180
      const x = Math.cos(a) * rx + (c.x + Math.cos(a) * 20) + Math.random() * 116 + 5
      const y = Math.sin(a) * ry + (c.y - Math.sin(a) * 110)

      i === -180 ? shape.moveTo({ x, y }) : shape.lineTo({ x, y })
    }
    shape.closePath()
  }

  createView(scene, div)
}

function createView (scene: Scene, div: HTMLDivElement) {
  const renderer = new DynamicRenderer2D(size)
  renderer.setAnimationRate(1000 / 61)
  console.time('render')
  renderer.render(scene)
  console.timeEnd('render')
  div.append(renderer.element)
  const textBlock = scene.createLayer().createTextBlock('', { fontSize: '12px' }, { x: 10, y: 20 })
  setInterval(() => {
    textBlock.text = renderer.getAnimationFps().toFixed(0)
  }, 300)
}
