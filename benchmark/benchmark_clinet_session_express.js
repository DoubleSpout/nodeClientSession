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
    var path = require('path')
    var cs = require('../index.js'); 
    //in your code this wil be 
    //var cs = require('client-session')
    var clientSession = cs('mysecretkey');

    var app = express();

    app.use(clientSession.connect())

    app.get('/', function(req, res){
      var count = req.csession['count'];
      if(!count){
        count = 1
      }
      else{
        count++
      }
      req.csession['count'] = count;
      req.csession['username'] = '尊敬的访客';
      res.cookie('mycookie','myvalue');
      res.cookie('mycookie2','myvalue2');
      res.cookie('mycookie3','myvalue3');
      req.csflush() //sync to cookie session equal to res.csflush() 
      res.send(req.csession['username'] + ' : ' +count.toString() + '; work :'+ cluster.worker.id);

    });


    app.listen(8124);
    console.log('Server running at http://127.0.0.1:8124/');



}