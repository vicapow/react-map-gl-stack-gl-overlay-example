'use strict';

var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var window = require('global/window');
var r = require('r-dom');
var getContext = require('get-canvas-context');
var glslify = require('glslify');
var createShader = require('gl-shader');
var createVAO = require('gl-vao');
var createBuffer = require('gl-buffer');

var PI = Math.PI;
var DEGREES_TO_RADIANS = PI / 180;

function radians(degrees) {
  return degrees * DEGREES_TO_RADIANS;
}

// Convert a JavaScript double precision Number to the equivalent single
// precision value.
function float(value) {
  var array = new Float32Array(1);
  array[0] = value;
  return array[0];
}

// Split a Number of double precision into two Numbers of single precision.
function split(a) {
  var tHi = float(a);
  var tLo = a - tHi;
  return [tHi, tLo];
}

var CanvasOverlay = React.createClass({

  displayName: 'StackGLOverlay',

  mixins: [PureRenderMixin],

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    zoom: React.PropTypes.number.isRequired,
    latitude: React.PropTypes.number.isRequired,
    longitude: React.PropTypes.number.isRequired,
    isDragging: React.PropTypes.bool,
    locations: React.PropTypes.array.isRequired,
    lngLatAccessor: React.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      lngLatAccessor: function defaultLocationAccessor(location) {
        return location;
      }
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.locations !== this.props.locations) {
      this._updateVAO();
    }
  },

  _getLocationsBufferArray: function _getLocationsBufferArray() {
    var ret = [];
    var locations = this.props.locations || [];
    var location;
    var x;
    var y;
    var phi;
    var lamda;
    for (var i = 0; i < locations.length; i++) {
      location = this.props.lngLatAccessor(locations[i]);
      lamda = radians(location[0]);
      phi = radians(location[1]);
      // [0, 1]
      x = (lamda + Math.PI) / Math.PI * 0.5;
      // [0, 1]
      y = (PI + Math.log(Math.tan(PI * 0.25 + phi * 0.5))) / Math.PI * 0.5;
      ret.push(x);
      ret.push(y);
    }
    return ret;
  },

  _updateVAO: function _updateVAO() {
    var gl = this._ctx;
    if (this._vao) {
      this._vao.dispose();
    }
    this._vao = createVAO(gl, [{
      buffer: createBuffer(gl, this._getLocationsBufferArray()),
      type: gl.FLOAT,
      size: 2
    }]);
  },

  componentDidMount: function componentDidMount() {
    var gl = this._ctx = getContext('webgl', {canvas: this.getDOMNode()});
    this._shader = createShader(gl,
      glslify('./main.vertex.glsl'),
      glslify('./main.fragment.glsl'));
    this._shader.attributes.coordinate.location = 0;
    this._updateVAO();
    this._redraw();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._redraw();
  },

  _redraw: function _redraw() {
    var gl = this._ctx;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.enable(gl.BLEND);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this._shader.bind();
    var lnglat = [this.props.longitude, this.props.latitude];
    var zoom = this.props.zoom;
    var tileSize = 512;
    var scale = tileSize * Math.pow(2, zoom);
    var lambda = radians(lnglat[0]);
    var phi = radians(lnglat[1]);
    var x = (lambda + Math.PI) / Math.PI * 0.5;
    var y = (PI + Math.log(Math.tan(PI * 0.25 + phi * 0.5))) / Math.PI * 0.5;
    this._shader.uniforms.alpha = 0.001;
    this._shader.uniforms.pointSize = 1;
    this._shader.uniforms.scale = split(scale);
    this._shader.uniforms.center = split(x).concat(split(y));
    this._shader.uniforms.dimensions = [this.props.width, this.props.height];
    this._shader.uniforms.color = [231 / 255, 76 / 255, 60 / 255, 1];
    this._vao.bind();
    this._vao.draw(gl.POINTS, this.props.locations.length);
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
