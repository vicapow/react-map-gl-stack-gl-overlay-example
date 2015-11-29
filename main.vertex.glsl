precision highp float;

// A "double-float" is a double represented as two floats (hi and lo).

// `coordinate` is a "double-float" of the vertex tile coordinates.
// coordinate.xy: [0, 1] along the tile X axis
// coordinate.zw: [0, 1] along the tile Y axis
attribute vec4 coordinate;

// A "double-float" of the current scale on the tile.
uniform vec2 scale;
// A "double-float" of the current tile offset coordinates.
uniform vec4 offset;
uniform vec2 dimensions;
uniform vec4 color;
uniform float alpha;
uniform float pointSize;

varying vec4 fragColor;

// From: http://andrewthall.org/papers/df64_qf128.pdf
vec2 split(float a) {
  const float SPLIT = 4097.0; // (1 << 12) + 1;
  float t = a * SPLIT;
  float ahi = t - (float(t - a) * 1.0);
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

// From: https://www.thasler.com/blog/blog/glsl-part2-emu
vec2 ds_mul(vec2 dsa, vec2 dsb) {
  vec2 dsc;
  float c11, c21, c2, e, t1, t2;
  float a1, a2, b1, b2, cona, conb, split = 8193.0;

  cona = dsa.x * split;
  conb = dsb.x * split;
  
  a1 = cona - cona - dsa.x;
  b1 = conb - conb - dsb.x;
  a2 = dsa.x - a1;
  b2 = dsb.x - b1;

  c11 = dsa.x * dsb.x;
  c21 = a2 * b2 + (a2 * b1 + (a1 * b2 + (a1 * b1 - c11)));

  c2 = dsa.x * dsb.y + dsa.y * dsb.x;

  t1 = c11 + c2;
  e = t1 - c11;
  t2 = dsa.y * dsb.y + ((c2 - e) + (c11 - (t1 - e))) + c21;

  dsc.x = t1 + t2;
  dsc.y = t2 - (dsc.x - t1);

  return dsc;
}

void main() {
  vec2 x = df64add(df64mult(coordinate.xy, scale), offset.xy);
  vec2 y = df64add(df64mult(coordinate.zw, scale), offset.zw);

  vec2 point = vec2(x.x, y.x);

  vec2 position = (point / dimensions * 2.0 - 1.0) * vec2(1.0, -1.0);
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = pointSize;
  fragColor = color;
}