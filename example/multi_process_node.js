var cluster = require('cluster');
var http = require('http');
var cs = require('../index.js'); 
//in your code this wil be 
//var cs = require('client-session')
var clientSession = cs('mysecretkey');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server

http.createServer(function (request, response) {
   if(request.url == '/favicon.ico'){
      return response.end('')
   }

  clientSession.csget(request, response);

  var count = request.csession['count'];

  if(!count){
    count = 1
  }
  else{
    count++
  }

  console.log(count)
  request.csession['count'] = count;
  request.csession['username'] = '尊敬的访客';

  response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
  clientSession.csset(request, response);
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end(request.csession['username'] + ' : ' +count.toString() + 'worker id :'+cluster.worker.id+' pid:'+process.pid);

}).listen(8124);
console.log(cluster.worker.id)
console.log('Server running at http://127.0.0.1:8124/');


}

