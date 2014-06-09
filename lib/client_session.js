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

	if(opt.maxAge && opt.maxAge < 0){ //check expire time
			throw 'maxAge must be larger than 0, unit is second.';
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
		//call c++ addon to check sign and deal session data
		csession_cc.csessionGet(req,res,csStr,defaultSecretKey);
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
		var jsonStr = JSON.stringify(req['csession'] || emptyObj);//gen session json string
		//call c++ addon sign and encrypt the session str
		csession_cc.csessionSet(req,res,jsonStr,defaultSecretKey);
		//generate cookie string
		csessionStr = cookie.serialize(csessionKey, res['_csession_str'], opt);
		
		//set cookie string into response headers
		if(!res.headers.cookie){
			res.headers.cookie = '';
		}
		if(res.headers.cookie){
			res.headers.cookie += csessionStr;
		}
		else{
			res.headers.cookie = csessionStr;
		}

	}

	//middleware in express or connect
	var csessionExpress = function(req,res,next){

		return next();
	}


	return {
		csget:csessionGet,
		csset:csessionSet,
		connect:csessionExpress,
		opt:opt,
	}
	
}

module.exports = csessionFunc;