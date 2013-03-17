var observers = [
   require('./http_client')
 , require('./http_server_request')
 , require('./http_server_response')
];

exports.observe =
function observe(ee, domain) {
  var observer;
  var accepts = false;
  for(var i = 0; i < observers.length; i++) {
    observer = observers[i];
    if (accepts = observer.accepts(ee)) {
      observer.observe(ee, domain);
      break;
    }
  }
};