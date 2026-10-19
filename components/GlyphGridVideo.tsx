'use client'

/*
 * GlyphGridVideo — same glyph field as before (pitch, count, springs, mouse),
 * but drawn with one instanced WebGL pass instead of a drawImage per glyph.
 *
 * The old canvas path issued ~20k transformed draws every frame, plus a
 * full-frame filter, and blocked the main thread long enough to stall scrolling
 * on the rest of the page. Simulation stays on the CPU (well under a
 * millisecond at this count). The GPU only rasterises.
 *
 * The loop pauses while the banner is off-screen or the tab is hidden, so the
 * page below the hero is not paying for it.
 */

import { useEffect, useRef } from 'react'

const VIDEO_DIR = '/video/std'
const VIDEOS = ['post_2.mp4']
/** Colour used under the glyphs until a video has decoded its first frame. */
const FALLBACK_COLOR = '#56748b'

const GLYPHS = ['◊', '↔', '+', '→']
const ATLAS_SIZE = 512
const MAX_PIXEL_DENSITY = 2
/** Glyph pitch in px — small so the videos read through the glyph field. */
const DEFAULT_CELL_SIZE = 6
/** Glyph size relative to the cell (>1 lets neighbours overlap slightly). */
const GLYPH_SIZE_FACTOR = 1.15

const SPRING_STRENGTH = 0.1
const DAMPING = 0.7
const NOISE_SCALE = 0.18
const TIME_SCALE = 0.01

const MOUSE_RADIUS_FACTOR = 1
const MOUSE_SCALE_BOOST = 0.55
const MOUSE_OPACITY_BOOST = 90
const MOUSE_ROTATION_STRENGTH = 0.25

/** Matches the previous canvas filter: saturate(1.9) contrast(1.25). */
const SATURATE = 1.9
const CONTRAST = 1.25

const GLYPH_COUNT = GLYPHS.length
const FRAME_MS = 1000 / 60

const VERT = `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 aUV;
layout(location = 2) in float aScale;
layout(location = 3) in float aOpacity;
layout(location = 4) in float aRotation;

uniform vec2 uCssSize;
uniform vec2 uCell;
uniform float uBaseDraw;
uniform int uRows;

out vec2 vUV;
out float vOpacity;
flat out int vGlyph;

void main() {
  int id = gl_InstanceID;
  int rows = uRows;
  int y = id - (id / rows) * rows;
  int x = id / rows;

  vec2 center = (vec2(float(x), float(y)) + 0.5) * uCell;
  float c = cos(aRotation);
  float s = sin(aRotation);
  vec2 local = aCorner * (uBaseDraw * aScale);
  vec2 rot = vec2(c * local.x - s * local.y, s * local.x + c * local.y);
  vec2 pos = center + rot;

  vec2 clip = pos / uCssSize * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);

  vUV = aUV;
  vOpacity = aOpacity;
  vGlyph = x + y - ((x + y) / 4) * 4;
}
`

const FRAG = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2DArray;
precision highp sampler2D;

uniform sampler2DArray uGlyphs;
uniform sampler2D uMosaic;
uniform vec2 uCanvasPx;

in vec2 vUV;
in float vOpacity;
flat in int vGlyph;

out vec4 fragColor;

vec3 grade(vec3 color) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, ${SATURATE.toFixed(2)});
  color = (color - 0.5) * ${CONTRAST.toFixed(2)} + 0.5;
  return clamp(color, 0.0, 1.0);
}

