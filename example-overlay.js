'use strict';

var React = require('react');
var window = require('global/window');
var r = require('r-dom');
var getContext = require('get-canvas-context');
var glslify = require('glslify');
var createTexture = require('gl-texture2d');
var createShader = require('gl-shader');
var drawTriangle = require('a-big-triangle');
var baboon = require('baboon-image');

var CanvasOverlay = React.createClass({
  displayName: 'CanvasOverlay',

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    project: React.PropTypes.func,
    isDragging: React.PropTypes.bool
  },

  componentDidMount: function componentDidMount() {
    var gl = this._ctx = getContext('webgl', {canvas: this.getDOMNode()});
    this._shader = createShader(gl, glslify('./main.vertex.glsl'),
      glslify('./main.fragment.glsl'));
    this._shader.attributes.position.location = 0;
    this._texture = createTexture(gl, baboon);
    this._redraw();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._redraw();
  },

  _redraw: function _redraw() {
    var gl = this._ctx;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this._shader.bind();
    this._shader.uniforms.texture = this._texture.bind();
    drawTriangle(gl);
  },

  render: function render() {
    var pixelRatio = window.devicePixelRatio || 1;
    return r.canvas({
      ref: 'overlay',
      width: this.props.width * pixelRatio,
      height: this.props.height * pixelRatio,
      style: {
        width: this.props.width + 'px',
        height: this.props.height + 'px',
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0
      }
    });
  }
});

module.exports = CanvasOverlay;
