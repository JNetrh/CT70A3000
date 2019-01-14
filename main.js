const fib = require('./fibonacci');
const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.hasOwnProperty('start')) {
  argv.start = 0;
}
if (!argv.hasOwnProperty('length')) {
  argv.length = 10;
}

var file = fs.createWriteStream('./results/result_' + Date.now() + '.txt');
file.on('error', function(err) {
  return;
});
fib({ start: argv.start, length: argv.length }).forEach(function(v) {
  file.write(v + ',');
});
file.end();
