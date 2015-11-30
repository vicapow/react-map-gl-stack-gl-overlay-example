'use strict';

var fs = require('fs');
var d3 = require('d3');
var i;
var picks = fs.readFileSync('./picks.csv', 'utf-8');

var rows = d3.csv.parse(picks);

var ab = new ArrayBuffer(((rows.length - 1) * 2) * 4);
var ret = new Float32Array(ab);

var retIndex = 0;
function push(value) {
  ret[retIndex] = value;
  retIndex++;
}

for (i = 1; i < rows.length; i++) {
  push(rows[i].longitude);
  push(rows[i].latitude);
}

console.log('ab.byteLength', ab.byteLength);
var buffer = new Buffer(ab.byteLength);
for (i = 0; i < ab.byteLength; i++) {
  buffer[i] = ab[i];
}

fs.writeFileSync('./picks.binary', buffer, 'binary');
