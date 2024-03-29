import {ExtendedGLBuffer} from "webgl-obj-loader";

export function setAttribute(gl: WebGLRenderingContext, location: number, buffer: ExtendedGLBuffer) {
  const numComponents = buffer.itemSize
  const type = gl.FLOAT; // The data in the buffer are 32-bit floats
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Give webgl our buffer
  gl.vertexAttribPointer( // Tell webgl how to read the buffer and where to set it,
    location,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(location);
}

export function setAttributeExplicit(gl: WebGLRenderingContext, location: number, buffer: WebGLBuffer, vectorSize: number) {
  const numComponents = vectorSize
  const type = gl.FLOAT; // The data in the buffer are 32-bit floats
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Give webgl our buffer
  gl.vertexAttribPointer( // Tell webgl how to read the buffer and where to set it,
    location,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(location);
}

