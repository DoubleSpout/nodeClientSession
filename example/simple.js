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
   request.csession['count2'] = count*2; //update session
   request.csession['count3'] = count*3; //update session
   request.csession['count4'] = count*4; //update session
   request.csession['count5'] = count*5; //update session
   request.csession['count6'] = count*6; //update session
   request.csession['count7'] = count*7; //update session
   request.csession['count8'] = count*8; //update session
   request.csession['count9'] = count*9; //update session
   request.csession['count10'] = count*10; //update session
   clientSession.csset(request, response);//flush session to cookie

   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end(JSON.stringify(request.csession)); //response count add every time

}).listen(8124);
console.log('Server running at http://127.0.0.1:8124/');