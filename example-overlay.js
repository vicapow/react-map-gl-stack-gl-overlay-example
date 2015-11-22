'use strict';

var React = require('react');
var window = require('global/window');
var r = require('r-dom');
var getContext = require('get-canvas-context');
var glslify = require('glslify');
var createShader = require('gl-shader');
var createVAO = require('gl-vao');
var createBuffer = require('gl-buffer');

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
    this._shader = createShader(gl,
      glslify('./main.vertex.glsl'),
      glslify('./main.fragment.glsl'));
    this._shader.attributes.position.location = 0;
    this._vao = createVAO(gl, [{
      buffer: createBuffer(gl, [-0.5, -0.5, 0.5, 0.5]),
      type: gl.FLOAT,
      size: 2
    }]);
    this._redraw();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._redraw();
  },

  _redraw: function _redraw() {
    var gl = this._ctx;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this._shader.bind();
    this._vao.bind();
    this._vao.draw(gl.POINTS, 2);
    this._vao.unbind();
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
