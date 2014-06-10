var cluster = require('cluster');
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

    var express = require('express');
    var cookieParser = require('cookie-parser'); 
    var session = require('express-session')
    var RedisStore = require('connect-redis')(session);
    var path = require('path')
    var cs = require('../index.js'); 
    //in your code this wil be 
    //var cs = require('client-session')
    var clientSession = cs('mysecretkey');

    var app = express();
    app.use(cookieParser())
    
    app.use(session({ store: new RedisStore({
      host:'127.0.0.1',
      port :6379
    }), secret: 'keyboard cat' }))


    app.get('/', function(req, res){
      var count = req.session['count'];
      if(!count){
        count = 1
      }
      else{
        count++
      }
      req.session['count'] = count;
      req.session['username'] = '尊敬的访客';
      res.cookie('mycookie','myvalue');
      res.cookie('mycookie2','myvalue2');
      res.cookie('mycookie3','myvalue3');
      res.send(req.session['username'] + ' : ' +count.toString() + '; work :'+ cluster.worker.id);

    });

    app.listen(8124);
    console.log('Server running at http://127.0.0.1:8124/');



}