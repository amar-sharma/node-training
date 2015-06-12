var fs = require('fs'),
  http = require('http'),
  socketio = require('socket.io');

var port = process.argv[3];
var file = process.argv[2];

if (process.argv.length < 4) {
  console.log("Usage: node app.js [logFile] [port]");
  process.exit(-1);
}

var server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/html'
  });
  res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(port, function() {
  console.log('Listening at: http://localhost:' + port);
});

socketio.listen(server).on('connection', function(socket) {
  var oldLogs = fs.readFileSync(file, 'utf8');
  emitIt(oldLogs, socket);
  fs.watch(file, function(event, fname) {
    if (event == 'change') {
      newContents = fs.readFileSync(file, 'utf8');
      if (newContents.length - oldLogs.length < 0) {
        socket.emit('reload', "reload page");
      }
      if (newContents.length - oldLogs.length != 0) {
        emitIt(newContents.substring(oldLogs.length + 1, newContents.length), socket);
        oldLogs = newContents;
      }
    }
  });
});

var emitIt = function(logs, socket) {
  var logs = logs.split('\n');
  logs.forEach(function(log) {
    socket.emit('message', log);
  });
}