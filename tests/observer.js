var test = require('tap').test;
var observer = require('..');
var domain = require('domain');
var http = require('http');

function randomPort() {
  return Math.ceil(Math.random() * 8000) + 1024;
}

test('observe http client events happening on a domain', function(t) {
  t.plan(12);
  var events = [
    'http-client-request-begin',
    'http-client-request-end',
    'http-client-response-begin',
    'http-client-response-end'
  ];

  var happened = [];

  var d = domain.create();

  events.forEach(function(event) {
    d.on(event, function(o, when) {
      happened.push(event, o, when);
    });
  });

  d.run(function() {
    var req = http.get('http://search.twitter.com/search.json?q=nodejs', function(res) {
      res.resume();
      res.once('end', function() {
        process.nextTick(function() {
          t.equal('http-client-request-begin', happened[0]);
          t.equal(req, happened[1]);
          t.type(happened[2], 'number');
          t.equal('http-client-request-end', happened[3]);
          t.equal(req, happened[4]);
          t.type(happened[5], 'number');
          t.equal('http-client-response-begin', happened[6]);
          t.equal(res, happened[7]);
          t.type(happened[8], 'number');
          t.equal('http-client-response-end', happened[9]);
          t.equal(res, happened[10]);
          t.type(happened[11], 'number');
        });
      });
    });
  });

});

test('observe http server request and responses', function(t) {

  t.plan(9);

  var events = [
    'http-server-request-begin',
    'http-server-request-end',
    'http-server-response-end'
  ];

  var observed = [];

  observer.on('created', function(d) {
    events.forEach(function(event) {
      d.on(event, function(o, t) {
        observed.push(event, o, t);
      });
    });
  });

  // Setup server
  var port = randomPort();
  var server = http.createServer();
  server.on('request', function(req, res) {
    req.resume();
    var d = domain.create();
    d.add(req);
    d.add(res);
    res.end('Hey!');
  });

  server.on('listening', function() {
    http.get('http://localhost:' + port, function(res) {
      res.resume();
      res.on('end', function() {
        process.nextTick(function() {
          t.equal(observed[0], 'http-server-request-begin');
          t.equal(observed[1].constructor.name, 'IncomingMessage');
          t.type(observed[2], 'number');
          t.equal(observed[3], 'http-server-response-end');
          t.equal(observed[4].constructor.name, 'ServerResponse');
          t.type(observed[5], 'number');
          t.equal(observed[6], 'http-server-request-end');
          t.equal(observed[7].constructor.name, 'IncomingMessage');
          t.type(observed[8], 'number');
          server.close();
        });
      });
    });
  });

  server.listen(port);
});

test('it allows to create custom observers', function(t) {

});