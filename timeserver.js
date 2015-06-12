var net = require('net')
var server = net.createServer(function(socket) {
  var timestamp = getFormattedTime();
  socket.write(timestamp);
  socket.end();
})

function getFormattedTime() {
  var date = new Date();
  return date.getFullYear().toString() + "-" + formateSingle(date.getMonth() + 1) + "-" + formateSingle(date.getDate()) + " " + formateSingle(date.getHours()) + ":" + formateSingle(date.getMinutes()) + "\n"
}

function formateSingle(num) {
  return num < 10 ? "0" + num : num;
}
server.listen(process.argv[2]);