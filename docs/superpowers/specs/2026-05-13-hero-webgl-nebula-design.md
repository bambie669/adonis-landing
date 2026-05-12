# Hero WebGL Nebula — Design Spec

**Date:** 2026-05-13
**Status:** Approved (brainstormed via `superpowers:brainstorming`, awaiting implementation plan)
**Scope:** Hero section only on `adonis-landing`. No changes to Features, Pipeline, Stack, or Footer.

---

## 1. Context & goal

`adonis-landing` is the marketing site for `adonis-smart-ads`. The current Hero uses `src/WebGLBackground.tsx` — a minimal canvas effect (grid + ~30 particles + reticle + mouse glow) that reads as "HUD-y" but not memorable.

The goal is to make the Hero a **full WebGL takeover** with raymarched volumetric nebula + godrays, scroll-driven camera fly-through, and mouse-driven parallax (both on the camera and on the text layer). The rest of the page stays clean and editorial; the Hero alone carries the "hardcore WebGL" first impression.

Brand palette is fixed and reused — no new tokens are introduced.

## 2. Architecture

```
src/
├── sections/
│   └── Hero.tsx              ✏️  rewritten — mounts <NebulaShader/> + DOM overlay
├── webgl/                    ➕  new directory
│   ├── NebulaShader.tsx      ➕  canvas owner, rAF loop, listeners, WebGL lifecycle
│   └── nebula.frag           ➕  fragment shader (GLSL ES 3.00), imported via Vite ?raw
└── WebGLBackground.tsx       ❌  deleted (git history preserves it)
```

**Component boundaries:**

- `<NebulaShader/>` is self-contained: it owns its canvas, its WebGL2 context, its uniforms, its listeners, and its cleanup. It accepts no props (or a minimal `className` prop for absolute positioning). Hero never reaches into its internals.
- `<Hero/>` is purely layout: it positions `<NebulaShader/>` absolutely behind a DOM layer (text, CTAs, HUD frame, scan-lines). It also owns the **text-parallax** transform on the DOM layer — that's a CSS-only effect driven from the same mouse position the shader uses, but it's kept on the DOM side because the text must remain selectable and SEO-readable.
- The fragment shader code lives in its own `.frag` file (not a TS string) so syntax highlighting, linting, and future hot-reload work normally. Vite's `?raw` import gives us a string at build time without runtime fetch.

**Why no Three.js / no R3F:**

A single fullscreen fragment shader doesn't need a scene graph, a renderer abstraction, or a mesh hierarchy. WebGL2 + one program + one VAO + one quad is ~150 lines of TS and zero extra deps. Three.js would add ~150 KB gzipped for features we don't use.

## 3. Shader content (`nebula.frag`, WebGL2 / GLSL ES 3.00)

**Setup:**
- Fullscreen quad (clip-space `[-1, 1]`). The vertex shader is trivial — pass through `aPosition`, compute `vUv`.
- Fragment receives `vUv` and reconstructs view-space UV using `uResolution` (aspect-corrected).

**Ray setup:**
- `uCameraPos = vec3(0.0, 0.0, scrollProgress * -20.0)` — at scroll = 0 the camera is at origin; at scroll = 1 it has flown 20 units forward (into the volume).
- `uMouseTilt` is a `vec2` in roughly `[-0.15, 0.15]` rad. The ray-forward vector is rotated by that yaw/pitch.
- Each fragment computes its own ray-direction from the UV + forward + tilt.

**Volumetric raymarching:**
- ~48 steps along the ray (24 on the mobile/low-cost path — see §5).
- Step size is adaptive: large in empty regions (`density < ε`), small once we hit dense areas. Standard accumulation: `color += transmittance * sample.rgb`, `transmittance *= exp(-density * stepSize)`. Early-exit when transmittance drops below 0.01.
- Sample density at point `p`:
  ```
  density = curl_noise(p * 0.6 + uTime * vec3(0.02, 0.01, 0.03))
          * radial_falloff(p)
  ```
  with
  ```
  radial_falloff(p) = smoothstep(3.0, 0.0, abs(p.y))
                    * smoothstep(15.0, 0.0, length(p.xz))
  ```
  i.e. the central horizontal band (≤ 3 units thick along `y`) is the dense slab, fading both vertically and radially in the xz-plane out to ~15 units. The autonomous `uTime` drift means the nebula keeps breathing even when the user is still.

