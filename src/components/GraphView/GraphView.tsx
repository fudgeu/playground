import styles from './GraphView.module.css';
import {useCallback, useEffect, useRef, useState} from "react";
import {loadModel, loadShader, registerRenderer, renderObject, startRender} from "./engine/Engine.ts";
import {MeshWithBuffers} from "webgl-obj-loader";
import {ProgramInfo} from "./webgl/GLShaders.ts";
import {GridRenderer} from "./grid/GridRenderer.ts";
import {World} from "./engine/World.ts";
import {createObject, GLObject} from "./webgl/GLObject.ts";
import {mat4} from "gl-matrix";

type TransformObject = {
  transform: 'translate' | 'scale' | 'rotate' | 'skew',
  x: number,
  y: number,
  z: number,
}

const transformStack: TransformObject[] = [
  {
    transform: "translate",
    x: 1,
    y: 1,
    z: 0,
  }
]

function applyTransforms(transforms: TransformObject[]) {
  const result = mat4.create()
  mat4.scale(result, result, [0.1, 0.1, 0.1])
  mat4.rotate(result, result, Math.PI/2, [0, 1, 0])

  transforms.forEach((transform) => {
    switch (transform.transform) {
      case "translate": {
        mat4.translate(result, result, [transform.x, transform.y, transform.z])
      }
    }
  })

  return result
}

export default function GraphView() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas properties
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const animationRequestRef = useRef<number>()

  // Models and shaders
  const models = useRef<{[key: string]: MeshWithBuffers}>({})
  const shaders = useRef<{[key: string]: ProgramInfo}>({})

  // World
  const world = useRef<World>(new World())
  const playPlane = useRef<GLObject>()

  // Render
  const render = useCallback((time: number, gl: WebGLRenderingContext) => {
    if (world.current == null) return

    const playPlaneObj = playPlane.current
    if (playPlaneObj != null) {
      playPlaneObj.localTransform = applyTransforms(transformStack)
    }

    startRender(gl)

    world.current.objects.forEach((worldObject) => {
      renderObject(gl, worldObject)
    })
    animationRequestRef.current = requestAnimationFrame(
      (newTime) => render(newTime, gl),
    );
  }, [world]);

  // GL Init
  useEffect((): () => void => {
    // Get GL context
    const gl = canvasRef.current?.getContext('webgl');
    if (gl == null) return () => {};

    // Set extensions and clear screen
    gl.getExtension('OES_standard_derivatives')
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Load models
    Promise.all([
      loadModel(gl, 'cube', './models/cube.obj'),
      loadModel(gl, 'plane', './models/plane.obj'),
    ])
      .then((results) => {
        // Register each loaded model
        results.forEach(([id, model]) => {
          if (models.current == null) return
          models.current[id] = model;
        });
        // loadWorld(gl, loadedModels);
      })
      .catch((err) => {
        console.error(`Failed to load 3D models: ${err}`);
      });

    // Load shaders
    Promise.all([
      loadShader(gl, 'gridProgram', './shaders/vertex.glsl', './shaders/fragment.glsl'),
      loadShader(gl, 'planeProgram', './shaders/generic/vertex.glsl', './shaders/generic/fragment.glsl')
    ])
      .then((results) => {
        // Register each shader
        results.forEach(([id, programInfo]) => {
          console.log(`loaded ${id}`)
          console.log(programInfo.uniformLocations)
          if (shaders.current == null) return
          shaders.current[id] = programInfo
        })

        // Create a renderer for each shader
        if (shaders.current != null) {
          registerRenderer("gridRenderer", new GridRenderer(shaders.current['gridProgram']))
          registerRenderer("planeRenderer", new GridRenderer(shaders.current['planeProgram']))
        }

        // Add a cube to the world
        const cubeModel = models.current?.['plane']
        if (cubeModel != null) {
          const obj = createObject(cubeModel, 'gridRenderer')
          if (obj == null) return
          mat4.scale(obj.localTransform, obj.localTransform, [2, 2, 2])
          mat4.rotate(obj.localTransform, obj.localTransform, Math.PI/2, [0, 1, 0])
          const shape2Pos = mat4.create();
          mat4.translate(shape2Pos, shape2Pos, [0, 0, -10]);
          world.current?.addObject(obj, shape2Pos)

          // Add transform plane to world
          const playPlaneObj = createObject(cubeModel, 'planeRenderer')
          if (playPlaneObj == null) return
          mat4.scale(playPlaneObj.localTransform, playPlaneObj.localTransform, [0.1, 0.1, 0.1])
          mat4.rotate(playPlaneObj.localTransform, playPlaneObj.localTransform, Math.PI/2, [0, 1, 0])
          const playPlaneWorldPos = mat4.create();
          mat4.translate(playPlaneWorldPos, playPlaneWorldPos, [0, 0, -9.999])
          world.current?.addObject(playPlaneObj, playPlaneWorldPos)
          playPlane.current = playPlaneObj
        }

        // Start rendering
        animationRequestRef.current = requestAnimationFrame(
          (time) => render(time, gl),
        );
      })
      .catch((err) => {
        console.error(`Failed load shaders: ${err}`)
      })

    return () => {
      if (animationRequestRef.current == null) return;
      cancelAnimationFrame(animationRequestRef.current);
    };
  }, [loadShader, loadModel, render]);

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      setContainerDimensions({ width: containerRef.current?.clientWidth ?? 0, height: containerRef.current?.clientHeight ?? 0 });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render canvas
  return (
    <div className={styles.container} ref={containerRef}>
      <canvas className={styles.canvas} width={containerDimensions.width} height={containerDimensions.height} ref={canvasRef} />
    </div>
  )
}
