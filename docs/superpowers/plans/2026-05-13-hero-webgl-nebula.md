# Hero WebGL Nebula Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the page-wide `WebGLBackground` with a Hero-only WebGL takeover: raymarched volumetric nebula + Henyey–Greenstein godrays, scroll-driven camera fly-through, mouse-driven camera tilt + DOM text parallax.

**Architecture:** Single fullscreen quad rendered by a WebGL2 fragment shader, mounted absolutely inside `<Hero/>`. The shader's three inputs (`uCameraPos`, `uMouseTilt`, `uTime`) are driven from a single rAF loop that smooths raw scroll/mouse events. The same smoothed values are pushed through an `onFrame` callback so `<Hero/>` can apply CSS `translate3d` to its text refs without a second loop. Lifecycle is guarded by `IntersectionObserver` + `visibilitychange` + `prefers-reduced-motion`, with a hardware-concurrency-based quality gate for mobile.

**Tech Stack:** React 19, TypeScript 6, Vite 8 (uses `?raw` imports for `.frag`), WebGL2 + GLSL ES 3.00. No new dependencies — `package.json` is untouched.

**Spec:** [`docs/superpowers/specs/2026-05-13-hero-webgl-nebula-design.md`](../specs/2026-05-13-hero-webgl-nebula-design.md)

---

## Testing note

`adonis-landing` has no test runner installed (no vitest, no jest in `package.json`). Adding one purely to assert lerp math is YAGNI for this feature, and WebGL pixel output is not reliably unit-testable in headless. **Verification in this plan is therefore (a) `npm run build` for TypeScript type-checking and (b) manual browser checks via `npm run dev`.** Every task that touches code ends with a build check; the final task is a structured manual checklist.

If a future feature warrants a test runner, that's a separate plan.

## File structure

| Path                                          | Action                                                                |
|-----------------------------------------------|-----------------------------------------------------------------------|
| `src/webgl/` (directory)                      | ➕ create                                                              |
| `src/webgl/utils.ts`                          | ➕ create — `compileProgram` helper                                    |
| `src/webgl/nebula.frag`                       | ➕ create — fragment shader source                                     |
| `src/webgl/NebulaShader.tsx`                  | ➕ create — canvas owner, WebGL2 init, rAF loop, lifecycle             |
| `src/sections/Hero.tsx`                       | ✏️ rewrite — mount `<NebulaShader/>`, wire parallax refs, HUD frame   |
| `src/App.tsx`                                 | ✏️ remove `<WebGLBackground/>` mount + import                          |
| `src/WebGLBackground.tsx`                     | ❌ delete                                                              |

Boundaries:
- `utils.ts` is the only place that knows GLSL compilation mechanics. `NebulaShader.tsx` calls one helper and never touches `gl.createShader`/`gl.compileShader` directly.
- `NebulaShader.tsx` owns the rAF loop and the canvas. It does NOT touch Hero's text DOM directly — it pushes state out through an `onFrame` callback prop.
- `Hero.tsx` owns its own DOM (h1, subhead, CTAs) and applies parallax transforms via refs it controls. It never reaches into the shader's internals.

## Branch & commit policy

- Work happens on a feature branch `feat/hero-webgl-nebula` off `main`.
- Each task ends with one focused commit. No squashing during the plan; the merge to `main` can be done as a final fast-forward or PR at the user's discretion.
- No `git push` is run anywhere in this plan. The user pushes when they're ready.

---

## Task 0: Branch setup

**Files:** none (repo state only)

- [ ] **Step 1: Create and check out the feature branch**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
git checkout -b feat/hero-webgl-nebula
git status -sb
```
Expected: `## feat/hero-webgl-nebula`, working tree clean.

- [ ] **Step 2: Confirm baseline build still passes**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
& npm.cmd run build
```
Expected: 22 modules transformed, no errors. (Sanity check — no code changed yet.)

---

## Task 1: WebGL utility module + fragment shader

**Files:**
- Create: `src/webgl/utils.ts`
- Create: `src/webgl/nebula.frag`

- [ ] **Step 1: Create the `src/webgl/` directory**

Run:
```powershell
New-Item -ItemType Directory -Path 'C:\Users\Bambi\adonis-landing\src\webgl' -Force | Out-Null
Test-Path 'C:\Users\Bambi\adonis-landing\src\webgl'
```
Expected: `True`.

- [ ] **Step 2: Write `src/webgl/utils.ts`**

Create the file with this exact content:

```ts
/** Compile a vertex+fragment GLSL pair into a linked WebGL2 program.
 *  Returns null and logs to console on failure (so the caller can mount a
 *  graceful fallback rather than crash the React tree). */