**Color:**
- Nebula color: `mix(vec3(0.039, 0.227, 0.208), vec3(0.435, 0.820, 0.780), density)` — i.e. `#0a3a35` → `#6fd1c7`. Deep mint in low-density rim, bright mint in dense core.
- Godrays: **one** directional source placed off-camera (direction `normalize(vec3(0.4, 0.6, -0.5))` — upper-right-ahead). For each sample point, evaluate Henyey–Greenstein phase function `HG(cosθ, g=0.7)` between the view ray and the light direction; multiply by the local transmittance (so rays show *through* density gradients, not through walls). Tint with `#f97316` and add to the accumulated color.
- Background (when ray exits without accumulating much density): `mix(#06060e, #0c1614, smoothstep)` based on view direction's y — a near-black void with a hint of dark-mint along the horizon.
- Final: linear → gamma 2.2 (`pow(color, vec3(1.0/2.2))`).

**Uniforms:**
| Name             | Type   | Source                                         |
|------------------|--------|------------------------------------------------|
| `uTime`          | float  | seconds since mount                            |
| `uResolution`    | vec2   | canvas pixel size (incl. DPR)                  |
| `uCameraPos`     | vec3   | derived from `scrollProgress`                  |
| `uMouseTilt`     | vec2   | smoothed `mouseNDC * 0.15`                     |
| `uQualityLow`    | int    | 0 or 1 — toggles step count + godrays (see §5) |

## 4. Interaction wiring (`NebulaShader.tsx`)

**State model:**
- All hot-path state lives in `useRef`, not `useState`. The component renders once on mount and never re-renders during the loop. Inputs feed the WebGL uniforms directly.
- Refs:
  - `scrollProgress: number` — `clamp(scrollY / heroHeight, 0, 1)`. `heroHeight` is the Hero element's offsetHeight (refreshed on resize).
  - `mouseNDC: { x, y }` — pointer position normalized to `[-1, 1]` relative to viewport. **Smoothed** in the rAF loop by `current += (target - current) * 0.08` so motion is buttery, not twitchy.

**Listeners:**
- `window.addEventListener('scroll', onScroll, { passive: true })`
- `window.addEventListener('mousemove', onMove, { passive: true })`
- `window.addEventListener('resize', onResize)`
- `document.addEventListener('visibilitychange', onVisibility)`
- Both `scroll` and `mousemove` handlers do nothing but write to the **target** refs. The rAF loop is the single point that reads them, smooths, and pushes to uniforms — so handler frequency is decoupled from frame rate.

**Render loop:**
```
function tick() {
  // 1. Smooth mouseNDC toward target
  // 2. Recompute uCameraPos from scrollProgress
  // 3. gl.uniform... (push uTime, uResolution, uCameraPos, uMouseTilt)
  // 4. gl.drawArrays(TRIANGLE_STRIP, 0, 4)
  // 5. Update Hero text-parallax transform on the DOM wrapper (see below)
  rafId = requestAnimationFrame(tick)
}
```

**Hero text-parallax:**
- Driven by the same `mouseNDC` (and the same rAF tick) but applied to a CSS `transform` on the text wrapper element. The wrapper has `will-change: transform`.
- Amplitudes:
  - `<h1>` wrapper: `translate3d(mouseNDC.x * 8px, mouseNDC.y * 8px, 0)`
  - subhead wrapper: `* 4px`
  - CTAs: **no translation** — they stay rock-solid as visual anchors.
- These are written through `el.style.transform`, not React state, so React never re-renders during scroll/mouse motion.

## 5. Performance, mobile, accessibility