void main() {
  float mask = texture(uGlyphs, vec3(vUV, float(vGlyph))).a;
  float alpha = mask * clamp(vOpacity, 0.0, 1.0);
  vec2 screen = vec2(
    gl_FragCoord.x / uCanvasPx.x,
    1.0 - gl_FragCoord.y / uCanvasPx.y
  );
  vec3 color = grade(texture(uMosaic, screen).rgb);
  fragColor = vec4(color * alpha, alpha);
}
`

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

const grad = (hash: number, x: number, y: number, z: number) => {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

const lerp = (a: number, b: number, t: number) => a + t * (b - a)

/** Classic Perlin mapped to 0..1, matching the range p5's noise() fed the springs. */
const perlin01 = (perm: Uint8Array, x: number, y: number, z: number) => {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const z0 = Math.floor(z)
  const X = x0 & 255
  const Y = y0 & 255
  const Z = z0 & 255
  x -= x0
  y -= y0
  z -= z0
  const u = fade(x)
  const v = fade(y)
  const w = fade(z)
  const A = perm[X] + Y
  const AA = perm[A] + Z
  const AB = perm[A + 1] + Z
  const B = perm[X + 1] + Y
  const BA = perm[B] + Z
  const BB = perm[B + 1] + Z
  const res = lerp(
    lerp(
      lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
      lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
      v,
    ),
    lerp(
      lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
      v,
    ),
    w,
  )
  const n = res * 0.5 + 0.5
  return n < 0 ? 0 : n > 1 ? 1 : n
}

const seedPerm = (perm: Uint8Array, seed: number) => {
  let s = seed >>> 0 || 1
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = p[i]
    p[i] = p[j]
    p[j] = tmp
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
}

const compile = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'shader compile failed'
    gl.deleteShader(shader)
    throw new Error(log)
  }
  return shader
}

const linkProgram = (gl: WebGL2RenderingContext) => {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  const program = gl.createProgram()
  if (!program) throw new Error('Unable to create program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'program link failed'
    gl.deleteProgram(program)
    throw new Error(log)
  }
  return program
}

const rasterGlyphs = () => {
  const layers: ImageData[] = []
  for (const glyph of GLYPHS) {
    const canvas = document.createElement('canvas')
    canvas.width = ATLAS_SIZE
    canvas.height = ATLAS_SIZE
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) throw new Error('2d context unavailable')
    ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE)
    ctx.fillStyle = '#fff'
    ctx.font = `${ATLAS_SIZE * 0.8}px Gridular, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(glyph, ATLAS_SIZE / 2, ATLAS_SIZE / 2)
    layers.push(ctx.getImageData(0, 0, ATLAS_SIZE, ATLAS_SIZE))
  }
  return layers
}

type GlyphGridVideoProps = {
  className?: string
  cellSize?: number
}

