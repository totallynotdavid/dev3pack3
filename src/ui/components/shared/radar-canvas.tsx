"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

const vec3 bgColor = vec3(0.094, 0.094, 0.106);
const vec3 sweepColor = vec3(1.0, 0.34, 0.13);
const vec3 gridColor = vec3(0.3, 0.3, 0.3);

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  float radius = length(uv);
  float angle = atan(uv.y, uv.x);

  vec3 color = bgColor;

  float ringSpacing = 0.25;
  float ringThickness = 0.01;
  float ringVal = mod(radius, ringSpacing);
  if (ringVal < ringThickness && radius < 0.95) {
    color = mix(color, gridColor, 0.2);
  }

  float sweepSpeed = u_time * 1.5;
  float sweepAngle = mod(angle - sweepSpeed, PI * 2.0);

  float sweepIntesity = 1.0 - (sweepAngle / (PI * 1.5));
  sweepIntesity = clamp(sweepIntesity, 0.0, 1.0);

  if (sweepAngle < 0.05) sweepIntesity = 2.0;

  if (radius < 0.98) {
    color = mix(color, sweepColor, sweepIntesity * 0.15);
  }

  vec2 blipGrid = floor(uv * 5.0);
  if (random(blipGrid) > 0.95 && radius < 0.9) {
    float blipAngle = atan((blipGrid.y + 0.5) / 5.0, (blipGrid.x + 0.5) / 5.0);
    float distToSweep = mod(blipAngle - sweepSpeed, PI * 2.0);
    if (distToSweep > 0.0 && distToSweep < 0.5) {
      float flash = 1.0 - (distToSweep / 0.5);
      color = mix(color, vec3(1.0), flash * 0.8);
    }
  }

  float grain = random(uv * u_time) * 0.05;
  color += grain;

  float vignette = smoothstep(0.8, 1.0, radius);
  color = mix(color, vec3(0.0), vignette * 0.8);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
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

export function RadarCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(1, Math.floor(w * dpr));
      const targetH = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    };

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionLoc = gl.getAttribLocation(program, "position");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    window.addEventListener("resize", resize);
    resize();

    const render = (timeMs: number) => {
      resize();
      const t = timeMs * 0.001;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeLoc, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className}`} />;
}
