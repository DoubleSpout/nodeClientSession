#include <node.h>
#include <string>
#include <iostream>
#include <string.h>
#include "client_session_class.h"
#include "md5.h"

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
	string cs_string = cs_ptr;

	//pointer to char pointer
	char** ojson_ptr = 0;
	
	//dencrypt session
	xorSessionStr(cs_string, key_ptr);

	//check session is valid
	const char* cs_xor_ptr = cs_string.c_str();
	int check_r = checkSign(cs_xor_ptr, key_ptr, ojson_ptr);

	if(check_r){
		//set req.cession = session_jsonstr
		req_obj->Set(String::New("csession"),String::New(*ojson_ptr));
	}

	//del pointer
	delete []*ojson_ptr;
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

	const char * cs_sign_ptr = session_sign_str.c_str();
	xorSessionStr(session_sign_str, key_ptr);
	//string s1 = session_sign_str;
	//cout<<s1<<endl;
	//xorSessionStr(session_sign_str, key_ptr);

	//set req.cession = session_jsonstr
	res_obj->Set(String::New("_csession_str"),String::New(cs_sign_ptr));

	return scope.Close(Undefined()); 
};

//check
int Csession_Class::checkSign(const char *sessionString, char *key, char **ojson_ptr){
	//get last pot pos
	string session_string = sessionString;
	int last_pot = session_string.find_last_of(pot);
	int len = sizeof(sessionString);
	int signLen = len - (last_pot+1);
	//new 2 char[]
	char *ojson = new char[last_pot];
	char *signature = new char[signLen];

	//copy split origin json str and signature
	memcpy( ojson, &sessionString[0], last_pot);
	ojson[last_pot] = '\0';
	memcpy( signature, &sessionString[last_pot], signLen);
	signature[signLen] = '\0';

	//get check md5 string
	string check_sign = md5Str(ojson, key);
	const char *check_sign_char = check_sign.c_str();

	//compare two signature
	int cmp_result = strcmp(check_sign_char, signature);

	delete []signature;

	if(cmp_result == 0){
		ojson_ptr = &ojson;
		return 1;
	}
	else{
		//if check wrong delete ojson pointer
		delete []ojson;
		return 0;
	}	
}



//dencryptSession
void Csession_Class::xorSessionStr(string &sessionString, char *key){
	char xor_key = key[key_pos];
	int len = sizeof(sessionString);
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
