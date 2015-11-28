precision highp float;

#define PI 3.1415926535897932384626433832795

attribute vec2 coordinate;

uniform float scale;
uniform vec2 offset;
uniform vec2 dimensions;
uniform vec4 color;
uniform float alpha;
uniform float pointSize;

varying vec4 fragColor;

void main() {
  vec2 point = offset + coordinate * scale;
  vec2 position = (point / dimensions * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = pointSize;
  fragColor = color;
}