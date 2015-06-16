var fs = require('fs'),
  http = require('http'),
  socketio = require('socket.io'),
  byline = require('byline'),
  tail = require('./tail-node');

if (process.argv.length < 4) {
  console.log("Usage: node app.js [logFile] [port]");
  process.exit(-1);
}

var port = process.argv[3];
var file = process.argv[2];
var server, socket;

var tailNode = new tail(file);

tailNode.emitter.on("loaded", function() {
  startServer();
});

tailNode.emitter.on("newLog", function(log) {
  socket.emit('message', log);
});

var startServer = function() {
  server = http.createServer(function(req, res) {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    res.end(fs.readFileSync(__dirname + '/index.html'));
  }).listen(port, function() {
    console.log('Listening at: http://localhost:' + port);
  });
  socket = socketio.listen(server);
  socket.on('connection', function(socket) {
    socket.emit('message', tailNode.getOldLogs());
  });
}
