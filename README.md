# domain-observer [![Build Status](https://secure.travis-ci.org/pgte/domain-observer.png)](http://travis-ci.org/pgte/domain-observer)

Observe events happening inside a domain.

Works for HTTP clients and server.

## Install

```bash
$ npm install domain-observer
```

## Use

```javascript
var observer = require('domain-observer');

observer.on('created', function(domain) {
  console.log('someone created a domain', d);
  
  [
    'http-client-request-begin',
    'http-client-request-end',
    'http-client-response-begin',
    'http-client-response-end',
    'http-server-request-begin',
    'http-server-request-end',
    'http-server-response-end'
  ].forEach(function(event) {
    domain.on(event, function(o, t) {
      console.log('%s event happened on object %j, on time %d (microseconds)',
          event, o, t);
    });
  });
});
```