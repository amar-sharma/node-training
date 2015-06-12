var fs = require('fs');
var dir = process.argv[2];
fs.readdir(dir, function(err, files) {
  if (err) {
    console.err(err);
    return;
  }
  files.forEach(function(file) {
    var start = file.lastIndexOf(".");
    if (start > 0 && file.substring(start + 1) == process.argv[3])
      console.log(file);
  });
});