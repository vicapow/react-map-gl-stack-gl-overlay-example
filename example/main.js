'use strict';

var document = require('global/document');
var Immutable = require('immutable');
var window = require('global/window');
var React = require('react');
var r = require('r-dom');
var MapGL = require('react-map-gl');
var process = require('global/process');
var ExampleOverlay = require('../example-overlay');
var assign = require('object-assign');
var d3 = require('d3');

// var locations = require('example-cities');

// This will get converted to a string by envify
/* eslint-disable no-process-env */
var mapboxApiAccessToken = process.env.MapboxAccessToken;
/* eslint-enable no-process-env */

var App = React.createClass({

  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,
      viewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0
      }
    };
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', function onResize() {
      this.setState({
        appWidth: window.innerWidth,
        appHeight: window.innerHeight
      });
    }.bind(this));
    d3.csv('/picks.csv', function accessor(row) {
      return [Number(row.longitude), Number(row.latitude)];
    }, function response(error, trips) {
      if (error) {
        throw error;
      }
      this.setState({trips: trips});
    }.bind(this));
  },

  _onChangeViewport: function _onChangeViewport(viewport) {
    this.setState({viewport: viewport});
  },

  render: function render() {
    var props = assign({}, this.state.viewport, {
      width: this.state.appWidth,
      height: this.state.appHeight,
      mapboxApiAccessToken: mapboxApiAccessToken,
      onChangeViewport: this._onChangeViewport
    });
    return r(MapGL, props, [
      this.state.trips ? r(ExampleOverlay, {
        locations: this.state.trips,
        lngLatAccessor: this._tripLngLatAccessor,
        zoom: this.state.viewport.zoom,
        longitude: this.state.viewport.longitude,
        latitude: this.state.viewport.latitude
      }) : null
    ]);
  }
});
document.body.style.margin = 0;
React.render(r(App), document.body);
