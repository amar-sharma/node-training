var http = require('http');
var map = require('through2-map');
var url = require('url');

var server = http.createServer(function(req, res) {
  var urlData = url.parse(req.url, true);
  var path = urlData.pathname;
  var q = urlData.query;
  var result = null;
  if (path === '/api/parsetime') {
    result = getTimeParsed(q.iso);
  } else if (path === '/api/unixtime') {
    result = {
      unixtime: Date.parse(q.iso)
    };
  }

  if (result != null) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    console.log(result);
    res.end(JSON.stringify(result));
  }

  req.on('error', function(err) {
    res.end(err);
  });
});

server.listen(process.argv[2]);

function getTimeParsed(time) {
  var date = new Date(time);
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  };
}