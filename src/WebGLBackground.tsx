import { useRef, useEffect } from 'react'

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  gl_PointSize = 2.0;
}
`

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float grid(vec2 uv, float sz) {
  vec2 g = abs(fract(uv * sz) - 0.5);
  float d = min(g.x, g.y);
  return smoothstep(0.0, 0.02, d);
}

float circle(vec2 uv, vec2 c, float r, float w) {
  float d = length(uv - c);
  return smoothstep(w, 0.0, abs(d - r));
}

float line(vec2 uv, vec2 a, vec2 b, float w) {
  vec2 ba = b - a;
  vec2 pa = uv - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return smoothstep(w, 0.0, length(pa - ba * h));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 uvA = uv * aspect;
  float t = u_time * 0.3;

  vec3 col = vec3(0.024, 0.024, 0.055);

  float g1 = grid(uvA + vec2(t * 0.02, 0.0), 12.0);
  float g2 = grid(uvA, 3.0);
  col += vec3(0.435, 0.82, 0.78) * (1.0 - g1) * 0.015;
  col += vec3(0.435, 0.82, 0.78) * (1.0 - g2) * 0.008;

  for (int i = 0; i < 30; i++) {
    float fi = float(i);
    vec2 pos = vec2(
      fract(hash(vec2(fi, 0.0)) + t * 0.02 * (0.5 + hash(vec2(fi, 1.0)))),
      fract(hash(vec2(fi, 2.0)) + t * 0.015 * (0.3 + hash(vec2(fi, 3.0))))
    ) * aspect;
    float brightness = hash(vec2(fi, 4.0));
    float sz = 0.001 + brightness * 0.003;
    float d = length(uvA - pos);
    float p = smoothstep(sz, 0.0, d);
    p *= 0.3 + 0.7 * (0.5 + 0.5 * sin(t * 3.0 + fi * 2.0));
    vec3 pcol = mix(vec3(0.435, 0.82, 0.78), vec3(0.976, 0.451, 0.086), brightness);
    col += pcol * p * 0.4;
  }

  vec2 reticleCenter = vec2(0.78, 0.72) * aspect;
  float r1 = circle(uvA, reticleCenter, 0.12 + sin(t) * 0.005, 0.001);
  float r2 = circle(uvA, reticleCenter, 0.08, 0.0008);
  float r3 = circle(uvA, reticleCenter, 0.04 + cos(t * 1.5) * 0.003, 0.0006);
  col += vec3(0.435, 0.82, 0.78) * (r1 + r2 * 0.6 + r3 * 0.4) * 0.15;

  float cl1 = line(uvA, reticleCenter + vec2(-0.16, 0.0), reticleCenter + vec2(-0.06, 0.0), 0.0005);
  float cl2 = line(uvA, reticleCenter + vec2(0.06, 0.0), reticleCenter + vec2(0.16, 0.0), 0.0005);
  float cl3 = line(uvA, reticleCenter + vec2(0.0, -0.16), reticleCenter + vec2(0.0, -0.06), 0.0005);
  float cl4 = line(uvA, reticleCenter + vec2(0.0, 0.06), reticleCenter + vec2(0.0, 0.16), 0.0005);
  col += vec3(0.435, 0.82, 0.78) * (cl1 + cl2 + cl3 + cl4) * 0.1;

  float scanY = fract(t * 0.15);
  float scan = smoothstep(0.003, 0.0, abs(uv.y - scanY)) * 0.06;
  col += vec3(0.435, 0.82, 0.78) * scan;

  vec2 mouseUV = u_mouse * aspect;
  float md = length(uvA - mouseUV);
  col += vec3(0.976, 0.451, 0.086) * smoothstep(0.2, 0.0, md) * 0.03;

  float vig = 1.0 - length(uv - 0.5) * 0.8;
  col *= vig;

  col *= 0.95 + 0.05 * sin(gl_FragCoord.y * 1.5);

  gl_FragColor = vec4(col, 1.0);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/**
 * Animated HUD background — grid + particles + targeting reticle + scan line +
 * mouse-proximity orange glow. Lifted from the Adonis residency site. Renders
 * as a fixed full-screen canvas behind every other element.
 */
export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return

    const vert = createShader(gl, gl.VERTEX_SHADER, VERT)
    const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vert || !frag) return

    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const posAttr = gl.getAttribLocation(program, 'a_position')
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(posAttr)
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'u_time')
    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const start = performance.now()
    const render = () => {
      const t = (performance.now() - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
