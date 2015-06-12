var mymodule = require('./mymodule.js')

mymodule(process.argv[2],process.argv[3],function(err,data){
if (err) return console.log("Error: " + err);
  for(var d in data) 
    console.log(data[d]);
});
