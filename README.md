# react-map-gl-stack-gl-overlay-example

An experiment in using stackGL in a
[react-map-gl](https://github.com/uber/react-map-gl) overlay.

![](demo.gif)

This demo uses data from http://www.andresmh.com/nyctaxitrips/

## Usage

````js
    render: function render() {
      return <MapGL ...viewportProps>
        <ExampleOverlay
          latitude={viewportProps.latitude}
          longitude={viewportProps.longitude}
          zoom={viewportProps.zoom}
          locations={locations} />
      </MapGL>;
    }
````

See example/main.js for a full example

## Passing Tile Coordinates to GPU

This has evolved into a larger experiment in passing projected tile coordinates
directly to the GPU as a performance optimization. It represents each tile
coordinate as a double using two float values and uses the double-float
functions from [Andrew Thall](http://andrewthall.org/)'s
[Extended-Precision Floating-Point Numbers for GPU Computation](http://andrewthall.org/papers/df64_qf128.pdf).


## To install

    npm install

## To run

    npm run start

This will start a budo server running on localhost:9966.
