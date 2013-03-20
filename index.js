var i =
exports =
module.exports =
require('domain-interceptor');

require('domain-id');

var observers = require('./observers');

i.on('created', function(d) {

  function added(ee) {
    observers.observe(ee, d);
  }

  d.on('added', added);
});