import {setUniform} from "../engine/Uniform.ts";
import {Renderer} from "../engine/Engine.ts";
import {ProgramInfo} from "../webgl/GLShaders.ts";
import {setAttribute, setAttributeExplicit} from "../engine/Attribute.ts";
import {WorldObject} from "../engine/World.ts";
import {mat4} from "gl-matrix";

export class GridRenderer implements Renderer {
  constructor(
    public shaderProgram: ProgramInfo
  ) {
    console.log(`Initialized ${shaderProgram}`)
  }

  render(gl: WebGLRenderingContext, worldObject: WorldObject) {
    const { localTransform } = worldObject.object;
    const { worldTransform } = worldObject;

    // Create perspective matrix
    const fov = (60 * Math.PI) / 180;
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    const zNear = 0.00001;
    const zFar = 2000;
    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, fov, aspectRatio, zNear, zFar);

    // Make UV buffer
    const uvCoords = []
    uvCoords.push(-1, 1, 1, 1, 1, -1, -1, -1)
    const uvBuffer = gl.createBuffer();
    if (uvBuffer == null) {
      console.error("Cannot create UV buffer")
      return
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvCoords), gl.STATIC_DRAW);

    // Set attributes
    setAttribute(gl, this.shaderProgram.attribLocations['positions'], worldObject.object.buffers.vertexBuffer)
    setAttributeExplicit(gl, this.shaderProgram.attribLocations['uvs'], uvBuffer, 2)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldObject.object.buffers.indexBuffer);

    gl.useProgram(this.shaderProgram.program)

    // Set uniforms
    setUniform(gl, this.shaderProgram, "projectionMatrix", projMatrix)
    setUniform(gl, this.shaderProgram, "modelViewMatrix", localTransform)
    setUniform(gl, this.shaderProgram, "worldMatrix", worldTransform)

    // Tell gl to draw with everything we have provided
    const vertexCount = worldObject.object.buffers.indexBuffer.numItems;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}
