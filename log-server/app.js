var fs = require('fs'),
  http = require('http'),
  socketio = require('socket.io');

var port = process.argv[3];
var file = process.argv[2];
var oldLogs = fs.readFileSync(file, 'utf8');

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

var socket = socketio.listen(server);

var oldLogs = fs.readFileSync(file).toString();

fs.watch(file, function(event, fname) {
  if (event == 'change') {
    var readStream = fs.createReadStream(file, {
      start: oldLogs.length
    });
    var text = '';
    readStream.on('data', function(chunk) {
      text += chunk.toString();
    });
    readStream.on('end', function() {
      oldLogs += text;
      emitIt(text, socket);
    });
  }
});

var text = "";
socket.on('connection', function(socket) {
  emitIt(oldLogs, socket)
});

var emitIt = function(logs, socket) {
  var logs = logs.split('\n');
  logs.forEach(function(log) {
    if (log.replace(/\s/, '').length)
      socket.emit('message', log);
  });
}