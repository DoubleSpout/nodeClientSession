# client-session(cookie session for nodejs)[![Build Status](https://travis-ci.org/DoubleSpout/nodeClientSession.png?branch=master)](https://travis-ci.org/DoubleSpout/nodeClientSession)

nodejs client cookie session middleware, support cross process and multi server without any other database(such as redis or mongodb) to store session data, cookie is encryption and md5 verify signatures. 

the module can also be used in express framework.

## Installing the module

With [npm](http://npmjs.org/):

client-session module is supported windows, linux, mac.

Make sure, node-gyp has installed.

     npm install client-session

From source:

     git clone https://github.com/DoubleSpout/nodeClientSession.git
     cd nodeClientSession
     node-gyp rebuild

To include the module in your project:

     var cs = require('client-session');

##simple example

		var http = require('http');
		var cs = require('client-session'); 
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

when you run the example,you will see count +1 every time in your browser

##express 4.x example

		var express = require('express');
		var path = require('path')
		var cs = require('client-session');
		var clientSession = cs('mysecretkey');
		var app = express();
		app.use(clientSession.connect());
		app.get('/', function(req, res){
		  var count = req.csession['count'];
		  if(!count) count = 1;
		  else count++;
		  req.csession['count'] = count;
		  //sync to cookie session equal to res.csflush(),make sure to call it before response
		  req.csflush(); 
		  res.send(count.toString());
		});
		app.listen(8124);
		console.log('Server running at http://127.0.0.1:8124/');

##Api doc
1.get clientSession object
	
	var clientSession = require('client-session')(YOUR_SERCRET_KEY, OPTIONS)

2.OPTIONS
default options is below:

	{
		path:'/',  //session path
		maxAge:3600, //session stored time,set 0 when user close browser, session will be lost
		secure:false, //https session
		httpOnly:true, //httpOnly,set true, browser javascript could not be get cookie
	}

3.get csession from request objcet

	clientSession.csget(request, response [,callback]);

the client session will bd stored in `request['csession']`

4.flush the client session to client browser.

	clientSession.csset(request, response);//flush session to cookie

5.express example

see the express example, make sure before you response to client call the method `req.csflush()` or `res.csflush()` to flush session into cookie header

##clinet-session work flow:
1.Generation middleware and set the key which is strong enough

2.When client request is comming,send the req,res and cookie string to c++ addon

3.get the client session data from cookie string, and store it in req object

4.Before server respones the client, generate the signature and store it in res objec, and then add cookie into response header.

##notice
1.The client-session must be smaller than 1k,so it better to store userid or username.

2.Although the clinet-session cookie is encryption, better not store passowrd in it,just store user's identity.

3.To use client-session, without the use of ip hash or cookie hash, client-session works fine.

4.To use clinet-session, you never need database such as redis to store session data,they are all stored in the browser's cookie. 

##benchmark
commond : ab -c 500 -n 20000 http://192.168.150.3:8124/

env: linux system 2cpus 64bits 8G men

express + redis + 2 process session:

		Server Software:
		Server Hostname:        192.168.150.3
		Server Port:            8124

		Document Path:          /
		Document Length:        28 bytes

		Concurrency Level:      500
		Time taken for tests:   52.557 seconds
		Complete requests:      20000
		Failed requests:        0
		Write errors:           0
		Total transferred:      8952700 bytes
		HTML transferred:       560000 bytes
		Requests per second:    380.54 [#/sec] (mean)
		Time per request:       1313.925 [ms] (mean)
		Time per request:       2.628 [ms] (mean, across all concurrent requests)
		Transfer rate:          166.35 [Kbytes/sec] received

		Connection Times (ms)
		              min  mean[+/-sd] median   max
		Connect:        0    2  21.2      2    2996
		Processing:    26 1292 637.1   1161    4242
		Waiting:        5  639 413.0    625    4225
		Total:         27 1294 637.5   1163    4243

		Percentage of the requests served within a certain time (ms)
		  50%   1163
		  66%   1178
		  75%   1186
		  80%   1192
		  90%   1226
		  95%   1437
		  98%   4188
		  99%   4228
		 100%   4243 (longest request)

express + client-session +2 process session:

		Server Software:
		Server Hostname:        192.168.150.3
		Server Port:            8124

		Document Path:          /
		Document Length:        28 bytes

		Concurrency Level:      500
		Time taken for tests:   40.630 seconds
		Complete requests:      20000
		Failed requests:        0
		Write errors:           0
		Total transferred:      9760000 bytes
		HTML transferred:       560000 bytes
		Requests per second:    492.25 [#/sec] (mean)
		Time per request:       1015.750 [ms] (mean)
		Time per request:       2.031 [ms] (mean, across all concurrent requests)
		Transfer rate:          234.59 [Kbytes/sec] received

		Connection Times (ms)
		              min  mean[+/-sd] median   max
		Connect:        0    2  21.2      1    2996
		Processing:    36  998 477.2    931    3946
		Waiting:        5  572 531.5    512    3922
		Total:         38 1000 477.6    933    3948

		Percentage of the requests served within a certain time (ms)
		  50%    933
		  66%    942
		  75%    950
		  80%    956
		  90%    971
		  95%    988
		  98%   3926
		  99%   3941
		 100%   3948 (longest request)

## License

MIT

