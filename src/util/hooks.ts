import { DependencyList, Ref, useEffect, useRef, useState } from 'react';

export function useAnimationFrame(
  callback: (dt: number) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    let frame = requestAnimationFrame(onFrame);
    let lastFrame = 0;

    function onFrame(ts: number): void {
      frame = requestAnimationFrame(onFrame);
      callback(ts - lastFrame);
      lastFrame = ts;
    }

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, callback]);
}

export type InitCallback = (gl: WebGLRenderingContext) => void;
export type FrameCallback = (gl: WebGLRenderingContext, dt: number) => void;

export function useViewport(
  initCallback: InitCallback,
  frameCallback: FrameCallback,
  deps: DependencyList = []
): { canvasRef: Ref<HTMLCanvasElement> } {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gl, setGL] = useState<WebGLRenderingContext | null>(null);

  useAnimationFrame(
    dt => {
      if (!gl || gl.canvas !== canvasRef.current) {
        if (canvasRef.current) {
          const newGL = canvasRef.current.getContext('webgl');
          if (!newGL) {
            throw new Error('Could not create WebGL context');
          }
          initCallback(newGL);
          setGL(newGL);
        }
        return;
      }

      if (
        gl.canvas.width !== window.innerWidth ||
        gl.canvas.height !== window.innerHeight
      ) {
        gl.canvas.width = window.innerWidth;
        gl.canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }

      frameCallback(gl, dt);
    },
    [...deps, gl]
  );

  return { canvasRef };
}
