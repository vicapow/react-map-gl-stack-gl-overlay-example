precision highp float;

void main() {
  if (distance(gl_PointCoord.st, vec2(0.5, 0.5)) > 0.5) {
    discard;
  }
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}