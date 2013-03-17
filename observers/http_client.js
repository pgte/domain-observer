var ClientRequest = require('domain-interceptor').httpClientRequest;
var microtime = require('microtime');

function accepts(ee) {
  return (ee instanceof ClientRequest) && (! ee.client || ! ee.client.server);
}

function observe(req, domain) {
  domain.emit('http-client-request-begin', req, microtime.now());
  
  req.once('response', function(res) {
    domain.emit('http-client-response-begin', res, microtime.now());
    res.once('end', function() {
      domain.emit('http-client-response-end', res, microtime.now());
    });
  });

  req.once('finish', function() {
    domain.emit('http-client-request-end', req, microtime.now());
  });
}

module.exports =
{
  accepts: accepts,
  observe: observe
};