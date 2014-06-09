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
	assert.equal(e,'maxAge must be larger than 0, unit is second.')
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
var res = {headers:{}}
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
var res = {headers:{}}
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
var res = {headers:{}}

cs_ins_2.csset(req,res);
var next_csession = res.headers.cookie;
assert.equal(typeof res.headers.cookie,'string');
assert.equal(res.headers.cookie.indexOf('csession=') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Max-Age=3600;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('Path=/;') !== -1, true);
assert.equal(res.headers.cookie.indexOf('HttpOnly') !== -1, true);

console.log(next_csession)