export function compileProgram(
  gl: WebGL2RenderingContext,
  vertSource: string,
  fragSource: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSource)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[NebulaShader] program link failed:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return null
  }
  // Shaders are attached & no longer needed individually after linking.
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  return program
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[NebulaShader] shader compile failed:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}
```

- [ ] **Step 3: Write `src/webgl/nebula.frag`**

Create the file with this exact content (GLSL ES 3.00; `?raw`-imported as a string):

```glsl
#version 300 es
precision highp float;

out vec4 outColor;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uCameraPos;
uniform vec2  uMouseTilt;
uniform int   uQualityLow;

// ---------------------------------------------------------------------------
// Hash + value-noise FBM in 3D. Cheap, looks fine for volumetric clouds.
// ---------------------------------------------------------------------------
vec3 hash33(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7,  74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
          dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
      mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
          dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x),
      u.y),
    mix(
      mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
          dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
      mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
          dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x),
      u.y),
    u.z);
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

// ---------------------------------------------------------------------------
// Density field. Central horizontal band, fading vertically (|y| > 3) and
// radially in the xz-plane (radius > 15). Drift on uTime keeps it breathing.
// ---------------------------------------------------------------------------
float radialFalloff(vec3 p) {
  float yBand  = smoothstep(3.0,  0.0, abs(p.y));
  float xzRing = smoothstep(15.0, 0.0, length(p.xz));
  return yBand * xzRing;
}

float densityAt(vec3 p) {
  vec3 q = p * 0.6 + uTime * vec3(0.02, 0.01, 0.03);
  float n = fbm(q);
  n = max(n + 0.15, 0.0);
  return n * radialFalloff(p) * 1.6;
}

// ---------------------------------------------------------------------------
// Henyey–Greenstein phase function (forward-scattering).
// ---------------------------------------------------------------------------
float hg(float cosTheta, float g) {
  float g2 = g * g;
  float denom = pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
  return (1.0 - g2) / (denom * 12.5663706);  // 4*pi
}

void main() {
  // Aspect-corrected NDC (-1..1 horizontally x aspect, -1..1 vertically).
  vec2 ndc = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
  ndc.x *= uResolution.x / uResolution.y;

  // Build ray.
  vec3 ro  = uCameraPos;
  vec3 fwd = normalize(vec3(uMouseTilt.x, uMouseTilt.y, 1.0));
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up    = cross(fwd, right);
  vec3 rd    = normalize(fwd + ndc.x * right * 0.9 + ndc.y * up * 0.9);

  // Single off-camera light, upper-right-ahead.
  vec3 lightDir = normalize(vec3(0.4, 0.6, -0.5));

  // Raymarch.
  int   steps    = (uQualityLow == 1) ? 24 : 48;
  float stepSize = (uQualityLow == 1) ? 0.9 : 0.6;
  float t        = 0.0;
  vec3  accum    = vec3(0.0);
  float trans    = 1.0;

  for (int i = 0; i < 64; i++) {
    if (i >= steps) break;
    vec3 p = ro + rd * t;
    float d = densityAt(p);

    if (d > 0.001) {
      vec3 neb = mix(
        vec3(0.039, 0.227, 0.208),   // #0a3a35  deep mint
        vec3(0.435, 0.820, 0.780),   // #6fd1c7  bright mint
        clamp(d, 0.0, 1.0)
      );

      if (uQualityLow == 0) {
        float phase = hg(dot(rd, lightDir), 0.7);
        neb += vec3(0.976, 0.451, 0.086) * phase * 0.45;  // #f97316 godrays
      }

      float absorb = d * stepSize;
      accum += trans * neb * absorb;
      trans *= exp(-absorb);
      if (trans < 0.01) break;
    }

    t += stepSize;
  }

  // Background: void → dark-mint along horizon.
  float horizon = smoothstep(-0.2, 0.4, rd.y);
  vec3  bg      = mix(
    vec3(0.024, 0.024, 0.055),   // #06060e void
    vec3(0.047, 0.086, 0.078),   // #0c1614 very-dark-mint
    horizon
  );
  accum += trans * bg;

  // Gamma 2.2.
  accum = pow(accum, vec3(1.0 / 2.2));

  outColor = vec4(accum, 1.0);
}
```

- [ ] **Step 4: Verify build (shader file does not import; only utils.ts is type-checked at this point)**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
& npm.cmd run build
```
Expected: succeeds. (`nebula.frag` is not imported yet, so it's invisible to TS. `utils.ts` is referenced by nothing yet, but `noUnusedLocals` only fires inside modules — unused exported symbols are fine.)

- [ ] **Step 5: Commit**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
git add src/webgl/utils.ts src/webgl/nebula.frag
git commit -m "feat(hero): webgl utils + raymarched nebula fragment shader"
```

---

## Task 2: NebulaShader React component

**Files:**
- Create: `src/webgl/NebulaShader.tsx`

This is the largest task. The component is ~140 lines but every piece is required for the spec's lifecycle guarantees (off-screen pause, reduced-motion, quality gate, full cleanup). Writing it incrementally without those guarantees would break the spec.

- [ ] **Step 1: Write `src/webgl/NebulaShader.tsx`**

Create the file with this exact content:

```tsx
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
  /** smoothed mouse X in [-1, 1] */
  mouseX: number
  /** smoothed mouse Y in [-1, 1] */
  mouseY: number
  /** smoothed scroll progress in [0, 1] across the Hero element */
  scrollProgress: number
}

