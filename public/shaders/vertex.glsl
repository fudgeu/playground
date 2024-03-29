attribute vec4 aVertexPosition;
attribute vec2 aUV;

uniform mat4 uModelViewMatrix;
uniform mat4 uWorldMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 uv;

void main(void) {
    gl_Position = uProjectionMatrix * uWorldMatrix * uModelViewMatrix * aVertexPosition;

    // vFragPos = vec3(uModelViewMatrix * aVertexPosition);
    uv = aUV;
}
