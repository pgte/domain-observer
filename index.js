require('domain-id');

var i =
exports =
module.exports =
require('domain-interceptor');

var observers = require('./observers');

i.on('created', function(d) {

  function added(ee) {
    observers.observe(ee, d);
  }

  d.on('added', added);
});