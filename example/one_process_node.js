var http = require('http');
var cs = require('../index.js'); 
//in your code this wil be 
//var cs = require('client-session')
var clientSession = cs('mysecretkey');

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
  response.end(request.csession['username'] + ' : ' +count.toString());

}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');