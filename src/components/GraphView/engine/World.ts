import { mat4 } from 'gl-matrix';
import { GLObject } from '../webgl/GLObject';

export type WorldObject = {
  object: GLObject,
  worldTransform: mat4
};

export class World {
  objects: WorldObject[] = [];

  addObjectAtOrigin(object: GLObject) {
    this.objects.push({
      object,
      worldTransform: mat4.create(),
    });
  }

  addObject(object: GLObject, worldTransform: mat4) {
    this.objects.push({
      object,
      worldTransform,
    });
  }

  getObjects(): WorldObject[] {
    return this.objects;
  }

  clearObjects() {
    this.objects = []
  }
}
