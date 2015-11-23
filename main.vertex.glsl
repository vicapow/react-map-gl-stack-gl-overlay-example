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

vec2 project(vec2 lngLat) {
  float lamda = radians(lngLat.x);
  float phi = radians(lngLat.y);
  vec2 tilePos = vec2(lamda + PI, PI - log(tan(PI / 4.0 + phi / 2.0)));
  return offset + tilePos * scale;
}

void main() {
  vec2 point = project(coordinate);
  vec2 position = (point / dimensions * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = pointSize;
  fragColor = color;
}