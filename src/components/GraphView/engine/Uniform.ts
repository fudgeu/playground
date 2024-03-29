import {ProgramInfo} from "../webgl/GLShaders.ts";
import {mat4} from "gl-matrix";

export function setUniform(gl: WebGLRenderingContext, shaderProgram: ProgramInfo, uniformName: string, value: mat4) {
  const location = shaderProgram.uniformLocations[uniformName]
  if (location == null) return
  gl.uniformMatrix4fv(location, false, value)
}

export function setUniformFloat(gl: WebGLRenderingContext, shaderProgram: ProgramInfo, uniformName: string, value: number) {
  const location = shaderProgram.uniformLocations[uniformName]
  if (location == null) return
  gl.uniform1f(location, value)
}
