var ClientRequest = require('http').ClientRequest;
var ClientRequest2 = require('domain-interceptor').httpClientRequest;
var ClientRequest3 = require('domain-id').oldHttpClientRequest;
var microtime = require('microtime');

function accepts(ee) {
  return (
    (ee instanceof ClientRequest)  ||
    (ee instanceof ClientRequest2) ||
    (ee instanceof ClientRequest3)) &&
  ! (ee.client && ee.client.server);
}

function observe(req, domain) {
  var begin = microtime.now();
  domain.emit('http-client-request-begin', req, begin, 0);
  
  req.once('response', function(res) {
    var responseBegin = microtime.now();
    domain.emit('http-client-response-begin', res, responseBegin, responseBegin - begin);
    res.once('end', function() {
      var responseEnd = microtime.now();
      domain.emit('http-client-response-end', res, responseEnd, responseEnd - responseBegin);
    });
  });

  req.once('finish', function() {
    var finish = microtime.now();
    domain.emit('http-client-request-end', req, finish, finish - begin);
  });
}

module.exports =
{
  accepts: accepts,
  observe: observe
};