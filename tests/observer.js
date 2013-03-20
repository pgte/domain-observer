var test = require('tap').test;
var observer = require('..');
var domain = require('domain');
var http = require('http');

function randomPort() {
  return Math.ceil(Math.random() * 8000) + 1024;
}

test('observe http client events happening on a domain', function(t) {
  t.plan(20);
  var events = [
    'http-client-request-begin',
    'http-client-request-end',
    'http-client-response-begin',
    'http-client-response-end'
  ];

  var happened = [];

  var d = domain.create();

  events.forEach(function(event) {
    d.on(event, function(o, when, tdiff) {
      happened.push(event, o, when, tdiff);
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
          t.type(happened[3], 'number');
          t.ok(happened[3] >= 0);
          t.equal('http-client-request-end', happened[4]);
          t.equal(req, happened[5]);
          t.type(happened[6], 'number');
          t.type(happened[7], 'number');
          t.ok(happened[7] >= 0);
          t.equal('http-client-response-begin', happened[8]);
          t.equal(res, happened[9]);
          t.type(happened[10], 'number');
          t.type(happened[11], 'number');
          t.ok(happened[11] >= 0);
          t.equal('http-client-response-end', happened[12]);
          t.equal(res, happened[13]);
          t.type(happened[14], 'number');
          t.type(happened[15], 'number');
          t.ok(happened[15] >= 0);
        });
      });
    });
  });

});

test('observe http server request and responses', function(t) {

  t.plan(15);

  var events = [
    'http-server-request-begin',
    'http-server-request-end',
    'http-server-response-end'
  ];

  var observed = [];

  observer.on('created', function(d) {
    events.forEach(function(event) {
      d.on(event, function(o, t, tdiff) {
        observed.push(event, o, t, tdiff);
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
          t.type(observed[3], 'number');
          t.ok(observed[3] >= 0);
          t.equal(observed[4], 'http-server-response-end');
          t.equal(observed[5].constructor.name, 'ServerResponse');
          t.type(observed[6], 'number');
          t.type(observed[7], 'number');
          t.ok(observed[7] >= 0);
          t.equal(observed[8], 'http-server-request-end');
          t.equal(observed[9].constructor.name, 'IncomingMessage');
          t.type(observed[10], 'number');
          t.type(observed[11], 'number');
          t.ok(observed[11] >= 0);
          server.close();
        });
      });
    });
  });

  server.listen(port);
});

if (false) test('it allows to create custom observers', function(t) {

});