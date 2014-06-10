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
  res.send(req.csession['username'] + ' : ' +count.toString());

});


app.get('/down', function(req, res){
  var count = req.csession['count'];
  if(!count){
    count = 1
  }
  else{
    count++
  }
  req.csession['count'] = count;
  res.csflush() //sync to cookie session equal to req.csflush() 
  var txtFile = path.join(__dirname,'1.txt')
  res.sendfile(txtFile)
});

app.listen(8124);
console.log('Server running at http://127.0.0.1:8124/');