var http = require('http');
var b = require('bl');
http.get(process.argv[2], function(response) {
  response.setEncoding('utf8');
  response.pipe(b(function(err, data) {
    data = data.toString();
    console.log(data.length);
    console.log(data);
  }))
});