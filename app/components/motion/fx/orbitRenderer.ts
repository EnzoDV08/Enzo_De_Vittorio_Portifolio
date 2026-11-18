/**
 * The project room: screens lining the walls of a room seen from inside it. Top down, the wall is
 * a rounded rectangle around the viewer: a flat front wall (the centre screen sits on it, flat),
 * rounded corners, and side walls that run back past the viewer. Screens slide along that wall,
 * so they bend round the corners and grow as the side walls come closer.
 *
 * One full-screen fragment shader, no meshes: for every pixel it intersects the view ray with
 * the wall analytically, finds the distance along the wall and the screen covering it. A lens in
 * the same shader blurs and splits red from blue towards the sides, more of both while moving,
 * and fades the far sides out to transparent, so the section needs no background of its own.
 *
 * Plain WebGL2, client only, loaded lazily with the home page's work section.
 */

/** Width / height of every screen, and of every texture layer. */
const PANEL_ASPECT = 1.6;
const MAX_LAYERS = 12;

export type OrbitLayout = {
  /** tan of half the horizontal / vertical field of view. */
  tanX: number;
  tanY: number;
  /** Half width of the flat front wall, at depth 1. */
  front: number;
  /** Radius of the room's corners, seen from above. */
  bend: number;
  /** Half a screen's width (along the wall) and height. */
  halfW: number;
  halfH: number;
  /** Distance along the wall from one screen's centre to the next. */
  slot: number;
  /** Centre screen as a share of the viewport, for the link and title over it. */
  panelW: number;
  panelH: number;
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Geometry for a viewport. Pure, so the overlay can use it before the canvas exists. */
export function orbitLayout(width: number, height: number): OrbitLayout {
  const aspect = width / Math.max(1, height);
  // 0 on a portrait phone, 1 on a landscape desktop.
  const t = clamp01((aspect - 0.6) / 0.6);
  const tanX = mix(1, 1.45, t);
  const tanY = tanX / aspect;
  // Centre screen width as a share of the viewport: most of a phone, half a desktop.
  let halfW = mix(0.8, 0.5, t) * tanX;
  let halfH = halfW / PANEL_ASPECT;
  // Never taller than ~54% of the viewport, leaving room above for the title on short screens.
  const maxH = mix(0.42, 0.54, t) * tanY;
  if (halfH > maxH) {
    halfH = maxH;
    halfW = halfH * PANEL_ASPECT;
  }
  const gap = halfW * mix(0.1, 0.13, t);
  return {
    tanX,
    tanY,
    // The front wall ends halfway into the gap: the next screen starts on the corner.
    front: halfW + gap / 2,
    bend: mix(0.1, 0.2, t),
    halfW,
    halfH,
    slot: 2 * halfW + gap,
    panelW: halfW / tanX,
    panelH: halfH / tanY,
  };
}

const VERTEX = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray uTex;
uniform vec2 uTan;
uniform vec2 uRes;
uniform vec2 uHalf;
uniform float uFront;
uniform float uBend;
uniform float uCount;
uniform float uRot;
uniform float uSlot;
uniform float uRound;
uniform float uBlur;
uniform float uSpread;
uniform float uEnergy;
uniform float uIntro;
uniform float uSharp;
// The one playing video has its own texture; uVideoLayer is its screen (-1: none playing).
uniform sampler2D uVideo;
uniform float uVideoLayer;
in vec2 vUv;
out vec4 outColor;

const float HALF_PI = 1.5707963;

// Where screen point ndc lands on the wall: xy = position on the screen it hits (0..1),
// z = which screen, w = signed distance to that screen's rounded edge (negative inside).
vec4 locate(vec2 ndc) {
  float dx = ndc.x * uTan.x;
  float ax = abs(dx);
  float side = uFront + uBend;
  float s;
  float z;
  if (ax <= uFront) {
    // Flat front wall at depth 1.
    z = 1.0;
    s = ax;
  } else if (side / ax <= 1.0 - uBend) {
    // Side wall, running back towards the viewer.
    z = side / ax;
    s = uFront + uBend * HALF_PI + (1.0 - uBend - z);
  } else {
    // Rounded corner: far intersection of the ray with the corner circle.
    vec2 c = vec2(uFront, 1.0 - uBend);
    vec2 d = vec2(ax, 1.0);
    float a = dot(d, d);
    float b = -2.0 * dot(d, c);
    float k = dot(c, c) - uBend * uBend;
    float t = (-b + sqrt(max(b * b - 4.0 * a * k, 0.0))) / (2.0 * a);
    vec2 p = d * t;
    z = t;
    s = uFront + uBend * atan(p.x - c.x, p.y - c.y);
  }
  s *= sign(dx);
  float y = ndc.y * uTan.y * z;
  float u = s / uSlot + uRot;
  float n = floor(u + 0.5);
  float local = (u - n) * uSlot;
  vec2 q = abs(vec2(local, y)) - uHalf + uRound;
  float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRound;
  return vec4(local / (2.0 * uHalf.x) + 0.5, 0.5 - y / (2.0 * uHalf.y), mod(n, uCount), dist);
}

// The wall is located ONCE per pixel (locate() is the expensive part: atan, sqrt). The lens's
// blur and colour-split samples are only a few pixels away, so their screen position and edge
// distance come from a first-order step along this pixel's derivatives instead of 11 more
// locate() calls. Same picture, a fraction of the work.
vec4 at0;
vec2 ux, uy;  // change of the screen uv per pixel in x / y
vec2 wd;      // change of the edge distance per pixel in x / y
float aa;     // edge antialiasing width, in wall units

// Premultiplied colour o pixels away, alpha = screen coverage. Explicit gradients, so it is
// safe inside the branch below (implicit derivatives aren't, in non-uniform control flow).
vec4 wallAt(vec2 o, vec2 gx, vec2 gy) {
  vec2 uv = clamp(at0.xy + ux * o.x + uy * o.y, 0.0, 1.0);
  float dist = at0.w + dot(wd, o);
  float mask = 1.0 - smoothstep(-aa, aa, dist);
  vec3 c = abs(at0.z - uVideoLayer) < 0.5
    ? textureGrad(uVideo, uv, gx, gy).rgb
    : textureGrad(uTex, vec3(uv, at0.z), gx, gy).rgb;
  return vec4(c * mask, mask);
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  at0 = locate(ndc);
  // Derivatives first, in uniform control flow (before any early return).
  ux = dFdx(at0.xy);
  uy = dFdy(at0.xy);
  wd = vec2(dFdx(at0.w), dFdy(at0.w));
  aa = 2.0 * uTan.y / uRes.y;
  // Only the outer band of the view, never over the centre screen (uSharp = its half width).
  float lens = smoothstep(max(0.66, uSharp), 1.0, abs(ndc.x));
  float lens2 = lens * lens;
  // Motion blur only towards the sides: the centre screen stays sharp while the room turns.
  // The one-off entrance still softens everything.
  float side = smoothstep(uSharp, min(1.0, uSharp + 0.35), abs(ndc.x));
  float energy = max(uEnergy * side, (1.0 - uIntro) * 0.9);
  // Texture footprint of one pixel, widened for the blur (one mip level per doubling).
  float widen = exp2(lens2 * uBlur + energy * 1.4);
  vec2 gx = ux * widen;
  vec2 gy = uy * widen;
  // Lens offsets, converted from view units to pixels.
  vec2 toPx = uRes * 0.5;
  float spread = (lens2 * uSpread + energy * 0.008) * sign(ndc.x) * toPx.x;
  float radius = lens2 * 0.008 + energy * 0.005;
  // Far from every screen (the space above, below and between them): nothing to draw.
  float reach = (radius * max(toPx.x, toPx.y) + abs(spread)) * (abs(wd.x) + abs(wd.y));
  if (at0.w - reach > aa) {
    outColor = vec4(0.0);
    return;
  }
  vec3 col;
  float alpha;
  if (radius < 0.0004) {
    // The sharp middle, at rest: one sample.
    vec4 s = wallAt(vec2(0.0), gx, gy);
    col = s.rgb;
    alpha = s.a;
  } else {
    // Lens: four taps, each split into red / green / blue along x.
    vec2 taps[4] = vec2[4](vec2(0.5, 0.25), vec2(-0.25, 0.5), vec2(-0.5, -0.25), vec2(0.25, -0.5));
    col = vec3(0.0);
    alpha = 0.0;
    for (int i = 0; i < 4; i++) {
      vec2 o = taps[i] * radius * toPx;
      vec4 r = wallAt(o + vec2(spread, 0.0), gx, gy);
      vec4 g = wallAt(o, gx, gy);
      vec4 b = wallAt(o - vec2(spread, 0.0), gx, gy);
      col += vec3(r.r, g.g, b.b);
      alpha += (r.a + g.a + b.a) / 3.0;
    }
    col *= 0.25;
    alpha *= 0.25;
  }
  // The far sides fade out to nothing (premultiplied, so colour and alpha together).
  float fade = (1.0 - 0.75 * lens2 * lens) * smoothstep(0.0, 0.6, uIntro);
  outColor = vec4(col, alpha) * fade;
}`;

type Options = {
  /** One image URL per screen; undefined leaves a light placeholder. */
  urls: (string | undefined)[];
  /**
   * Optional looping video per screen, sources in order of preference (first the browser can
   * play wins). Its poster should be that screen's `urls` entry, so the switch is seamless.
   */
  videos?: (VideoSource[] | undefined)[];
  /** Called when the screen nearest the centre changes. */
  onActive: (index: number) => void;
};

export type VideoSource = { src: string; type: string };

/** Size of every encode (scripts/optimize-videos.mjs): frames upload with no rescaling. */
const VIDEO_W = 1600;
const VIDEO_H = 1000;

/** Data saver on: show posters, never stream video. */
function saveData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData) || window.matchMedia("(prefers-reduced-data: reduce)").matches;
}

type Clip = {
  sources: VideoSource[];
  el: HTMLVideoElement | null;
  /** currentTime of the last frame uploaded, to upload only new frames. */
  time: number;
  failed: boolean;
};

export type Orbit = {
  /** Where the room should turn to, in screens (1 = one screen along). Eased towards. */
  setTarget: (value: number) => void;
  /** Play the entrance: the screens spin in, grow and sharpen. Once. */
  reveal: () => void;
  dispose: () => void;
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Null when WebGL2 or the shader isn't available; the caller falls back to static content. */
export function createOrbit(
  canvas: HTMLCanvasElement,
  { urls, videos = [], onActive }: Options,
): Orbit | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const loc = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    tex: loc("uTex"),
    tan: loc("uTan"),
    res: loc("uRes"),
    half: loc("uHalf"),
    front: loc("uFront"),
    bend: loc("uBend"),
    count: loc("uCount"),
    rot: loc("uRot"),
    slot: loc("uSlot"),
    round: loc("uRound"),
    blur: loc("uBlur"),
    spread: loc("uSpread"),
    energy: loc("uEnergy"),
    intro: loc("uIntro"),
    sharp: loc("uSharp"),
    video: loc("uVideo"),
    videoLayer: loc("uVideoLayer"),
  };
  const vao = gl.createVertexArray();

  // ── Textures: one array layer per screen, all the same size, mipmapped for the lens blur.
  const count = Math.max(1, Math.min(MAX_LAYERS, urls.length));
  const streaming = !saveData() && videos.some(Boolean);
  const wide = Math.max(window.innerWidth, window.innerHeight) * Math.min(window.devicePixelRatio || 1, 2) > 2200;
  // With videos, layers match the encodes exactly, so frames go straight to the GPU.
  const layerW = streaming ? VIDEO_W : wide ? 1600 : 1280;
  const layerH = streaming ? VIDEO_H : Math.round(layerW / PANEL_ASPECT);
  const levels = Math.floor(Math.log2(layerW)) + 1;
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, levels, gl.RGBA8, layerW, layerH, count);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
  if (aniso) gl.texParameterf(gl.TEXTURE_2D_ARRAY, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 4);

  // Placeholder: a light card in the page's own greys until the screenshot arrives. Cleared on
  // the GPU, every layer and mip level, so nothing is drawn or uploaded from the CPU for it.
  {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.clearColor(0xd5 / 255, 0xda / 255, 0xe2 / 255, 1);
    for (let level = 0; level < levels; level++) {
      for (let layer = 0; layer < count; layer++) {
        gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture, level, layer);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
  }

  // Fallback for the rare browser that can't crop/resize in createImageBitmap.
  const scratch = document.createElement("canvas");
  scratch.width = layerW;
  scratch.height = layerH;
  const ctx = scratch.getContext("2d");
  /** The array's mips are out of date; regenerated once, just before the next draw. */
  let mipsStale = false;
  const upload = (layer: number, source: TexImageSource) => {
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, layer, layerW, layerH, 1, gl.RGBA, gl.UNSIGNED_BYTE, source);
    // Mipmapping an array rebuilds every layer, so several posters landing at once share one.
    mipsStale = true;
  };

  let disposed = false;
  /** Something changed since the last draw (a new frame, a poster, a resize). */
  let dirty = true;
  const images: HTMLImageElement[] = [];
  urls.slice(0, count).forEach((url, layer) => {
    if (!url) return;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    images.push(img);
    img
      .decode()
      .then(async () => {
        if (disposed) return;
        // Cover-fit into the layer, anchored to the top (screens show the top of the page).
        const scale = Math.max(layerW / img.naturalWidth, layerH / img.naturalHeight);
        const sw = layerW / scale;
        const sh = layerH / scale;
        // Crop and resize off the main thread, then upload the bitmap as is: no canvas to draw,
        // and no read-back of one into the texture.
        const bitmap = await createImageBitmap(img, (img.naturalWidth - sw) / 2, 0, sw, sh, {
          resizeWidth: layerW,
          resizeHeight: layerH,
          resizeQuality: "high",
        }).catch(() => null);
        // A playing video already owns this layer; don't paint the poster over it.
        if (disposed || (clips[layer]?.time ?? -1) >= 0) {
          bitmap?.close();
          return;
        }
        if (bitmap && bitmap.width === layerW && bitmap.height === layerH) {
          upload(layer, bitmap);
        } else if (ctx) {
          ctx.clearRect(0, 0, layerW, layerH);
          ctx.drawImage(img, (layerW - img.naturalWidth * scale) / 2, 0, img.naturalWidth * scale, img.naturalHeight * scale);
          upload(layer, scratch);
        }
        bitmap?.close();
        dirty = true;
        wake();
      })
      .catch(() => {});
  });

  // ── Videos. Built to stay light:
  //  - only the centre screen plays; its neighbours are preloaded (paused) so the next one
  //    starts at once, and a screen that stops keeps its last frame as a still;
  //  - the playing video has its own small texture, so a new frame touches one 1600×1000
  //    image (and its mips), not the whole array of screens;
  //  - AV1 only where it decodes efficiently (hardware); otherwise the H.264 encode, which
  //    nearly every GPU decodes in hardware.
  const clips: (Clip | null)[] = Array.from({ length: count }, (_, i) => {
    const sources = streaming ? videos[i] : undefined;
    return sources?.length ? { sources, el: null, time: -1, failed: false } : null;
  });
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:absolute;left:0;top:0;width:2px;height:2px;overflow:hidden;opacity:0;pointer-events:none;";
  if (clips.some(Boolean)) canvas.parentElement?.appendChild(host);
  let near = false;

  // The playing screen's texture (1×1 until the first frame, so the sampler is always valid).
  const videoTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, videoTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  let videoSize = "1x1";
  /** The screen whose pixels come from videoTex (-1: none). */
  let videoLayer = -1;
  /** The screen whose video is playing (-1: none). */
  let playingLayer = -1;

  // Which encode decodes cheaply here. Decided once, before any video is created.
  let codec: "av1" | "h264" | null = streaming ? null : "h264";
  if (streaming) {
    const capabilities = navigator.mediaCapabilities;
    if (!capabilities?.decodingInfo) codec = "av1";
    else
      capabilities
        .decodingInfo({
          type: "file",
          video: {
            contentType: 'video/webm; codecs="av01.0.08M.08"',
            width: VIDEO_W,
            height: VIDEO_H,
            bitrate: 1_500_000,
            framerate: 30,
          },
        })
        .then((info) => (codec = info.supported && info.powerEfficient ? "av1" : "h264"))
        .catch(() => (codec = "h264"))
        .finally(() => {
          syncClips();
          wake();
        });
  }

  const createVideo = (clip: Clip) => {
    const el = document.createElement("video");
    el.muted = true;
    el.defaultMuted = true;
    el.loop = true;
    el.playsInline = true;
    el.preload = "auto";
    el.disablePictureInPicture = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.width = 2;
    el.height = 2;
    const playable = clip.sources.filter((s) => el.canPlayType(s.type) !== "");
    const source =
      (codec === "h264" ? playable.find((s) => s.type.includes("avc1")) : undefined) ??
      playable[0] ??
      clip.sources.at(-1);
    if (!source) return;
    el.addEventListener("error", () => (clip.failed = true), { once: true });
    el.src = source.src;
    host.appendChild(el);
    clip.el = el;
  };

  const layerOf = (at: number) => ((Math.round(at) % count) + count) % count;
  /** Layers of the screens at and either side of position `at`. */
  const around = (at: number) => {
    const k = Math.round(at);
    return new Set([k - 1, k, k + 1].map((n) => ((n % count) + count) % count));
  };

  /** Copy a video's current frame into its own array layer, so it stays as a still. */
  const freeze = (layer: number, el: HTMLVideoElement) => {
    if (el.readyState < 2 || !el.videoWidth) return;
    if (el.videoWidth === layerW && el.videoHeight === layerH) {
      upload(layer, el);
    } else if (ctx) {
      ctx.drawImage(el, 0, 0, layerW, layerH);
      upload(layer, scratch);
    }
  };

  /** Create, play and pause videos for where the room is (and is heading). */
  const syncClips = () => {
    if (!clips.some(Boolean) || !codec) return;
    // Preload around where the room is and is going, so the next screen is ready.
    const load = near ? new Set([...around(current), ...around(target)]) : new Set<number>();
    const centre = visible && near && !document.hidden ? layerOf(current) : -1;
    clips.forEach((clip, layer) => {
      if (!clip || clip.failed) return;
      if (!clip.el && (load.has(layer) || layer === centre)) createVideo(clip);
      const el = clip.el;
      if (!el) return;
      if (layer === centre) {
        if (el.paused) el.play().catch(() => {});
      } else if (!el.paused) {
        el.pause();
        // Keep its last frame on the screen rather than jumping back to the poster.
        if (videoLayer === layer) {
          freeze(layer, el);
          videoLayer = -1;
          dirty = true;
        }
      }
    });
    playingLayer = centre;
  };

  /** Upload the playing video's new frame, if it has one. True when the picture changed. */
  const pumpVideos = () => {
    const clip = playingLayer >= 0 ? clips[playingLayer] : null;
    const el = clip?.el;
    if (!clip || !el || el.paused || el.readyState < 2 || el.currentTime === clip.time) return false;
    clip.time = el.currentTime;
    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    const size = `${el.videoWidth}x${el.videoHeight}`;
    if (size !== videoSize) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el);
      videoSize = size;
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, el);
    }
    gl.generateMipmap(gl.TEXTURE_2D);
    // Hand the screen over to the video only once its first frame is in.
    videoLayer = playingLayer;
    return true;
  };
  const anyPlaying = () => {
    const el = playingLayer >= 0 ? clips[playingLayer]?.el : null;
    return Boolean(el && !el.paused);
  };
  const onVisibility = () => {
    syncClips();
    wake();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // ── Layout and loop.
  let layout = orbitLayout(1, 1);
  let target = 0;
  let current = 0;
  let energy = 0;
  let intro = 0;
  let introStart = -1;
  let active = -1;
  let raf = 0;
  let last = 0;
  let visible = true;
  // Adaptive resolution: if frames keep running long, render at a lower pixel ratio (never
  // below 1, CSS pixels) so the room stays smooth on slower machines.
  let ratioCap = 1.5;
  let frameAvg = 1 / 60;
  let slowFrames = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, ratioCap);
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    layout = orbitLayout(w, h);
    dirty = true;
    wake();
  };

  const draw = () => {
    // Moving fast widens the view a touch and pulls the screens back: the room "bends".
    const eased = 1 - (1 - intro) ** 3;
    const warp = 1 + 0.12 * energy + 0.25 * (1 - eased);
    const shrink = (1 - 0.07 * energy) * (0.8 + 0.2 * eased);
    if (mipsStale) {
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
      gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
      mipsStale = false;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
    gl.uniform1i(u.tex, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    gl.uniform1i(u.video, 1);
    gl.uniform1f(u.videoLayer, videoLayer);
    gl.uniform2f(u.tan, layout.tanX * warp, layout.tanY * warp);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform2f(u.half, layout.halfW * shrink, layout.halfH * shrink);
    gl.uniform1f(u.front, layout.front);
    gl.uniform1f(u.bend, layout.bend);
    gl.uniform1f(u.count, count);
    // The entrance spins the room in from a screen and a half back.
    gl.uniform1f(u.rot, current - 1.5 * (1 - eased));
    gl.uniform1f(u.slot, layout.slot);
    gl.uniform1f(u.round, layout.halfH * 0.05);
    gl.uniform1f(u.blur, 2.2);
    gl.uniform1f(u.spread, 0.016);
    gl.uniform1f(u.energy, energy);
    gl.uniform1f(u.intro, intro);
    gl.uniform1f(u.sharp, layout.panelW);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed || !visible) return;
    const raw = last ? (now - last) / 1000 : 1 / 60;
    const dt = Math.min(0.05, raw);
    // Frames averaging under ~40 fps for a second: step the resolution down once.
    if (last) {
      frameAvg += (raw - frameAvg) * 0.1;
      slowFrames = frameAvg > 1 / 40 ? slowFrames + 1 : 0;
      if (slowFrames > 60 && ratioCap > 1 && (window.devicePixelRatio || 1) > 1) {
        ratioCap = Math.max(1, ratioCap - 0.25);
        slowFrames = 0;
        frameAvg = 1 / 60;
        resize();
      }
    }
    last = now;
    if (introStart >= 0 && intro < 1) intro = Math.min(1, (now - introStart) / 1600);
    const prev = current;
    current += (target - current) * (1 - Math.exp(-dt * 10));
    if (Math.abs(target - current) < 1e-4) current = target;
    const speed = Math.abs(current - prev) / dt; // screens per second
    const goal = Math.min(1, speed * 0.4);
    energy += (goal - energy) * (1 - Math.exp(-dt * (goal > energy ? 12 : 4)));
    if (energy < 0.002 && goal === 0) energy = 0;
    syncClips();
    const newFrames = pumpVideos();
    const introRunning = introStart >= 0 && intro < 1;
    const moving = current !== target || energy > 0 || introRunning;
    // Only redraw when something changed: a video at 30 fps doesn't need 60 draws a second.
    if (moving || newFrames || dirty) draw();
    dirty = false;
    const index = ((Math.round(current) % count) + count) % count;
    if (index !== active) {
      active = index;
      onActive(index);
    }
    // (raf may already be set: resize() above wakes the loop itself. Never schedule twice.)
    if (moving || anyPlaying()) {
      if (!raf) raf = requestAnimationFrame(frame);
    } else last = 0;
  };

  function wake() {
    if (!raf && !disposed && visible) raf = requestAnimationFrame(frame);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    syncClips();
    if (visible) {
      last = 0;
      dirty = true;
      wake();
    }
  });
  intersection.observe(canvas);
  // Start fetching videos a little before the room scrolls into view, not on page load.
  const approach = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      near = true;
      approach.disconnect();
      syncClips();
      wake();
    },
    { rootMargin: "300px 0px" },
  );
  if (clips.some(Boolean)) approach.observe(canvas);
  resize();

  return {
    setTarget(value) {
      target = value;
      syncClips();
      wake();
    },
    reveal() {
      if (introStart >= 0) return;
      introStart = performance.now();
      wake();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      approach.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      images.forEach((img) => (img.src = ""));
      // Stop and release every video (removing src frees the decoder and buffers).
      clips.forEach((clip) => {
        if (!clip?.el) return;
        clip.el.pause();
        clip.el.removeAttribute("src");
        clip.el.load();
      });
      host.remove();
      if (gl.isContextLost()) return;
      gl.deleteTexture(texture);
      gl.deleteTexture(videoTex);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}
