var HttpIncomingMessage = require('http').IncomingMessage;
var microtime = require('microtime');

function accepts(ee) {
  return (ee instanceof HttpIncomingMessage) && ee.client && ee.client.server;
}

function observe(req, domain) {
  var begin = microtime.now();
  domain.emit('http-server-request-begin', req, begin, 0);
  
  req.once('end', function() {
    var end = microtime.now();
    domain.emit('http-server-request-end', req, end, end - begin);
  });
}

module.exports =
{
  accepts: accepts,
  observe: observe
};