export default function GlyphGridVideo({
  className,
  cellSize = DEFAULT_CELL_SIZE,
}: GlyphGridVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = containerRef.current
    if (!host) return

    let disposed = false
    const perm = new Uint8Array(512)
    seedPerm(perm, 1)

    const videos: HTMLVideoElement[] = []
    let readyTimeout: ReturnType<typeof setTimeout> | null = null
    let raf = 0
    let resizeObserver: ResizeObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
    let canvas: HTMLCanvasElement | null = null
    let gl: WebGL2RenderingContext | null = null

    const signalReady = () => {
      if (disposed) return
      const w = window as unknown as { __glyphGridReady?: boolean }
      if (w.__glyphGridReady) return
      w.__glyphGridReady = true
      window.dispatchEvent(new Event('glyphgrid:ready'))
    }

    videos.push(
      ...VIDEOS.map((name) => {
        const v = document.createElement('video')
        v.src = `${VIDEO_DIR}/${encodeURIComponent(name)}`
        v.muted = true
        v.defaultMuted = true
        v.loop = true
        v.autoplay = true
        v.playsInline = true
        v.preload = 'auto'
        v.setAttribute('aria-hidden', 'true')
        v.style.cssText =
          'position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;'
        v.addEventListener('loadeddata', signalReady, { once: true })
        host.appendChild(v)
        void v.play().catch(() => {})
        return v
      }),
    )
    readyTimeout = setTimeout(signalReady, 4000)

    const destroy = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      videos.forEach((v) => {
        v.pause()
        v.removeAttribute('src')
        v.load()
        v.remove()
      })
      videos.length = 0
      if (gl) {
        const lose = gl.getExtension('WEBGL_lose_context')
        lose?.loseContext()
      }
      canvas?.remove()
      canvas = null
      gl = null
    }

    let cols = 1
    let rows = 1
    let cssW = 1
    let cssH = 1
    let cellW = 1
    let cellH = 1
    let baseDraw = 1
    let scales = new Float32Array(1)
    let scaleVel = new Float32Array(1)
    let opacities = new Float32Array(1)
    let opacityVel = new Float32Array(1)
    let instances = new Float32Array(3)
    let frameCount = 0
    let mouseSeen = false
    let mouseX = 0
    let mouseY = 0
    let smoothMouseX = 0
    let smoothMouseY = 0
    let onScreen = true
    let lastNow = 0
    let accum = 0
    const videoTimes = videos.map(() => -1)

    const mosaic = document.createElement('canvas')
    // Not desynchronized: that flag defers the bitmap, so texImage2D kept
    // uploading the fallback fill instead of the current video frame.
    const mosaicCtx = mosaic.getContext('2d', { alpha: false })

    let mosaicTex: WebGLTexture | null = null
    let glyphTex: WebGLTexture | null = null
    let instanceBuf: WebGLBuffer | null = null
    let vao: WebGLVertexArrayObject | null = null
    let program: WebGLProgram | null = null
    let mosaicW = 0
    let mosaicH = 0
    let uCssSize: WebGLUniformLocation | null = null
    let uCell: WebGLUniformLocation | null = null
    let uBaseDraw: WebGLUniformLocation | null = null
    let uRows: WebGLUniformLocation | null = null
    let uCanvasPx: WebGLUniformLocation | null = null

    const onPointer = (event: PointerEvent) => {
      // The project card sits above the banner, so the canvas itself rarely
      // receives the pointer. Track it on the window, in canvas space, the
      // same way the previous p5 sketch did.
      if (!canvas || !onScreen) return
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (!mouseSeen) {
        smoothMouseX = x
        smoothMouseY = y
        mouseSeen = true
      }
      mouseX = x
      mouseY = y
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === ' ') seedPerm(perm, Math.floor(Math.random() * 10000))
    }

    const ensureLoop = () => {
      if (disposed || raf || !onScreen || document.hidden) return
      lastNow = performance.now()
      accum = FRAME_MS
      raf = requestAnimationFrame(loop)
      videos.forEach((v) => {
        void v.play().catch(() => {})
      })
    }

    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      videos.forEach((v) => v.pause())
    }

    const onVisibility = () => {
      if (document.hidden || !onScreen) stopLoop()
      else ensureLoop()
    }

    const allocGrid = (nextCols: number, nextRows: number) => {
      cols = nextCols
      rows = nextRows
      const count = cols * rows
      scales = new Float32Array(count).fill(1)
      scaleVel = new Float32Array(count)
      opacities = new Float32Array(count).fill(1)
      opacityVel = new Float32Array(count)
      instances = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        instances[i * 3] = 1
        instances[i * 3 + 1] = 1
      }
      if (gl && instanceBuf) {
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuf)
        gl.bufferData(gl.ARRAY_BUFFER, instances.byteLength, gl.DYNAMIC_DRAW)
      }
    }

    const resize = () => {
      if (!gl || !canvas || !mosaicCtx) return
      const w = host.clientWidth
      const h = host.clientHeight
      if (w <= 0 || h <= 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_DENSITY)
      cssW = w
      cssH = h
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))

      const nextCols = Math.max(1, Math.round(w / cellSize))
      const nextRows = Math.max(1, Math.round(h / cellSize))
      if (nextCols !== cols || nextRows !== rows || scales.length !== nextCols * nextRows) {
        allocGrid(nextCols, nextRows)
      }
      cellW = w / cols
      cellH = h / rows
      baseDraw = Math.min(cellW, cellH) * GLYPH_SIZE_FACTOR

      // Cap the mosaic so a retina banner does not upload a multi-megabyte
      // texture every video frame. The source clip is 1080px; past ~2048
      // the glyphs cannot show more detail.
      const maxW = 2048
      const bufW = canvas.width
      const bufH = canvas.height
      const scale = bufW > maxW ? maxW / bufW : 1
      const mw = Math.max(1, Math.round(bufW * scale))
      const mh = Math.max(1, Math.round(bufH * scale))
      if (mosaic.width !== mw || mosaic.height !== mh) {
        mosaic.width = mw
        mosaic.height = mh
        mosaicW = 0
        mosaicH = 0
      }
      paintMosaic(true)
      draw()
    }

    const paintMosaic = (force: boolean) => {
      if (!gl || !mosaicCtx || !mosaicTex) return
      let changed = force
      for (let i = 0; i < videos.length; i++) {
        const time = videos[i].currentTime
        if (videos[i].readyState >= 2 && time !== videoTimes[i]) {
          videoTimes[i] = time
          changed = true
        }
      }
      if (!changed) return

      const tileW = mosaic.width / videos.length
      const tileH = mosaic.height
      mosaicCtx.setTransform(1, 0, 0, 1, 0, 0)
      mosaicCtx.globalCompositeOperation = 'source-over'
      mosaicCtx.globalAlpha = 1

      for (let i = 0; i < videos.length; i++) {
        const dx = i * tileW
        const v = videos[i]
        const vw = v.videoWidth
        const vh = v.videoHeight
        if (v.readyState < 2 || !vw || !vh) {
          mosaicCtx.fillStyle = FALLBACK_COLOR
          mosaicCtx.fillRect(dx, 0, tileW + 1, tileH + 1)
          continue
        }
        const tileAspect = tileW / tileH
        let sw = vw
        let sh = vw / tileAspect
        if (sh > vh) {
          sh = vh
          sw = vh * tileAspect
        }
        const sx = (vw - sw) * 0.5
        const sy = (vh - sh) * 0.5
        mosaicCtx.drawImage(v, sx, sy, sw, sh, dx, 0, tileW + 1, tileH + 1)
      }

      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, mosaicTex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      if (mosaicW !== mosaic.width || mosaicH !== mosaic.height) {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          mosaic,
        )
        mosaicW = mosaic.width
        mosaicH = mosaic.height
      } else {
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          mosaic,
        )
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    const step = () => {
      frameCount += 1
      const t3 = frameCount * TIME_SCALE
      if (mouseSeen) {
        smoothMouseX += (mouseX - smoothMouseX) * 0.2
        smoothMouseY += (mouseY - smoothMouseY) * 0.2
      }
      const mouseRadius = Math.min(cssW, cssH) * MOUSE_RADIUS_FACTOR
      const mouseRadiusInv = 1 / mouseRadius
      const mouseRadiusSq = mouseRadius * mouseRadius

      let i3 = 0
      for (let x = 0; x < cols; x++) {
        const xPos = (x + 0.5) * cellW
        const nx = x * NOISE_SCALE
        const col = x * rows
        for (let y = 0; y < rows; y++) {
          const i = col + y
          const noiseValue = perlin01(perm, nx, y * NOISE_SCALE, t3)

          let mouseInfluence = 0
          let rotation = 0
          if (mouseSeen) {
            const dx = smoothMouseX - xPos
            const dy = smoothMouseY - ((y + 0.5) * cellH)
            const distSq = dx * dx + dy * dy
            if (distSq < mouseRadiusSq) {
              const u = 1 - Math.sqrt(distSq) * mouseRadiusInv
              mouseInfluence = u * u * (3 - 2 * u)
              rotation =
                Math.atan2(dy, dx) * mouseInfluence * MOUSE_ROTATION_STRENGTH
            }
          }

          const targetScale =
            0.3 + noiseValue * 1.5 + mouseInfluence * MOUSE_SCALE_BOOST
          const sv =
            (scaleVel[i] + (targetScale - scales[i]) * SPRING_STRENGTH) * DAMPING
          scaleVel[i] = sv
          const s = scales[i] + sv
          scales[i] = s

          let targetOpacity =
            (50 + noiseValue * 205 + mouseInfluence * MOUSE_OPACITY_BOOST) / 255
          if (targetOpacity > 1) targetOpacity = 1
          const ov =
            (opacityVel[i] + (targetOpacity - opacities[i]) * SPRING_STRENGTH) *
            DAMPING
          opacityVel[i] = ov
          const o = opacities[i] + ov
          opacities[i] = o

          instances[i3++] = s
          instances[i3++] = o
          instances[i3++] = rotation
        }
      }
    }

    const draw = () => {
      if (!gl || !program || !vao || !instanceBuf || rows < 1) return
      paintMosaic(false)

      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuf)
      // Orphan the previous buffer so this upload doesn't wait on the in-flight draw.
      gl.bufferData(gl.ARRAY_BUFFER, instances, gl.DYNAMIC_DRAW)

      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.uniform2f(uCssSize, cssW, cssH)
      gl.uniform2f(uCell, cellW, cellH)
      gl.uniform1f(uBaseDraw, baseDraw)
      gl.uniform1i(uRows, rows)
      gl.uniform2f(uCanvasPx, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, cols * rows)
    }

    const loop = (now: number) => {
      if (disposed) return
      raf = requestAnimationFrame(loop)
      const dt = Math.min(100, now - lastNow)
      lastNow = now
      accum += dt
      if (accum < FRAME_MS) return
      accum -= FRAME_MS
      if (accum > FRAME_MS) accum = 0
      step()
      draw()
    }

    const boot = async () => {
      try {
        const face = new FontFace(
          'Gridular',
          'url(/font/Gridular-Regular.otf) format("opentype")',
        )
        const loaded = await face.load()
        document.fonts.add(loaded)
      } catch (err) {
        console.warn('Gridular font failed to load, falling back', err)
      }
      if (disposed) return

      let layers: ImageData[]
      try {
        layers = rasterGlyphs()
      } catch (err) {
        console.error(err)
        return
      }
      if (disposed) return

      canvas = document.createElement('canvas')
      canvas.style.cssText = 'display:block;width:100%;height:100%;'
      canvas.setAttribute('aria-hidden', 'true')
      host.appendChild(canvas)

      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        desynchronized: true,
      })
      if (!gl || !mosaicCtx) {
        console.error('WebGL2 unavailable for glyph banner')
        return
      }
      const context = gl

      try {
        program = linkProgram(context)
      } catch (err) {
        console.error(err)
        return
      }

      uCssSize = context.getUniformLocation(program, 'uCssSize')
      uCell = context.getUniformLocation(program, 'uCell')
      uBaseDraw = context.getUniformLocation(program, 'uBaseDraw')
      uRows = context.getUniformLocation(program, 'uRows')
      uCanvasPx = context.getUniformLocation(program, 'uCanvasPx')
      const uGlyphs = context.getUniformLocation(program, 'uGlyphs')
      const uMosaic = context.getUniformLocation(program, 'uMosaic')

      glyphTex = context.createTexture()
      context.activeTexture(context.TEXTURE0)
      context.bindTexture(context.TEXTURE_2D_ARRAY, glyphTex)
      context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR)
      context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_MAG_FILTER, context.LINEAR)
      context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
      context.texParameteri(context.TEXTURE_2D_ARRAY, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
      context.texImage3D(
        context.TEXTURE_2D_ARRAY,
        0,
        context.RGBA,
        ATLAS_SIZE,
        ATLAS_SIZE,
        GLYPH_COUNT,
        0,
        context.RGBA,
        context.UNSIGNED_BYTE,
        null,
      )
      for (let i = 0; i < layers.length; i++) {
        context.texSubImage3D(
          context.TEXTURE_2D_ARRAY,
          0,
          0,
          0,
          i,
          ATLAS_SIZE,
          ATLAS_SIZE,
          1,
          context.RGBA,
          context.UNSIGNED_BYTE,
          layers[i].data,
        )
      }
      context.generateMipmap(context.TEXTURE_2D_ARRAY)

      mosaicTex = context.createTexture()
      context.activeTexture(context.TEXTURE1)
      context.bindTexture(context.TEXTURE_2D, mosaicTex)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)

      const quad = new Float32Array([
        -0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        -0.5, 0.5, 0, 1,
        -0.5, 0.5, 0, 1,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1,
      ])
      const quadBuf = context.createBuffer()
      context.bindBuffer(context.ARRAY_BUFFER, quadBuf)
      context.bufferData(context.ARRAY_BUFFER, quad, context.STATIC_DRAW)

      instanceBuf = context.createBuffer()
      vao = context.createVertexArray()
      context.bindVertexArray(vao)
      context.bindBuffer(context.ARRAY_BUFFER, quadBuf)
      context.enableVertexAttribArray(0)
      context.vertexAttribPointer(0, 2, context.FLOAT, false, 16, 0)
      context.enableVertexAttribArray(1)
      context.vertexAttribPointer(1, 2, context.FLOAT, false, 16, 8)
      context.bindBuffer(context.ARRAY_BUFFER, instanceBuf)
      context.bufferData(context.ARRAY_BUFFER, instances.byteLength, context.DYNAMIC_DRAW)
      context.enableVertexAttribArray(2)
      context.vertexAttribPointer(2, 1, context.FLOAT, false, 12, 0)
      context.vertexAttribDivisor(2, 1)
      context.enableVertexAttribArray(3)
      context.vertexAttribPointer(3, 1, context.FLOAT, false, 12, 4)
      context.vertexAttribDivisor(3, 1)
      context.enableVertexAttribArray(4)
      context.vertexAttribPointer(4, 1, context.FLOAT, false, 12, 8)
      context.vertexAttribDivisor(4, 1)
      context.bindVertexArray(null)

      context.useProgram(program)
      context.uniform1i(uGlyphs, 0)
      context.uniform1i(uMosaic, 1)
      context.disable(context.DEPTH_TEST)
      context.disable(context.CULL_FACE)
      context.enable(context.BLEND)
      context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA)
      context.clearColor(0, 0, 0, 0)

      const w = host.clientWidth || 600
      const h = host.clientHeight || 200
      allocGrid(
        Math.max(1, Math.round(w / cellSize)),
        Math.max(1, Math.round(h / cellSize)),
      )
      resize()

      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('keydown', onKey)
      document.addEventListener('visibilitychange', onVisibility)
      resizeObserver = new ResizeObserver(() => resize())
      resizeObserver.observe(host)
      intersectionObserver = new IntersectionObserver(([entry]) => {
        const visible = entry.isIntersecting
        if (!visible && entry.boundingClientRect.height > 0) {
          onScreen = false
          stopLoop()
        } else if (visible) {
          onScreen = true
          ensureLoop()
        }
      })
      intersectionObserver.observe(host)
      ensureLoop()
    }

    void boot()

    return () => {
      disposed = true
      if (readyTimeout) clearTimeout(readyTimeout)
      destroy()
    }
  }, [cellSize])

  return (
    <>
      {/* Preload the glyph font early (React hoists this into <head>). */}
      <link
        rel="preload"
        href="/font/Gridular-Regular.otf"
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />
      <div
        ref={containerRef}
        className={`relative ${className ?? ''}`}
        style={{ contain: 'layout paint' }}
      />
    </>
  )
}
