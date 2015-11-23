precision highp float;

varying vec4 fragColor;

void main() {
  if (distance(gl_PointCoord.st, vec2(0.5, 0.5)) > 0.5) {
    discard;
  }
  gl_FragColor = fragColor;
}