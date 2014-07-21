var csession_cc = require('../build/Release/client_session.node');
var cookie = require('cookie');
var defaultSecretKey = 'nodeClientSession';
var csessionKey = 'csession';
var noopFunc = function(){};
var emptyObj = {};
var defaultOpt = {
	path:'/',
	maxAge:3600,
	secure:false,
	httpOnly:true,
};

var csessionFunc = function(secretKey,opt){
	var secretKey = secretKey || defaultSecretKey; //set secretKey
	var expireTime = parseInt(expireTime) || 0; //set expire time
	var opt = opt || emptyObj;

	if(secretKey === defaultSecretKey){
		console.log('using defaultSecretKey is not safety,please using your own secretKey instead.');
	}
	else{ //check secretKey
		if(secretKey.length<6){
			throw 'secretKey\'s length must longer than 6.';
		}
		if(secretKey.length>64){
			throw 'secretKey\'s length must shorter than 64.';
		}
		if(!/^[\w]+$/.test(secretKey)){
			throw 'secretKey\'s length must be Letters and Numbers.';
		}
	}

	//update default options
	var tempOpt={}
	Object.keys(defaultOpt).forEach(function(key){
		if('undefined' !== typeof opt[key]){
			tempOpt[key] = opt[key];
		}
		else{
			tempOpt[key] = defaultOpt[key];
		}
	})

	opt = tempOpt;
	//console.log(opt)
	if(opt.maxAge < 0){ //check expire time
			throw 'maxAge must be larger than 0  or equal 0, unit is second.';
	}
	if(!opt.secure===true && !opt.secure===false){ //check secure
			throw 'secure must be a boolean.';
	}

	if(!opt.httpOnly === true && !opt.httpOnly === false){ //check httpOnly
			throw 'httpOnly must be a boolean.';
	}

	var csessionGet = function(req,res,cb){
		var cb = cb || noopFunc;
		var cookieHeader = req.headers.cookie; //get cookie str

		if(!cookieHeader){ //if no cookie
			req.csession = {};
			return cb();
		}
		//parse cookie check if has csessionKey
		csStr = cookie.parse(cookieHeader)[csessionKey];

		//if access first set init session
		if(!csStr){
			req.csession = {};
			return cb();
		}
		//console.log(csStr,secretKey)
		//call c++ addon to check sign and deal session data
		csession_cc.csessionGet(req,res,csStr,secretKey);
		//if check error

		if(!req.csession){
			req.csession = {}
			return cb();
		}
		try{
			req.csession = JSON.parse(req.csession);
		}
		catch(e){
			req.csession = {};
		}
		return cb();
	}

	var csessionSet = function(req,res){
		var csessionObj = req['csession'] || emptyObj;
		var tempObj = {}
		//delete one level null
		Object.keys(csessionObj).forEach(function(sessionKey){
			if(csessionObj[sessionKey] == null || typeof csessionObj[sessionKey] == 'undefined'){
				return
			}
			tempObj[sessionKey] = csessionObj[sessionKey]
		})

		var jsonStr = JSON.stringify(tempObj);//gen session json string

		//call c++ addon sign and encrypt the session str
		csession_cc.csessionSet(req,res,jsonStr,secretKey);
		//generate cookie string
		//set cookie options
		var seesionOpt = {
				path:opt.path,
				secure:opt.secure,
				httpOnly:opt.httpOnly,
		}
		//if maxAge is bigger than 0,set maxAge and expire
		if(opt.maxAge>0){
			seesionOpt.maxAge = opt.maxAge;
			var expire = Date.now() + opt.maxAge*1000;
			seesionOpt.expires = new Date(expire);
		}
		//console.log(seesionOpt)
		csessionStr = cookie.serialize(csessionKey, res['_csession_str'], seesionOpt);
		
		//set cookie string into response headers
		var prev = res.getHeader('Set-Cookie');
	    if (prev) {
		    if (Array.isArray(prev)) {
		      csessionStr = prev.concat(csessionStr);
		    } else {
		      csessionStr = [prev, csessionStr];
		    }
	    }
	    res.setHeader('Set-Cookie', csessionStr);

	}

	//middleware in express or connect
	var csessionExpress = function() {
		  return function(req, res, next) {
		  	res.csflush = req.csflush = function(){
		  		csessionSet(req,res);
		  	};		    
		    csessionGet(req,res,next);
		  }
	}

	return {
		csget:csessionGet,
		csset:csessionSet,
		connect:csessionExpress,
		opt:opt,
	}
	
}

module.exports = csessionFunc;