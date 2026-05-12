import { useEffect, useRef } from 'react'
import fragSource from './nebula.frag?raw'
import { compileProgram } from './utils'

const VERT_SOURCE = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

export interface NebulaFrameState {
  mouseX: number
  mouseY: number
  scrollProgress: number
}

interface Props {
  heroRef: React.RefObject<HTMLElement | null>
  onFrame?: (state: NebulaFrameState) => void
}

export function NebulaShader({ heroRef, onFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFrameRef = useRef(onFrame)
  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    })
    if (!gl) return

    const program = compileProgram(gl, VERT_SOURCE, fragSource)
    if (!program) return
    gl.useProgram(program)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime       = gl.getUniformLocation(program, 'uTime')
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uCameraPos  = gl.getUniformLocation(program, 'uCameraPos')
    const uMouseTilt  = gl.getUniformLocation(program, 'uMouseTilt')
    const uQualityLow = gl.getUniformLocation(program, 'uQualityLow')

    const lowCost =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency ?? 4) < 4
    gl.uniform1i(uQualityLow, lowCost ? 1 : 0)

    const target  = { scroll: 0, mx: 0, my: 0 }
    const current = { scroll: 0, mx: 0, my: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.floor(canvas.clientWidth  * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      canvas.width  = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }

    const updateScroll = () => {
      const hero = heroRef.current
      if (!hero) return
      const heroHeight = hero.offsetHeight || window.innerHeight
      const scrolled   = Math.max(0, window.scrollY - hero.offsetTop)
      target.scroll    = Math.min(1, scrolled / heroHeight)
    }

    const onMouse = (e: MouseEvent) => {
      target.mx =  (e.clientX / window.innerWidth)  * 2 - 1
      target.my = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    resize()
    updateScroll()
    window.addEventListener('resize',    resize)
    window.addEventListener('scroll',    updateScroll, { passive: true })
    window.addEventListener('mousemove', onMouse,      { passive: true })

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start   = performance.now()
    let rafId: number | null = null

    const draw = () => {
      const t = (performance.now() - start) / 1000
      gl.uniform1f(uTime,       t)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform3f(uCameraPos,  0, 0, current.scroll * -20)
      gl.uniform2f(uMouseTilt,  current.mx * 0.15, current.my * 0.15)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const tick = () => {
      current.scroll += (target.scroll - current.scroll) * 0.08
      current.mx     += (target.mx     - current.mx)     * 0.08
      current.my     += (target.my     - current.my)     * 0.08

      draw()
      onFrameRef.current?.({
        mouseX:         current.mx,
        mouseY:         current.my,
        scrollProgress: current.scroll,
      })

      rafId = requestAnimationFrame(tick)
    }

    if (reduced) {
      draw()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    let observerPaused = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.intersectionRatio === 0) {
          if (rafId !== null) cancelAnimationFrame(rafId)
          rafId = null
          observerPaused = true
        } else if (observerPaused && !reduced) {
          observerPaused = false
          rafId = requestAnimationFrame(tick)
        }
      },
      { threshold: 0 },
    )
    if (heroRef.current) observer.observe(heroRef.current)

    const onVisibility = () => {
      if (document.hidden) {
        if (rafId !== null) cancelAnimationFrame(rafId)
        rafId = null
      } else if (rafId === null && !reduced && !observerPaused) {
        rafId = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize',    resize)
      window.removeEventListener('scroll',    updateScroll)
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteBuffer(quadBuffer)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
    }
  }, [heroRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
