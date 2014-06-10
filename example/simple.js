var http = require('http');
var cs = require('../index.js'); 
var clientSession = cs('mysecretkey');

http.createServer(function (request, response) {
   if(request.url == '/favicon.ico') return response.end(''); //stop '/favicon.ico' request

   clientSession.csget(request, response);//get csession
   var count = request.csession['count'];//use session

   if(!count) count = 1;
   else	count++

   request.csession['count'] = count; //update session
   clientSession.csset(request, response);//flush session to cookie

   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end(count.toString()); //response count add every time

}).listen(8124);
console.log('Server running at http://127.0.0.1:8124/');