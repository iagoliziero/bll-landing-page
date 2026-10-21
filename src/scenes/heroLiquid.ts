import { onFrame } from "@/lib/loop";

// Foto líquida do hero, em WebGL puro.
// Uma textura de rastro (180px de largura, na proporção do hero) recebe a cada
// quadro um pincel radial na posição do cursor, com raio de 13% da largura e
// intensidade proporcional à velocidade, e esmaece 5,5% por quadro. O shader
// desloca a foto pelo gradiente do rastro, soma uma ondulação senoidal leve,
// separa os canais RGB perto da onda e tinge de verde de leve.

const TRAIL_WIDTH = 180;
const FADE_PER_FRAME = 0.055;
const IDLE_SECONDS = 2.5;

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D uTex;
uniform sampler2D uTrail;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uPos;
uniform float uTime;
varying vec2 vUv;

// object-fit: cover com object-position uPos
vec2 cover(vec2 p) {
  vec2 s = uRes / uImg;
  float k0 = max(s.x, s.y);
  vec2 k = uRes / (uImg * k0);
  return (p - 0.5) * k + 0.5 + (uPos - 0.5) * (1.0 - k);
}

void main() {
  float e = 1.0 / ${TRAIL_WIDTH.toFixed(1)};
  float trail = texture2D(uTrail, vUv).r;
  vec2 grad = vec2(
    texture2D(uTrail, vUv + vec2(e, 0.0)).r - texture2D(uTrail, vUv - vec2(e, 0.0)).r,
    texture2D(uTrail, vUv + vec2(0.0, e)).r - texture2D(uTrail, vUv - vec2(0.0, e)).r
  );
  vec2 d = grad * 0.09 + vec2(sin(vUv.y * 38.0 + uTime * 2.6), cos(vUv.x * 38.0 + uTime * 2.6)) * trail * 0.006;
  float split = trail * 0.014;
  vec3 color;
  color.r = texture2D(uTex, cover(vUv - d * 1.25 + vec2(split, 0.0))).r;
  color.g = texture2D(uTex, cover(vUv - d)).g;
  color.b = texture2D(uTex, cover(vUv - d * 0.75 - vec2(split, 0.0))).b;
  color += vec3(0.06, 0.13, 0.1) * trail;
  gl_FragColor = vec4(color, 1.0);
}`;

type Options = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  // Elemento que a cena acompanha em tamanho (o mesmo da foto)
  frame: HTMLElement;
  // object-position da foto (60% 40%), em coordenadas de textura
  position: [number, number];
};

export type HeroLiquid = {
  setVisible: (visible: boolean) => void;
  destroy: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createTexture(gl: WebGLRenderingContext, unit: number) {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

export function createHeroLiquid({ canvas, image, frame, position }: Options): HeroLiquid | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // Um retângulo que cobre a tela inteira
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const uRes = uniform("uRes");
  const uTime = uniform("uTime");

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const photoTexture = createTexture(gl, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  const trailTexture = createTexture(gl, 1);
  gl.uniform1i(uniform("uTex"), 0);
  gl.uniform1i(uniform("uTrail"), 1);
  gl.uniform2f(uniform("uImg"), image.naturalWidth, image.naturalHeight);
  gl.uniform2f(uniform("uPos"), position[0], position[1]);

  const trail = document.createElement("canvas");
  const trailContext = trail.getContext("2d");
  if (!trailContext) return null;

  let width = 0;
  let height = 0;
  // Posição do ponteiro em px da tela (para a velocidade) e normalizada sobre a
  // foto (para o pincel). A foto é medida no evento do ponteiro, não a cada
  // quadro, para não forçar o navegador a recalcular o layout na animação.
  let pointerX = 0;
  let pointerY = 0;
  let pointerU = 0;
  let pointerV = 0;
  let lastX = 0;
  let lastY = 0;
  let hasPointer = false;
  let idle = 0;
  let visible = true;

  const clearTrail = () => {
    trailContext.fillStyle = "#000";
    trailContext.fillRect(0, 0, trail.width, trail.height);
  };

  const uploadTrail = () => {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, trailTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, trail);
  };

  const draw = (time: number) => {
    // Em módulo para o seno não perder precisão com o site aberto por horas
    gl.uniform1f(uTime, time % 600);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const resize = () => {
    width = frame.clientWidth;
    height = frame.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, width, height);
    trail.width = TRAIL_WIDTH;
    trail.height = Math.max(60, Math.round((TRAIL_WIDTH * height) / width));
    clearTrail();
    uploadTrail();
    draw(0);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    const rect = frame.getBoundingClientRect();
    pointerU = (pointerX - rect.left) / rect.width;
    pointerV = (pointerY - rect.top) / rect.height;
    if (!hasPointer) {
      lastX = pointerX;
      lastY = pointerY;
      hasPointer = true;
    }
    idle = 0;
  };
  const onPointerLeave = () => {
    hasPointer = false;
  };

  const stopFrame = onFrame((time, deltaTime) => {
    if (!visible || idle > IDLE_SECONDS) return;
    idle += deltaTime;
    const steps = deltaTime * 60;

    // Esmaecimento, igual a 5,5% por quadro a 60 fps em qualquer taxa de quadros
    trailContext.fillStyle = `rgba(0,0,0,${(1 - Math.pow(1 - FADE_PER_FRAME, steps)).toFixed(4)})`;
    trailContext.fillRect(0, 0, trail.width, trail.height);

    if (hasPointer) {
      const speed = Math.hypot(pointerX - lastX, pointerY - lastY) / Math.max(steps, 0.0001);
      const x = pointerU * trail.width;
      const y = pointerV * trail.height;
      const radius = trail.width * 0.13;
      const alpha = Math.min(1, speed / 30) * 0.55 + 0.06;
      const brush = trailContext.createRadialGradient(x, y, 0, x, y, radius);
      brush.addColorStop(0, `rgba(255,255,255,${alpha.toFixed(3)})`);
      brush.addColorStop(1, "rgba(255,255,255,0)");
      trailContext.fillStyle = brush;
      trailContext.beginPath();
      trailContext.arc(x, y, radius, 0, Math.PI * 2);
      trailContext.fill();
      lastX = pointerX;
      lastY = pointerY;
    }

    // Parado há um tempo: limpa o resto do rastro e deixa a foto limpa
    if (idle > IDLE_SECONDS) clearTrail();
    uploadTrail();
    draw(time);
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(frame);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  resize();

  return {
    setVisible(next) {
      visible = next;
    },
    destroy() {
      stopFrame();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteTexture(photoTexture);
      gl.deleteTexture(trailTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
