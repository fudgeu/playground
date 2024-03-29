import {MeshWithBuffers, OBJ} from "webgl-obj-loader";
import initShaderProgram, {ProgramInfo} from "../webgl/GLShaders.ts";
import {WorldObject} from "./World.ts";

export interface Renderer {
  render: (gl: WebGLRenderingContext, worldObject: WorldObject) => void;
}

const registeredRenderers: {[key: string]: Renderer} = {}


export function registerRenderer(id: string, renderer: Renderer) {
  registeredRenderers[id] = renderer
}

export function getRenderer(id: string): Renderer | null {
  return registeredRenderers[id]
}

export async function loadModel(gl: WebGLRenderingContext, id: string, location: string): Promise<[string, MeshWithBuffers]> {
  const response = await fetch(location);
  if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

  const rawObj = await response.text();
  const rawModel = new OBJ.Mesh(rawObj);
  const model = OBJ.initMeshBuffers(gl, rawModel);

  return [id, model];
}

export async function loadShader(gl: WebGLRenderingContext, id: string, vertexSrc: string, fragmentSrc: string,): Promise<[string, ProgramInfo]> {
  const [vertexResponse, fragmentResponse] = await Promise.all([
    fetch(vertexSrc),
    fetch(fragmentSrc),
  ]);

  if (!vertexResponse.ok) throw new Error(`Vertex Shader HTTP Error: ${vertexResponse.status}`);
  if (!fragmentResponse.ok) throw new Error(`Fragment Shader HTTP Error: ${fragmentResponse.status}`);

  const [vertexText, fragmentText] = await Promise.all([
    vertexResponse.text(),
    fragmentResponse.text(),
  ]);

  // Create shader program from source
  const shaderProgram = initShaderProgram(gl, vertexText, fragmentText);

  if (shaderProgram == null) {
    throw new Error('Shader program compilation failed');
  }

  // Grab shader attribute and uniform locations
  // TODO change to smth minecraft style

  const result: ProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      positions: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      uvs: gl.getAttribLocation(shaderProgram, 'aUV'),
      // normals: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
    },
    uniformLocations: {}
  }

  const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
  if (projectionMatrixLocation != null) result.uniformLocations['projectionMatrix'] = projectionMatrixLocation
  const modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
  if (modelViewMatrixLocation != null) result.uniformLocations['modelViewMatrix'] = modelViewMatrixLocation
  const worldMatrixLocation = gl.getUniformLocation(shaderProgram, 'uWorldMatrix')
  if (worldMatrixLocation != null) result.uniformLocations['worldMatrix'] = worldMatrixLocation

  return [id, result]
}

export function startRender(gl: WebGLRenderingContext) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST); // enable depth testing
  gl.enable(gl.BLEND); // enable blending
  gl.depthFunc(gl.LEQUAL); // near objects obscure far objects

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

export function renderObject(gl: WebGLRenderingContext, worldObject: WorldObject) {
  getRenderer(worldObject.object.rendererId)?.render(gl, worldObject)
}