interface Props {
  /** Ref to the wrapping section. The shader observes it for visibility and
   *  reads its `offsetTop`/`offsetHeight` to compute scroll progress. */
  heroRef: React.RefObject<HTMLElement | null>
  /** Called on every frame with the smoothed input state. Consumers use this
   *  to drive parallax transforms on their own DOM without a second rAF loop. */
  onFrame?: (state: NebulaFrameState) => void
}

export function NebulaShader({ heroRef, onFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Stash latest onFrame in a ref so prop changes don't tear down the effect.
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
    if (!gl) {
      // WebGL2 unsupported — silently mount nothing. Hero still has scan-lines + void bg.
      return
    }

    const program = compileProgram(gl, VERT_SOURCE, fragSource)
    if (!program) return
    gl.useProgram(program)

    // Fullscreen quad.
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

    // Uniforms.
    const uTime       = gl.getUniformLocation(program, 'uTime')
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uCameraPos  = gl.getUniformLocation(program, 'uCameraPos')
    const uMouseTilt  = gl.getUniformLocation(program, 'uMouseTilt')
    const uQualityLow = gl.getUniformLocation(program, 'uQualityLow')

    // Quality tier (set once at mount; recomputing on resize is overkill).
    const lowCost =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency ?? 4) < 4
    gl.uniform1i(uQualityLow, lowCost ? 1 : 0)

    // Targets (raw input) vs current (smoothed each frame).
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
      // Smooth (exponential approach, ~12-frame settle).
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

    // Pause when Hero leaves the viewport.
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
```

- [ ] **Step 2: Verify build**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
& npm.cmd run build
```
Expected: succeeds. (`?raw` import resolves to a `string` via Vite's `vite/client` types declared in `tsconfig.app.json`.)

If TS complains about `*.frag?raw`, add this triple-slash directive at the top of `NebulaShader.tsx`: `/// <reference types="vite/client" />`. The `tsconfig.app.json` already includes `vite/client` in `types`, so it should not be needed.

- [ ] **Step 3: Commit**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
git add src/webgl/NebulaShader.tsx
git commit -m "feat(hero): NebulaShader component with full lifecycle"
```

---

## Task 3: Rewrite `Hero.tsx`

**Files:**
- Modify: `src/sections/Hero.tsx` (full rewrite)

- [ ] **Step 1: Replace `src/sections/Hero.tsx` with this exact content**

```tsx
import { useCallback, useRef } from 'react'
import { NebulaShader, type NebulaFrameState } from '../webgl/NebulaShader'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const h1Ref   = useRef<HTMLHeadingElement>(null)
  const subRef  = useRef<HTMLParagraphElement>(null)

  // Stable callback (refs are stable, no deps needed). Avoids tearing down
  // NebulaShader's effect on every Hero render.
  const handleFrame = useCallback((s: NebulaFrameState) => {
    if (h1Ref.current) {
      h1Ref.current.style.transform =
        `translate3d(${s.mouseX * 8}px, ${s.mouseY * 8}px, 0)`
    }
    if (subRef.current) {
      subRef.current.style.transform =
        `translate3d(${s.mouseX * 4}px, ${s.mouseY * 4}px, 0)`
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden hud-frame"
    >
      {/* WebGL nebula sits at z-0 inside the Hero, behind the text layer. */}
      <NebulaShader heroRef={heroRef} onFrame={handleFrame} />

      <div className="relative z-10 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-mint-500/30 text-mint-500 text-xs font-mono uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-mint-500 status-live" />
          on-device · GPU-accelerated · self-hosted
        </div>

        <h1
          ref={h1Ref}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 will-change-transform"
        >
          <span className="block text-white/95">Video intelligence,</span>
          <span className="block glow-mint text-mint-500">on your box.</span>
        </h1>

        <p
          ref={subRef}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 will-change-transform"
        >
          Adonis ingests YouTube, Instagram, Facebook and TikTok videos, transcribes
          them with Whisper on your GPU, dissects every scene with YOLOv8x + CLIP +
          VideoMAE, and writes a Gemini-authored blueprint of why the post works.
          Then it scrapes the ad ecosystem they live in.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a
            href="https://github.com/cristidan94/adonis-smart-ads"
            target="_blank"
            rel="noreferrer"
            className="btn-hud px-6 py-3 rounded-md bg-accent-500 hover:bg-accent-600 text-white font-medium tracking-wide"
          >
            View on GitHub →
          </a>
          <a
            href="#pipeline"
            className="btn-hud px-6 py-3 rounded-md border border-mint-500/30 text-mint-500 hover:bg-mint-500/10 font-medium tracking-wide"
          >
            How it works
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
          <Stat label="Models"    value="6+"    detail="Whisper · YOLOv8x · CLIP · VideoMAE · MTCNN · Gemini" />
          <Stat label="Platforms" value="4"     detail="YouTube · Instagram · Facebook · TikTok" />
          <Stat label="Queues"    value="5"     detail="Celery: preprocess · extract · filter · analyse · transcribe" />
          <Stat label="Storage"   value="Local" detail="Postgres · Parquet · jobs.json — no cloud" />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="hud-frame p-4 bg-void-900/40 backdrop-blur-sm">
      <div className="text-xs font-mono uppercase tracking-widest text-mint-500/70 mb-1">{label}</div>
      <div className="font-serif text-3xl text-white/95 mb-1">{value}</div>
      <div className="text-xs text-white/45 leading-snug">{detail}</div>
    </div>
  )
}
```

Notes on what changed vs. the old Hero:
- Section now has `relative` + `overflow-hidden` (canvas absolute-positions inside it) and `hud-frame` (decorative corner brackets, defined in `index.css`).
- Inner content wrapper has `relative z-10` so it stacks above the canvas.
- `<h1>` and `<p>` got `ref` + `will-change-transform`.
- `<Stat/>` cards got a translucent `bg-void-900/40 backdrop-blur-sm` so they read against the now-busy nebula background.

- [ ] **Step 2: Verify build**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
& npm.cmd run build
```
Expected: succeeds, ~22+ modules transformed.

- [ ] **Step 3: Commit**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
git add src/sections/Hero.tsx
git commit -m "feat(hero): mount NebulaShader, wire parallax refs, HUD frame"
```

---

## Task 4: Remove old `WebGLBackground` from App and delete the file

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/WebGLBackground.tsx`

- [ ] **Step 1: Replace `src/App.tsx` with this exact content**

```tsx
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { Pipeline } from './sections/Pipeline'
import { Stack } from './sections/Stack'
import { Footer } from './sections/Footer'

export function App() {
  return (
    <div className="relative scan-lines">
      <Hero />
      <Features />
      <Pipeline />
      <Stack />
      <Footer />
    </div>
  )
}
```

Diff vs. the old App.tsx:
- Dropped `import { WebGLBackground } from './WebGLBackground'`.
- Dropped the `<WebGLBackground />` mount.
- Dropped the surrounding `<>…</>` fragment + `style={{ zIndex: 1 }}` inline (the canvas isn't above anything anymore; `scan-lines` is a `position: relative` decoration so the wrapper stays as a single `<div>`).
- `scan-lines` class is preserved so the rest of the page still has its subtle CRT grain.

- [ ] **Step 2: Delete `src/WebGLBackground.tsx`**

Run:
```powershell
Remove-Item 'C:\Users\Bambi\adonis-landing\src\WebGLBackground.tsx'
Test-Path 'C:\Users\Bambi\adonis-landing\src\WebGLBackground.tsx'
```
Expected: `False`.

- [ ] **Step 3: Verify build**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
& npm.cmd run build
```
Expected: succeeds. The bundle should drop a few KB (old shader + its TS gone, new shader is GLSL string in a separate chunk).

- [ ] **Step 4: Commit**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
git add src/App.tsx src/WebGLBackground.tsx
git commit -m "refactor(app): drop page-wide WebGLBackground; Hero owns its WebGL now"
```
(Git records the deletion of `WebGLBackground.tsx` automatically when staged.)

---

## Task 5: Manual verification

**Files:** none (browser-side check).

- [ ] **Step 1: Start the dev server**

Run (in a separate terminal — leave it running):
```powershell
cd C:\Users\Bambi\adonis-landing
& npm.cmd run dev
```
Expected: `VITE v8.0.12  ready in …`, listening on `http://localhost:5173`.

- [ ] **Step 2: Open the page and run the visual checklist**

Open `http://localhost:5173` and confirm each item:

- [ ] Hero is dark with a **mint nebula visible** behind the text. Some warm-orange streaks (godrays) should be visible coming from the upper-right.
- [ ] **Mouse parallax on text:** moving the mouse around the viewport visibly shifts the `<h1>` (`±8px`) and the subhead (`±4px`); the buttons don't move.
- [ ] **Mouse tilt on shader:** the nebula's apparent "view angle" shifts subtly with the mouse — the warmth and dense regions appear to slide as you move.
- [ ] **Scroll-forward camera:** as you scroll down within the Hero (but before leaving it), the nebula appears to "come closer" / get denser. Stop part-way and the motion holds.
- [ ] **Off-Hero pause:** open DevTools → Performance, record a few seconds while you scroll past the Hero into the Features section, then stop. The recording should show the shader's draw frames stopping once Hero is fully off-screen (no `gl.drawArrays` activity).
- [ ] **Tab-hidden pause:** switch to another tab for 5 seconds, switch back. The animation should resume smoothly with no visible glitch.
- [ ] **Reduced motion:** in DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion: reduce`". Reload. Nebula renders as a static still; mouse + scroll do nothing on the shader. (Text parallax also disappears because the `onFrame` callback never fires.)
- [ ] **Resize:** drag the window between narrow and wide. No flicker; the nebula re-fits the new aspect.
- [ ] **Mobile emulation:** DevTools → toggle device toolbar → iPhone 12 (390×844). The shader should still render but **without orange godrays** (low-quality path engaged). Framerate should hold at ~60fps in the Performance tab.
- [ ] **No console errors.** Reload one more time and check the Console — no red errors from WebGL, no React warnings.

- [ ] **Step 3: Stop the dev server**

In the dev-server terminal: `Ctrl+C` to stop Vite.

- [ ] **Step 4: Final status check**

Run:
```powershell
cd C:\Users\Bambi\adonis-landing
git status
git log --oneline main..HEAD
```
Expected: working tree clean; the log shows 4 new commits on `feat/hero-webgl-nebula` (one per Task 1–4).

- [ ] **Step 5: Hand control back to the user**

Surface the branch to the user. Do NOT auto-merge to `main` and do NOT push. The user decides whether to:
- merge fast-forward into `main` locally, or
- push the branch and open a PR on GitHub, or
- iterate further on the shader parameters first.

---

## Out of scope

- Three.js or any scene-graph library — pure WebGL2 by design.
- Test runner setup (vitest/jest) — see "Testing note" above.
- Changes to Features / Pipeline / Stack / Footer.
- Cloudflare Pages deploy hooks.
- `og-image.png`.
- Hero stat-tile "real numbers" polish.
- Scroll-reveal IntersectionObserver wire-up on the rest of the page.
- Mobile breakpoint polish for sections other than Hero.

## Self-review checklist (executed before handing off)

- [x] Every spec section has a covering task: Architecture → T1–T4, Shader → T1, Interaction → T2 + T3, Performance/a11y → T2, Files → T1–T4, Verification → T5, Open questions → none.
- [x] No placeholders, no "TBD", no "implement later", no "similar to Task N".
- [x] Every code-bearing step has complete code.
- [x] Type names are consistent: `NebulaFrameState`, `NebulaShader`, `compileProgram`, `handleFrame`.
- [x] Method names match across tasks: `tick`, `draw`, `resize`, `updateScroll`, `onMouse`, `onVisibility`.
- [x] Branch + commit policy is explicit (Task 0 sets up the branch; each later task commits once).
- [x] Testing deviation called out upfront ("no test runner installed; verification is build + manual browser checks").
- [x] No instructions to push to remote anywhere in the plan.