**Quality tiers:**
- **Desktop (default):** 48 raymarch steps, both godrays on, DPR clamped to `min(devicePixelRatio, 1.5)`.
- **Low-cost path:** triggered when `window.innerWidth < 768` **or** `navigator.hardwareConcurrency < 4`. Sets `uQualityLow = 1`, which inside the shader: drops step count to 24 and skips the godrays loop. Visually the nebula is still there; godrays are absent.
- **Reduced motion:** `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → the shader does a single draw at mount with `scrollProgress = 0`, `mouseTilt = 0`. No rAF, no listeners (besides `resize`). The shader still renders the nebula as a still image.

**Pause when off-screen / hidden:**
- `IntersectionObserver` on the Hero element with `threshold: 0`. When `intersectionRatio === 0`, `cancelAnimationFrame(rafId)` and clear `rafId`. When it comes back into view, restart the loop.
- `document.visibilitychange`: when `document.hidden`, cancel the loop; on `visible`, restart.

**Cleanup on unmount:**
```
cancelAnimationFrame(rafId)
gl.deleteBuffer(quadBuffer)
gl.deleteVertexArray(vao)
gl.deleteShader(vs); gl.deleteShader(fs)
gl.deleteProgram(program)
window.removeEventListener('scroll', onScroll)
window.removeEventListener('mousemove', onMove)
window.removeEventListener('resize', onResize)
document.removeEventListener('visibilitychange', onVisibility)
intersectionObserver.disconnect()
```

**WebGL2 fallback:** if `canvas.getContext('webgl2')` returns null, mount a graceful CSS-only fallback (the existing scan-lines + a static gradient). No JS error, no broken Hero. Detection happens once in the mount effect; if it fails, `<NebulaShader/>` renders nothing and exits cleanly.

## 6. Files affected (implementation phase)

| Path                                          | Action     |
|-----------------------------------------------|------------|
| `src/sections/Hero.tsx`                       | ✏️ rewrite |
| `src/webgl/NebulaShader.tsx`                  | ➕ create  |
| `src/webgl/nebula.frag`                       | ➕ create  |
| `src/WebGLBackground.tsx`                     | ❌ delete  |
| `src/App.tsx`                                 | (no change — Hero is imported by name, internal layout changes are invisible to App) |
| `src/index.css`                               | (no change — palette + HUD utilities reused as-is) |
| `package.json`                                | (no change — pure WebGL2, no Three.js, no extra deps) |

## 7. Verification (implementation phase)

**Build:**
```powershell
cd C:\Users\Bambi\adonis-landing
npm run build
```
Must complete with no TS errors. Bundle size delta should be small (the shader is a string; the new component is ~150 lines).

**Dev / interaction:**
```powershell
npm run dev
# Open http://localhost:5173
```
Manual checks:
- [ ] Nebula visible, mint core + orange godrays.
- [ ] Mouse move tilts camera (subtle) and parallaxes `<h1>` (8px) and subhead (4px). CTAs don't move.
- [ ] Scrolling within Hero pushes camera forward — nebula appears to come closer / get denser.
- [ ] Scrolling past Hero → DevTools Performance shows rAF stops firing.
- [ ] Switching tab away → rAF pauses; switching back → resumes immediately, no glitch.
- [ ] DevTools Rendering pane → "Emulate CSS media feature prefers-reduced-motion: reduce" → nebula renders as a still frame, no animation.
- [ ] Resize window → no flicker, `uResolution` updates, canvas redraws at new size.
- [ ] Mobile emulation (375×667) → low-cost path engaged (verifiable by ensuring framerate stays at 60fps in DevTools Performance), godrays gone, nebula still visible.

**Lighthouse:**
- Performance: ≥ 80 desktop, ≥ 60 mobile (emulated).
- CLS = 0 (canvas is absolutely positioned; no layout shift).
- No accessibility regressions.

## 8. Out of scope

- Implementation of `NebulaShader.tsx` / `nebula.frag` — that comes in the implementation plan produced by `superpowers:writing-plans`.
- Changes to Features, Pipeline, Stack, Footer.
- Cloudflare Pages deploy connection.
- `og-image.png` for social previews.
- Hero stat-tile "real numbers" polish.
- Scroll-reveal IntersectionObserver wire-up on the rest of the page.
- Mobile breakpoint polish on the non-Hero sections.

## 9. Open questions

None. All design decisions resolved during brainstorming:
1. Approach: raymarched fullscreen fragment shader (vs Three.js scene, vs particle field, vs DOM parallax-only). ✅
2. Mood: volumetric nebula + godrays (vs tunnel, fluid metal, grid+SDFs). ✅
3. Scope: Hero-only takeover (vs full-page persistent BG, vs per-section canvases). ✅
4. Interaction: scroll-forward camera + mouse tilt + DOM-text parallax (vs autonomous + mouse-only, vs scroll-warp transition). ✅
5. Palette: existing brand tokens (`mint-*`, `accent-*`, `void-*`). ✅
