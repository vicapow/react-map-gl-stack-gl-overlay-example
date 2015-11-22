# react-map-gl-stack-gl-overlay-example

An example of a standalone react-map-gl-stack-gl-overlay-example

![](screenshot.png)

## Usage

````js
var ExampleOverlay = require('react-map-gl-stack-gl-overlay-example');
var cities = require('example-cities');
````

Where each element in cities looks like: `{latitude, longitude}`.

````js
    render: function render() {
      return <MapGL ...viewportProps>
        <ExampleOverlay locations={cities} />
      </MapGL>;
    }
````