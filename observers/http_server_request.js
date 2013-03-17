var HttpIncomingMessage = require('http').IncomingMessage;
var microtime = require('microtime');

function accepts(ee) {
  return (ee instanceof HttpIncomingMessage) && ee.client && ee.client.server;
}

function observe(req, domain) {
  domain.emit('http-server-request-begin', req, microtime.now());
  
  req.once('end', function() {
    domain.emit('http-server-request-end', req, microtime.now());
  });
}

module.exports =
{
  accepts: accepts,
  observe: observe
};