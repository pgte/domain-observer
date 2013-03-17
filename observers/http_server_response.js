var HttpServerResponse = require('http').ServerResponse;
var microtime = require('microtime');

function accepts(ee) {
  return ee instanceof HttpServerResponse;
}

function observe(res, domain) {
  res.once('finish', function() {
    domain.emit('http-server-response-end', res, microtime.now());
  });
}

module.exports =
{
  accepts: accepts,
  observe: observe
};