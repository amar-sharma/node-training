var eventEmitter = require('events').EventEmitter,
  fs = require('fs'),
  byline = require('byline');

var emitter = new eventEmitter();
var numberOfLines = 10;
var index = 0;
var lastLength = 0;
var oldLogs = [];

var getIndex = function(index) {
  return index == numberOfLines - 1 ? 0 : index + 1;
}

function tailNode(file) {
  var stream = fs.createReadStream(file);
  stream = byline.createStream(stream);
  stream.on('readable', function() {
    var line;
    while (null !== (line = stream.read())) {
      oldLogs[index = getIndex(index)] = line.toString();
      lastLength += line.length;
    }
  });
  stream.on('end', function() {
    console.log("Log file loaded..")
    lastLength += 3;
    emitter.emit("loaded");
  });

  fs.watch(file, function(event, fname) {
    if (event == 'change') {
      var readStream = fs.createReadStream(file, {
        start: lastLength
      });
      var text = '';
      readStream.on('data', function(chunk) {
        text += chunk.toString();
        lastLength += chunk.length;
      });
      readStream.on('end', function() {
        oldLogs[index = getIndex(index)] = text;
        emitter.emit('newLog', text.split('\n'));
      });
    }
  });
}

tailNode.prototype.emitter = emitter

tailNode.prototype.getOldLogs = function() {
  var logs = [];
  startIndex = getIndex(index);
  for (j = 0; j < 10; j++) {
    if (!oldLogs[startIndex]) {
      startIndex = getIndex(startIndex);
      continue;
    }
    logs.push(oldLogs[startIndex])
    startIndex = getIndex(startIndex);
  }
  return logs
}

module.exports = tailNode;
