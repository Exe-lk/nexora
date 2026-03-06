import { useEffect, useRef, useCallback } from "react";

// ---- Math utilities ----
function mat4Perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1.0 / Math.tan(fov / 2);
  const rangeInv = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  ]);
}

function mat4LookAt(eye: number[], center: number[], up: number[]): Float32Array {
  const zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let len = 1 / Math.sqrt(zx * zx + zy * zy + zz * zz);
  const z0 = zx * len, z1 = zy * len, z2 = zz * len;
  const x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0;
  len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  const xx = x0 * len, xy = x1 * len, xz = x2 * len;
  const y0 = z1 * xz - z2 * xy, y1 = z2 * xx - z0 * xz, y2 = z0 * xy - z1 * xx;
  return new Float32Array([
    xx, y0, z0, 0,
    xy, y1, z1, 0,
    xz, y2, z2, 0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]),
    -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]),
    1,
  ]);
}

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const o = new Float32Array(16);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      o[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3];
    }
  return o;
}

// ---- Shader sources ----
const PARTICLE_VS = `
  attribute vec3 aPosition;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform mat4 uMVP;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 pos = aPosition;
    pos.y += sin(uTime * 0.5 + aPhase) * 0.3;
    pos.x += cos(uTime * 0.3 + aPhase * 1.5) * 0.15;
    gl_Position = uMVP * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / gl_Position.w);
    vColor = aColor;
    float pulse = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase);
    vAlpha = pulse * smoothstep(80.0, 10.0, gl_Position.w);
  }
`;

const PARTICLE_FS = `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = exp(-d * 6.0);
    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`;

const RING_VS = `
  attribute vec3 aPosition;
  attribute float aPhase;
  uniform mat4 uMVP;
  uniform float uTime;
  uniform float uRadius;
  uniform float uTubeRadius;
  uniform vec3 uOffset;
  varying float vBrightness;
  varying float vPhase;
  void main() {
    float angle = aPosition.x;
    float tube = aPosition.y;
    float r = uRadius + uTubeRadius * cos(tube);
    vec3 pos;
    pos.x = r * cos(angle) + uOffset.x;
    pos.y = uTubeRadius * sin(tube) + uOffset.y;
    pos.z = r * sin(angle) + uOffset.z;
    pos.y += sin(uTime * 0.8 + angle * 2.0) * 0.05;
    gl_Position = uMVP * vec4(pos, 1.0);
    gl_PointSize = 2.5 * (200.0 / gl_Position.w);
    vBrightness = 0.5 + 0.5 * sin(uTime * 2.0 + angle * 4.0 + tube * 2.0);
    vPhase = aPhase;
  }
`;

const RING_FS = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;
  varying float vBrightness;
  varying float vPhase;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = exp(-d * 5.0);
    float pulse = 0.7 + 0.3 * sin(uTime * 3.0 + vPhase * 6.28);
    gl_FragColor = vec4(uColor * (vBrightness * pulse + 0.3), glow * 0.85);
  }
`;

const GRID_VS = `
  attribute vec3 aPosition;
  uniform mat4 uMVP;
  varying float vDist;
  varying vec2 vWorldXZ;
  void main() {
    gl_Position = uMVP * vec4(aPosition, 1.0);
    vDist = length(aPosition.xz);
    vWorldXZ = aPosition.xz;
  }
`;

const GRID_FS = `
  precision mediump float;
  uniform float uTime;
  varying float vDist;
  varying vec2 vWorldXZ;
  void main() {
    float fade = smoothstep(40.0, 5.0, vDist);
    float pulse = 0.7 + 0.3 * sin(uTime * 0.5 - vDist * 0.3);
    vec3 col = mix(vec3(0.3, 0.2, 0.5), vec3(0.5, 0.15, 0.4), sin(vDist * 0.2) * 0.5 + 0.5);
    gl_FragColor = vec4(col * pulse, fade * 0.2);
  }
