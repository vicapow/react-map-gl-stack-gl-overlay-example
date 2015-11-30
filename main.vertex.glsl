precision highp float;

// A "double-float" is a double represented as two floats (hi and lo).

attribute vec2 coordinate;

// A double-float of the current scale on the tile.
uniform vec2 scale;
// A double-float of the current tile offset coordinates.
uniform vec4 center;
uniform vec2 dimensions;
uniform vec4 color;
uniform float alpha;
uniform float pointSize;

varying vec4 fragColor;

// Originally from: http://andrewthall.org/papers/df64_qf128.pdf
vec2 split(float a) {
  const float SPLIT = 4097.0; // (1 << 12) + 1;
  float t = a * SPLIT;
  float ahi = t - (t - a);
  // float ahi = - a;
  float alo = a - ahi;
  return vec2(ahi, alo);
}

vec2 twoProd(float a, float b) {
  float p = a * b;
  vec2 aS = split(a);
  vec2 bS = split(b);
  float err = ((aS.x * bS.x - p) + aS.x * bS.y + aS.y * bS.x) + aS.y * bS.y;
  return vec2(p, err);
}

vec2 twoSum(float a , float b) {
  float s = a + b;
  float v = s - a;
  float e = (a - (s - v)) + (b - v);
  return vec2(s, e);
}

vec2 quickTwoSum(float a, float b) {
  float s = a + b;
  float e = b - (s - a);
  return vec2(s, e);
}

vec2 df64mult(vec2 a, vec2 b) {
  vec2 p = twoProd(a.x, b.x);
  p.y += a.x * b.y;
  p.y += a.y * b.x;
  return quickTwoSum(p.x, p.y);
}

vec4 twoSumComp(vec2 ari, vec2 bri) {
  vec2 s = ari + bri;
  vec2 v = s - ari;
  vec2 e = (ari - (s - v)) + (bri - v);
  return vec4(s.x, e.x, s.y, e.y);
}

vec2 df64add(vec2 a, vec2 b) {
  vec4 st;
  st = twoSumComp(a, b);
  st.y += st.z;
  st.xy = quickTwoSum(st.x, st.y);
  st.y += st.w;
  st.xy = quickTwoSum(st.x, st.y);
  return st.xy;
}

void main() {
  vec2 centerX = center.xy;
  vec2 centerY = center.zw;

  vec2 coordX = df64mult(df64add(vec2(coordinate.x, 0), -centerX), scale);
  vec2 coordY = df64mult(df64add(vec2(coordinate.y, 0), -centerY), scale);

  vec2 point = vec2(coordX[0], coordY[0]);

  gl_Position = vec4(point / dimensions * 2.0, 0.0, 1.0);
  gl_PointSize = pointSize;
  fragColor = color;
}