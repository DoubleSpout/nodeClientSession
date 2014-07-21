var http = require('http');
var cs = require('../index.js'); 
var clientSession = cs('mysecretkey',{
	"maxAge":3600*24*7
});

http.createServer(function (request, response) {
   if(request.url == '/favicon.ico') return response.end(''); //stop '/favicon.ico' request

   clientSession.csget(request, response);//get csession
   var count = request.csession['count'];//use session

   //print client cookie count
   console.log(count)

   if(!count) count = 1;
   else	count++

   if(count >=20) request.csession['count'] = null; //if count >= 20 set to null
   else request.csession['count'] = count; //update session
   clientSession.csset(request, response);//flush session to cookie


   if(request.url == '/redirect'){
   		response.writeHead(302, {'Location': 'http://cn.bing.com/'});
   		response.end()
   }
   else{
   		response.writeHead(200, {'Content-Type': 'text/plain'});
   		response.end(count.toString()); //response count add every time
   }
   



}).listen(8124);
console.log('Server running at http://127.0.0.1:8124/');