`;

const BEAM_VS = `
  attribute vec3 aPosition;
  attribute float aAlpha;
  uniform mat4 uMVP;
  varying float vAlpha;
  void main() {
    gl_Position = uMVP * vec4(aPosition, 1.0);
    vAlpha = aAlpha;
  }
`;

const BEAM_FS = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    float pulse = 0.6 + 0.4 * sin(uTime * 1.0);
    gl_FragColor = vec4(uColor, vAlpha * pulse * 0.15);
  }
`;

const SHAPE_VS = `
  attribute vec3 aPosition;
  uniform mat4 uMVP;
  uniform float uTime;
  uniform vec3 uCenter;
  uniform float uOrbitRadius;
  uniform float uOrbitSpeed;
  uniform float uOrbitPhase;
  varying float vEdge;
  void main() {
    float angle = uTime * uOrbitSpeed + uOrbitPhase;
    vec3 offset = vec3(cos(angle) * uOrbitRadius, sin(uTime * 0.7 + uOrbitPhase) * 1.0, sin(angle) * uOrbitRadius);
    float rot = uTime * 1.5 + uOrbitPhase;
    float c = cos(rot), s = sin(rot);
    vec3 rp = vec3(aPosition.x * c - aPosition.z * s, aPosition.y, aPosition.x * s + aPosition.z * c);
    vec3 pos = rp + uCenter + offset;
    gl_Position = uMVP * vec4(pos, 1.0);
    gl_PointSize = 2.0 * (150.0 / gl_Position.w);
    vEdge = length(aPosition) * 3.0;
  }
`;

const SHAPE_FS = `
  precision mediump float;
  uniform vec3 uColor;
  varying float vEdge;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = exp(-d * 4.0);
    gl_FragColor = vec4(uColor, glow * 0.7);
  }
`;

// ---- Helpers ----
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  return s;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, vs)!);
  gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, fs)!);
  gl.linkProgram(p);
  return p;
}

// ---- Geometry generators ----
function genParticles(count: number) {
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const palette = [
    [0.48, 0.7, 1.0], [0.78, 0.5, 0.86], [0.9, 0.31, 0.63],
    [0.78, 0.49, 1.0], [0.55, 0.75, 1.0],
  ];
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 35 + 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.8;
    pos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * 0.6 + (Math.random() - 0.5) * 4;
    pos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
    sizes[i] = Math.random() * 3 + 0.5;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
    phases[i] = Math.random() * Math.PI * 2;
  }
  return { pos, sizes, colors, phases, count };
}

function genTorusPoints(segments: number, tubeSegments: number) {
  const count = segments * tubeSegments;
  const pos = new Float32Array(count * 2); // angle, tube
  const phases = new Float32Array(count);
  let idx = 0;
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < tubeSegments; j++) {
      pos[idx * 2] = (i / segments) * Math.PI * 2;
      pos[idx * 2 + 1] = (j / tubeSegments) * Math.PI * 2;
      phases[idx] = Math.random();
      idx++;
    }
  }
  return { pos, phases, count };
}

function genGrid(size: number, divisions: number) {
  const verts: number[] = [];
  const step = size / divisions;
  const half = size / 2;
  for (let i = 0; i <= divisions; i++) {
    const p = -half + i * step;
    verts.push(p, 0, -half, p, 0, half);
    verts.push(-half, 0, p, half, 0, p);
  }
  return { data: new Float32Array(verts), count: verts.length / 3 };
}

function genBeams(count: number) {
  const verts: number[] = [];
  const alphas: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 30;
    verts.push(x, -8, z, x, 15, z);
    alphas.push(0.0, 1.0);
  }
  return { data: new Float32Array(verts), alphas: new Float32Array(alphas), count: count * 2 };
}

