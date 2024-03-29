import { mat4 } from 'gl-matrix';
import { MeshWithBuffers } from 'webgl-obj-loader';

export type GLObject = {
  buffers: MeshWithBuffers,
  localTransform: mat4
  rendererId: string
};

export function createObject(buffers: MeshWithBuffers, rendererId: string): GLObject | null {
  return {
    buffers,
    localTransform: mat4.create(),
    rendererId,
  };
}
