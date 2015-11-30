precision highp float;

varying vec4 fragColor;

void main() {
  // Uncommon to draw points as circles instead of squares.
  // if (distance(gl_PointCoord.st, vec2(0.5, 0.5)) > 0.5) {
  //   discard;
  // }
  gl_FragColor = fragColor;
}