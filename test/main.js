var cs = require('../index.js');
var assert = require('assert');

//test unit
try{
	var cs_ins = cs('a');
}catch(e){
	assert.equal(e,'secretKey\'s length must longer than 6.')
}

//test unit
try{
	var key = 'a'
	for(var i=0;i<100;i++){
		key+='a';
	}
	var cs_ins = cs(key);
}catch(e){
	assert.equal(e,'secretKey\'s length must shorter than 64.')
}

//test unit
try{
	var key = 'a!!!!!!!!!!'
	var cs_ins = cs(key);
}catch(e){
	assert.equal(e,'secretKey\'s length must be Letters and Numbers.')
}

//test unit
try{
	var cs_ins = cs(null,{maxAge:-1});
}catch(e){
	assert.equal(e,'maxAge must be larger than 0  or equal 0, unit is second.')
}

//test unit
try{

	var cs_ins = cs(null,{secure:-1});
}catch(e){
	assert.equal(e,'secure must be a boolean.')
}

//test unit
try{
	var cs_ins = cs(null,{httpOnly:-1});
}catch(e){
	assert.equal(e,'httpOnly must be a boolean.')
}

//test unit
var cs_ins = cs(null,{
	path:'/test',
	maxAge:7200,
	secure:true,
	httpOnly:false,
});
assert.equal(typeof cs_ins.csget,'function')
assert.equal(typeof cs_ins.csset,'function')
assert.equal(typeof cs_ins.connect,'function')
assert.equal(typeof cs_ins.opt,'object')
assert.equal(cs_ins.opt.path,'/test')
assert.equal(cs_ins.opt.maxAge,7200)
assert.equal(cs_ins.opt.secure,true)
assert.equal(cs_ins.opt.httpOnly,false)





//test unit
//use default key
var cs_ins_2 = cs();
var req = {headers:{}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(cookie){ 
		 res.headers = cookie
	}
}
var count = 1
var cb = function(){
	count++
}
cs_ins_2.csget(req,res,cb);
assert.equal(count,2);
assert.equal(JSON.stringify(req.csession),'{}');



//test unit
//use default key
var cs_ins_2 = cs();
var req = {headers:{
	'cookie':'.ASPXAUTH=A317020; uin=snoopyxdy'
}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(cookie){ 
		 res.headers = cookie
	}
}
var count = 1
var cb = function(){
	count++
}
cs_ins_2.csget(req,res,cb);
assert.equal(count,2);
assert.equal(JSON.stringify(req.csession),'{}');




//test unit
//use default key
var cs_ins_2 = cs();
var req = {headers:{}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(name, cookie){ 
		 console.log(name,cookie)
		 res.headers.cookie = cookie
	}
}

cs_ins_2.csset(req,res);
var next_csession = res.headers.cookie;
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') !== -1, true);

console.log(next_csession)
var req = {
	headers:{
		cookie:next_csession
	}
}
cs_ins_2.csget(req,res);
assert.equal(typeof req.csession, 'object');
assert.equal(JSON.stringify(req.csession), '{}');



//test unit
//use default key
var cs_ins_2 = cs(null,{
	path:'/test',
	maxAge:0,
	secure:true,
	httpOnly:false,
});
var req = {headers:{}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(name, cookie){ 
		 console.log(name,cookie)
		 res.headers.cookie = cookie
	}
}

cs_ins_2.csset(req,res);
var next_csession = res.headers.cookie;
console.log(next_csession)
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') === -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/test;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') === -1, true);
assert.equal(res.headers.cookie.indexOf('Secure') !== -1, true);

console.log(next_csession)
var req = {
	headers:{
		cookie:next_csession
	}
}
cs_ins_2.csget(req,res);
assert.equal(typeof req.csession, 'object');
assert.equal(JSON.stringify(req.csession), '{}');



//test unit add null value
//session content
var cs_ins_3 = cs();
var req = {headers:{},csession:{"a":1,"bbb":"放到","ccc":"1312jj312l312","dd":null}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(name, cookie){ 
		 console.log(name,cookie)
		 res.headers.cookie = cookie
	}
}

cs_ins_3.csset(req,res);

var next_csession = res.headers.cookie;
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') !== -1, true);
//next_csession += 'a'
//console.log(next_csession)
var req2 = {
	headers:{
		cookie:next_csession
	}
}
cs_ins_3.csget(req2,res);
assert.equal(typeof req2.csession, 'object');
assert.equal(JSON.stringify(req2.csession), '{"a":1,"bbb":"放到","ccc":"1312jj312l312"}');






//test unit
//custom key
var cs_ins_3 = cs('abcdefghijklmn');
var req = {headers:{},csession:{"a":1,"bbb":"放到","ccc":"1312jj312l312"}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(name, cookie){ 
		 console.log(name,cookie)
		 res.headers.cookie = cookie
	}
}


cs_ins_3.csset(req,res);
var next_csession = res.headers.cookie;
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') !== -1, true);
//next_csession += 'a'
//console.log(next_csession)
var req2 = {
	headers:{
		cookie:next_csession
	}
}
cs_ins_3.csget(req2,res);
assert.equal(typeof req2.csession, 'object');
assert.equal(JSON.stringify(req2.csession), '{"a":1,"bbb":"放到","ccc":"1312jj312l312"}');





//sign error1
var cs_ins_4 = cs('aaaaaaaaaa');
var req = {headers:{},csession:{"a":1,"bbb":"放到","ccc":"1312jj312l312"}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(name, cookie){ 
		 console.log(name,cookie)
		 res.headers.cookie = cookie
	}
}


cs_ins_4.csset(req,res);
var next_csession = res.headers.cookie;
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') !== -1, true);
//next_csession += 'a'
console.log(next_csession)

next_csession1 = next_csession.split('csession=')[1]
next_csession1 = 'a' + next_csession1

console.log(next_csession1)
var req4 = {
	headers:{
		cookie:'csession='+next_csession1
	}
}
cs_ins_4.csget(req4,res);
assert.equal(typeof req4.csession, 'object');
assert.equal(JSON.stringify(req4.csession), '{}');
assert.equal(req4['_check_csession_error'], 4);






//custom key
//set use key1
var cs_ins_4 = cs('key1key1key1');
var req = {headers:{},csession:{"a":1,"bbb":"放到","ccc":"1312jj312l312"}}
var res = {
	headers:{},
	getHeader:function(){
		return null
	},
	setHeader:function(name, cookie){ 
		 console.log(name,cookie)
		 res.headers.cookie = cookie
	}
}

cs_ins_4.csset(req,res);
var next_csession = res.headers.cookie;
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') !== -1, true);
console.log(res.headers.cookie)

//get use key2
var cs_ins_6 = cs('key2key2key2')
var req6 = {
	headers:{
		cookie:next_csession
	}
}
var res6 ={headers:{}}
cs_ins_6.csget(req6,res6);
assert.equal(typeof req6.csession, 'object');
assert.equal(JSON.stringify(req6.csession), '{}');
assert.equal(req6['_check_csession_error'], 3);


console.log('test all success')

process.exit(0);

