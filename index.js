'use strict';

var document = require('global/document');
var window = require('global/window');
var React = require('react');
var Immutable = require('immutable');
var r = require('r-dom');
var MapGL = require('react-map-gl');
var StackGLOverlay = require('react-map-gl-stack-gl-overlay-example');
var assign = require('object-assign');
var d3 = require('d3');

var mapStyle = Immutable.fromJS({
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      minzoom: 0,
      maxzoom: 22,
      layout: {
        visibility: 'visible'
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
        longitude: -73.98,
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
    return r.div([
      r(MapGL, props, [
        this.state.trips ? r(StackGLOverlay, {
          locations: this.state.trips,
          lngLatAccessor: this._tripLngLatAccessor,
          zoom: this.state.viewport.zoom,
          longitude: this.state.viewport.longitude,
          latitude: this.state.viewport.latitude
        }) : null
      ]),
      r.a({
        style: {
          position: 'absolute',
          left: 10,
          top: 10,
          color: 'white',
          fontFamily: 'Helvetica'
        },
        href: 'https://github.com/vicapow/react-map-gl-stack-gl-overlay-example'
      }, 'An example of a react-map-gl overlay created with StackGL'),
      r.span({
        style: {
          position: 'absolute',
          left: 10,
          bottom: 10,
          color: 'white',
          fontFamily: 'Helvetica',
          fontSize: 12
        }
      }, [
        r.span('1 million NYC Taxi pickup locations sampled from '),
        r.a({
          href: 'https://twitter.com/chris_whong'
        }, '@chris_whong\'s'),
        r.span(' '),
        r.a({
          href: 'http://www.andresmh.com/nyctaxitrips/'
        }, 'FOIA request')
      ])
    ]);
  }
});
document.body.style.margin = 0;
React.render(r(App), document.body);
