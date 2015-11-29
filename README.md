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

## Experiment: Passing tile coordinates to the GPU

This has evolved into a larger experiment in passing tile coordinates to the GPU
as a performance optimization. It represents each tile coordinate as a double
using two float values and uses the double-float functions from [Andrew Thall](http://andrewthall.org/)'s
[Extended-Precision Floating-Point Numbers for GPU Computation](http://andrewthall.org/papers/df64_qf128.pdf).
However, there seem to be issues with double-float multiplication that are causing jitter while zooming at hi zoom levels but panning works well.

Panning demo

![](lng-lat-pan-no-jitter.gif)

Zomming jitter demo

![](lng-lat-jitter.gif)

The same thing happens when we use the double multiplication from: [Henry Thasler](https://www.thasler.com/)'s post [Heavy computing with GLSL – Part 2: Emulated double precision](https://www.thasler.com/blog/blog/glsl-part2-emu) which itself was originally from the [DSFUN90 Library](http://crd-legacy.lbl.gov/~dhbailey/mpdist/).

This might be caused by the GLSL compiler optimizing away things like `float ahi = t - (t - a);`.  This idea was original mentioned by [Mikael Hvidtfeldt Christensen](http://blog.hvidtfeldts.net/index.php/about/) in his [Double Precision in OpenGL and WebGL](http://blog.hvidtfeldts.net/index.php/2012/07/double-precision-in-opengl-and-webgl/).

But interestingly, if we replace `float ahi = t - (t - a);` with `float ahi = -a;`, we see slightly more jitter. If the GLSL compiler was optimizing this away, we'd expect to see the same amount of jitter.

![](lng-lat-check-for-optimization.gif)

## To install

    npm install

## To run

    npm run start
