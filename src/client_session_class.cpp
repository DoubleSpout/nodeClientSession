#include <node.h>
#include <string>
#include <iostream>
#include <string.h>
#include "client_session_class.h"
#include "md5.h"
#include "base64.h"

using namespace v8;
using namespace std;

string md5_sign_char = "@";
const char pot = '.';
string string_pot = ".";
int key_pos = 5;
//add param
/*
req,
res,
csStr,
defaultSecretKey
*/
Handle<Value> Csession_Class::csessionGet(const Arguments& args){
	HandleScope scope;

	Local<Object> req_obj = args[0]->ToObject(); //get req obj
	Local<Object> res_obj = args[1]->ToObject(); //get res obj

	String::Utf8Value csession_str(args[2]->ToString());//get session encrypt string
	String::Utf8Value key_str(args[3]->ToString());//get session key

	//to char *
	char *cs_ptr = *csession_str;
	char *key_ptr = *key_str;
	string temp_cs_str = cs_ptr;
	string cs_string;

	bool r = Base64Decode(temp_cs_str, &cs_string);

	if(!r){
		//base64 decode error return 4
		req_obj->Set(String::New("_check_csession_error"),Number::New(4));
		return scope.Close(Undefined());
	}

	string ojson_ptr = "";

	//dencrypt session
	xorSessionStr(cs_string, key_ptr);
	//check session is valid
	//pointer to char pointer
	//cout<<cs_string<<endl;

	const char* cs_xor_ptr = cs_string.c_str();
	int check_r = checkSign(cs_xor_ptr, key_ptr, ojson_ptr);
	
	//cout<<check_r<<endl;
	
	if(check_r == 1){
		//set req.cession = session_jsonstr
		req_obj->Set(String::New("csession"),String::New(ojson_ptr.c_str()));

	}	
	else{
		req_obj->Set(String::New("_check_csession_error"),Number::New(check_r));
	}
	
	return scope.Close(Undefined()); 
};

/*
req,
res,
csStr,
defaultSecretKey
*/
Handle<Value> Csession_Class::csessionSet(const Arguments& args){
	HandleScope scope;

	Local<Object> req_obj = args[0]->ToObject(); //get req obj
	Local<Object> res_obj = args[1]->ToObject(); //get res obj

	String::Utf8Value csession_str(args[2]->ToString());//get session encrypt string
	String::Utf8Value key_str(args[3]->ToString());//get session key

	//to char *
	char *cs_ptr = *csession_str;
	char *key_ptr = *key_str;

	//get md5 signature
	string signature_string = md5Str(cs_ptr, key_ptr);
	string session_string = cs_ptr;

	//cout<<signature_string<<endl;
	//gen string
	string session_sign_str = session_string + string_pot + signature_string;
	//dencrypt session return origin json str
	//cout<<session_sign_str<<endl;
	
	xorSessionStr(session_sign_str, key_ptr);

	//xorSessionStr(session_sign_str, key_ptr);

	//base64 encode
	string out_base64_str;
	bool r = Base64Encode(session_sign_str, &out_base64_str);

	if(!r){
		ThrowException(Exception::TypeError(String::New("base64 encode error")));
		return scope.Close(Undefined()); 
	}
	//set req.cession = session_jsonstr
	const char * cs_sign_ptr = out_base64_str.c_str();
	res_obj->Set(String::New("_csession_str"),String::New(cs_sign_ptr));

	return scope.Close(Undefined()); 
};

//check
int Csession_Class::checkSign(const char *sessionString, char *key, string &ojson_ptr){
	//get last pot pos
	string session_string = sessionString;

	int last_pot = session_string.find_last_of(pot);
	//if not found pot
	if(last_pot == string::npos){
		//no pot
		return 2;
	}

	int len = session_string.length();
	int signLen = len - last_pot- 1;

	//new 2 char[]
	char ojson[1024];
	char signature[33];

	//copy split origin json str and signature
	memcpy( ojson, &sessionString[0], last_pot);
	ojson[last_pot] = '\0';
	memcpy( signature, &sessionString[last_pot+1], signLen);
	signature[signLen] = '\0';

	//get check md5 string
	string check_sign = md5Str(ojson, key);
	
	const char *check_sign_char = check_sign.c_str();
	//compare two signature
	int cmp_result = strcmp(check_sign_char, signature);


	//string sg = signature;
	//cout<< cmp_result <<endl;
	//cout<< check_sign <<endl;
	//cout<< sg <<endl;

	//delete pointer
	int result;

	if(cmp_result == 0){
		ojson_ptr = ojson;	
		result = 1;	
	}
	else{
		//if check wrong
		result = 3;
	}	

	//delete []signature;
	//delete []ojson;
	//cout<< result <<endl;
	return result;
}



//dencryptSession
void Csession_Class::xorSessionStr(string &sessionString, char *key){
	char xor_key = key[key_pos];
	int len = sessionString.length();
	//xor operate
	for(int i=0;i<len;i++){
		sessionString[i] = sessionString[i] ^ xor_key;
	}
	return;
}


string Csession_Class::md5Str(char *sessionString, char *key){
	//to string
	string sString = sessionString;
	string keyString = key;

	//generate string to md5
	string md5Str = sessionString + md5_sign_char + keyString;

	//cout<<md5Str<<endl;

	//md5 compute
	MD5 md5(md5Str);
	string md5Result = md5.md5();

	//return md5 str
	return md5Result;
}
