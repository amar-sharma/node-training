var async = require('async');
var http = require('http');
var b = require('bl');
var compl = 0;
var results = [];
var getData = function(url, i, callback) {
  http.get(url, function(response, data) {
    response.setEncoding('utf8');
    response.pipe(b(function(err, data) {
      data = data.toString();
      results[i] = data;
      compl++;
      callback();
    }));
  });
}

for (i = 0; i < 3; i++) {
  getData(process.argv[2 + i], i, compute);
}

function compute() {
  if (compl == 3) {
    for (i = 0; i < 3; i++) {
      console.log(results[i]);
    }
  }
}