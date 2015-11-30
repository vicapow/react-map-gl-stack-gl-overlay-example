'use strict';

var document = require('global/document');
var window = require('global/window');
var console = require('global/console');
var React = require('react');
var Immutable = require('immutable');
var r = require('r-dom');
var MapGL = require('react-map-gl');
var ExampleOverlay = require('../example-overlay');
var assign = require('object-assign');
var d3 = require('d3');

// Don't show tiles in the map.
var mapStyle = Immutable.fromJS({
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'background-color': 'black'
      }
    }
  ]
});

var App = React.createClass({

  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,
      viewport: {
        latitude: 40.74,
        longitude: -73.97,
        zoom: 12
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

    d3.xhr('./pickups-1m.csv.binary')
      .responseType('arraybuffer')
      .get(function response(error, xhr) {
        if (error) {
          throw error;
        }
        var payload = new Float32Array(xhr.response);
        var trips = [];
        var index = 0;
        while (index < payload.length) {
          trips.push([payload[index++], payload[index++]]);
        }
        /* eslint-disable no-console */
        console.log('num trips', trips.length);
        /* eslint-enable no-console */
        this.setState({trips: trips});
      }.bind(this));
  },

  _onChangeViewport: function _onChangeViewport(viewport) {
    viewport.zoom = d3.round(viewport.zoom, 4);
    this.setState({viewport: viewport});
  },

  render: function render() {
    var props = assign({}, this.state.viewport, {
      width: this.state.appWidth,
      height: this.state.appHeight,
      mapStyle: mapStyle,
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
