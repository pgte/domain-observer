var HttpServerResponse = require('http').ServerResponse;
var microtime = require('microtime');

function accepts(ee) {
  return ee instanceof HttpServerResponse;
}

function observe(res, domain) {
  var begin = microtime.now();
  res.once('finish', function() {
    var finish = microtime.now();
    domain.emit('http-server-response-end', res, finish, finish - begin);
  });
}

module.exports =
{
  accepts: accepts,
  observe: observe
};