function genOctahedron(scale: number) {
  const s = scale;
  const verts = [
    0, s, 0,  0, -s, 0,  s, 0, 0,  -s, 0, 0,  0, 0, s,  0, 0, -s,
    // edges
    s*0.5, s*0.5, 0,  -s*0.5, s*0.5, 0,  0, s*0.5, s*0.5,  0, s*0.5, -s*0.5,
    s*0.5, -s*0.5, 0,  -s*0.5, -s*0.5, 0,  0, -s*0.5, s*0.5,  0, -s*0.5, -s*0.5,
    s*0.5, 0, s*0.5,  s*0.5, 0, -s*0.5,  -s*0.5, 0, s*0.5,  -s*0.5, 0, -s*0.5,
  ];
  return { data: new Float32Array(verts), count: verts.length / 3 };
}

interface SceneState {
  scrollY: number;
  mouseX: number;
  mouseY: number;
}

export function WebGLScene({ state }: { state: React.MutableRefObject<SceneState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    // Programs
    const particleProg = createProgram(gl, PARTICLE_VS, PARTICLE_FS);
    const ringProg = createProgram(gl, RING_VS, RING_FS);
    const gridProg = createProgram(gl, GRID_VS, GRID_FS);
    const beamProg = createProgram(gl, BEAM_VS, BEAM_FS);
    const shapeProg = createProgram(gl, SHAPE_VS, SHAPE_FS);

    // Geometry
    const particles = genParticles(500);
    const ring1 = genTorusPoints(120, 20);
    const ring2 = genTorusPoints(80, 14);
    const ring3 = genTorusPoints(60, 10);
    const grid = genGrid(80, 40);
    const beams = genBeams(12);
    const octa = genOctahedron(0.35);

    // Particle buffers
    const pPosBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, pPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particles.pos, gl.STATIC_DRAW);
    const pSizeBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, pSizeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particles.sizes, gl.STATIC_DRAW);
    const pColBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, pColBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particles.colors, gl.STATIC_DRAW);
    const pPhaseBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, pPhaseBuf);
    gl.bufferData(gl.ARRAY_BUFFER, particles.phases, gl.STATIC_DRAW);

    // Ring buffers
    function makeRingBufs(gl: WebGLRenderingContext, ring: { pos: Float32Array; phases: Float32Array }) {
      const pb = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, pb);
      gl.bufferData(gl.ARRAY_BUFFER, ring.pos, gl.STATIC_DRAW);
      const phb = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, phb);
      gl.bufferData(gl.ARRAY_BUFFER, ring.phases, gl.STATIC_DRAW);
      return { pb, phb };
    }
    const r1Bufs = makeRingBufs(gl, ring1);
    const r2Bufs = makeRingBufs(gl, ring2);
    const r3Bufs = makeRingBufs(gl, ring3);

    // Grid buffer
    const gridBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf);
    gl.bufferData(gl.ARRAY_BUFFER, grid.data, gl.STATIC_DRAW);

    // Beam buffers
    const beamPosBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, beamPosBuf);
    gl.bufferData(gl.ARRAY_BUFFER, beams.data, gl.STATIC_DRAW);
    const beamAlphaBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, beamAlphaBuf);
    gl.bufferData(gl.ARRAY_BUFFER, beams.alphas, gl.STATIC_DRAW);

    // Shape buffer
    const shapeBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, octa.data, gl.STATIC_DRAW);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();

    function render() {
      const t = (performance.now() - startTime) * 0.001;
      const w = canvas!.width, h = canvas!.height;
      const aspect = w / h;
      const scroll = state.current.scrollY;
      const mx = state.current.mouseX;
      const my = state.current.mouseY;

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      // Camera follows scroll — moves through the 3D scene
      const scrollNorm = scroll / (document.documentElement.scrollHeight - window.innerHeight || 1);
      const camPath = scrollNorm * 5; // 0 to 5 sections

      const camX = Math.sin(camPath * 0.3) * 2 + mx * 3;
      const camY = 3 - camPath * 1.5 + my * 2;
      const camZ = 18 - camPath * 12;
      const lookY = -camPath * 2;

      const proj = mat4Perspective(Math.PI / 3.5, aspect, 0.1, 200);
      const view = mat4LookAt([camX, camY, camZ], [0, lookY, camZ - 20], [0, 1, 0]);
      const mvp = mat4Multiply(proj, view);

      // --- Draw grid floor ---
      gl!.useProgram(gridProg);
      const gMvpLoc = gl!.getUniformLocation(gridProg, "uMVP");
      const gTimeLoc = gl!.getUniformLocation(gridProg, "uTime");
      gl!.uniformMatrix4fv(gMvpLoc, false, mvp);
      gl!.uniform1f(gTimeLoc, t);
      const gPosAttr = gl!.getAttribLocation(gridProg, "aPosition");
      gl!.enableVertexAttribArray(gPosAttr);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, gridBuf);
      gl!.vertexAttribPointer(gPosAttr, 3, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.LINES, 0, grid.count);
      gl!.disableVertexAttribArray(gPosAttr);

      // --- Draw beams ---
      gl!.useProgram(beamProg);
      gl!.uniformMatrix4fv(gl!.getUniformLocation(beamProg, "uMVP"), false, mvp);
      gl!.uniform1f(gl!.getUniformLocation(beamProg, "uTime"), t);
      gl!.uniform3f(gl!.getUniformLocation(beamProg, "uColor"), 0.6, 0.35, 0.85);
      const bPosAttr = gl!.getAttribLocation(beamProg, "aPosition");
      const bAlphaAttr = gl!.getAttribLocation(beamProg, "aAlpha");
      gl!.enableVertexAttribArray(bPosAttr);
      gl!.enableVertexAttribArray(bAlphaAttr);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, beamPosBuf);
      gl!.vertexAttribPointer(bPosAttr, 3, gl!.FLOAT, false, 0, 0);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, beamAlphaBuf);
      gl!.vertexAttribPointer(bAlphaAttr, 1, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.LINES, 0, beams.count);
      gl!.disableVertexAttribArray(bPosAttr);
      gl!.disableVertexAttribArray(bAlphaAttr);

      // --- Draw particles ---
      gl!.useProgram(particleProg);
      gl!.uniformMatrix4fv(gl!.getUniformLocation(particleProg, "uMVP"), false, mvp);
      gl!.uniform1f(gl!.getUniformLocation(particleProg, "uTime"), t);
      const ppAttr = gl!.getAttribLocation(particleProg, "aPosition");
      const psAttr = gl!.getAttribLocation(particleProg, "aSize");
      const pcAttr = gl!.getAttribLocation(particleProg, "aColor");
      const pphAttr = gl!.getAttribLocation(particleProg, "aPhase");
      gl!.enableVertexAttribArray(ppAttr);
      gl!.enableVertexAttribArray(psAttr);
      gl!.enableVertexAttribArray(pcAttr);
      gl!.enableVertexAttribArray(pphAttr);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, pPosBuf);
      gl!.vertexAttribPointer(ppAttr, 3, gl!.FLOAT, false, 0, 0);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, pSizeBuf);
      gl!.vertexAttribPointer(psAttr, 1, gl!.FLOAT, false, 0, 0);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, pColBuf);
      gl!.vertexAttribPointer(pcAttr, 3, gl!.FLOAT, false, 0, 0);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, pPhaseBuf);
      gl!.vertexAttribPointer(pphAttr, 1, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.POINTS, 0, particles.count);
      gl!.disableVertexAttribArray(ppAttr);
      gl!.disableVertexAttribArray(psAttr);
      gl!.disableVertexAttribArray(pcAttr);
      gl!.disableVertexAttribArray(pphAttr);

      // --- Draw rings ---
      function drawRing(
        bufs: { pb: WebGLBuffer; phb: WebGLBuffer },
        count: number,
        radius: number,
        tubeRadius: number,
        offset: [number, number, number],
        color: [number, number, number]
      ) {
        gl!.useProgram(ringProg);
        gl!.uniformMatrix4fv(gl!.getUniformLocation(ringProg, "uMVP"), false, mvp);
        gl!.uniform1f(gl!.getUniformLocation(ringProg, "uTime"), t);
        gl!.uniform1f(gl!.getUniformLocation(ringProg, "uRadius"), radius);
        gl!.uniform1f(gl!.getUniformLocation(ringProg, "uTubeRadius"), tubeRadius);
        gl!.uniform3fv(gl!.getUniformLocation(ringProg, "uOffset"), offset);
        gl!.uniform3fv(gl!.getUniformLocation(ringProg, "uColor"), color);
        const rpAttr = gl!.getAttribLocation(ringProg, "aPosition");
        const rphAttr = gl!.getAttribLocation(ringProg, "aPhase");
        gl!.enableVertexAttribArray(rpAttr);
        gl!.enableVertexAttribArray(rphAttr);
        gl!.bindBuffer(gl!.ARRAY_BUFFER, bufs.pb);
        gl!.vertexAttribPointer(rpAttr, 2, gl!.FLOAT, false, 0, 0);
        gl!.bindBuffer(gl!.ARRAY_BUFFER, bufs.phb);
        gl!.vertexAttribPointer(rphAttr, 1, gl!.FLOAT, false, 0, 0);
        gl!.drawArrays(gl!.POINTS, 0, count);
        gl!.disableVertexAttribArray(rpAttr);
        gl!.disableVertexAttribArray(rphAttr);
      }

      // Main portal ring
      drawRing(r1Bufs, ring1.count, 4.0, 0.12, [0, 0, 0], [0.48, 0.72, 1.0]);
      // Outer ring
      drawRing(r2Bufs, ring2.count, 5.5, 0.06, [0, 0, 0], [0.78, 0.5, 0.86]);
      // Inner energy ring
      drawRing(r3Bufs, ring3.count, 2.8, 0.04, [0, 0, 0], [0.9, 0.31, 0.63]);

      // --- Draw floating shapes ---
      gl!.useProgram(shapeProg);
      gl!.uniformMatrix4fv(gl!.getUniformLocation(shapeProg, "uMVP"), false, mvp);
      gl!.uniform1f(gl!.getUniformLocation(shapeProg, "uTime"), t);
      const spAttr = gl!.getAttribLocation(shapeProg, "aPosition");
      gl!.enableVertexAttribArray(spAttr);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, shapeBuf);
      gl!.vertexAttribPointer(spAttr, 3, gl!.FLOAT, false, 0, 0);

      const shapes = [
        { center: [0, 0, -15], radius: 6, speed: 0.15, phase: 0, color: [0.48, 0.72, 1.0] },
        { center: [0, -2, -25], radius: 8, speed: 0.1, phase: 2.1, color: [0.78, 0.5, 0.86] },
        { center: [0, 1, -35], radius: 5, speed: 0.2, phase: 4.2, color: [0.9, 0.31, 0.63] },
        { center: [0, -1, -45], radius: 7, speed: 0.12, phase: 1.0, color: [0.78, 0.49, 1.0] },
        { center: [0, 0.5, -55], radius: 4, speed: 0.18, phase: 3.5, color: [0.55, 0.65, 1.0] },
      ];

      for (const s of shapes) {
        gl!.uniform3fv(gl!.getUniformLocation(shapeProg, "uCenter"), s.center as [number, number, number]);
        gl!.uniform1f(gl!.getUniformLocation(shapeProg, "uOrbitRadius"), s.radius);
        gl!.uniform1f(gl!.getUniformLocation(shapeProg, "uOrbitSpeed"), s.speed);
        gl!.uniform1f(gl!.getUniformLocation(shapeProg, "uOrbitPhase"), s.phase);
        gl!.uniform3fv(gl!.getUniformLocation(shapeProg, "uColor"), s.color as [number, number, number]);
        gl!.drawArrays(gl!.POINTS, 0, octa.count);
      }
      gl!.disableVertexAttribArray(spAttr);

      animRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [state]);

  useEffect(() => {
    const cleanup = init();
    return () => cleanup?.();
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}