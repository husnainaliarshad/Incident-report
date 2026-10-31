import { useEffect, useRef } from 'react'
import { Eraser, Upload } from 'lucide-react'

const WIDTH = 900
const HEIGHT = 420

export default function SketchPad({ value, onChange }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.strokeStyle = '#134e35'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (value) {
      const image = new Image()
      image.onload = () => ctx.drawImage(image, 0, 0, WIDTH, HEIGHT)
      image.src = value
    }
  }, [value])

  const position = (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    }
  }

  const start = (event) => {
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = position(event)
    drawingRef.current = true
    ctx.beginPath()
    ctx.moveTo(x, y)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const draw = (event) => {
    if (!drawingRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = position(event)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    onChange(canvasRef.current.toDataURL('image/png'))
  }

  const clear = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    onChange('')
  }

  const upload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border-2 border-dashed border-gd-600/50 bg-white">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={end}
          onPointerLeave={end}
          className="h-auto w-full cursor-crosshair touch-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:border-gd-600"
        >
          <Eraser size={15} /> Clear sketch
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:border-gd-600">
          <Upload size={15} /> Upload image
          <input type="file" accept="image/*" className="sr-only" onChange={upload} />
        </label>
        {value ? <span className="text-xs font-medium text-gd-700">Sketch attached</span> : null}
      </div>
    </div>
  )
}
