#include <node.h>
#include "client_session_class.h"



using namespace v8;

void Init(Handle<Object> target) {

  HandleScope scope;

  //define js api  csessionGet
  target->Set(String::NewSymbol("csessionGet"),
	   FunctionTemplate::New(Csession_Class::csessionGet)->GetFunction());

  //define js api  csessionSet
  target->Set(String::NewSymbol("csessionSet"),
	   FunctionTemplate::New(Csession_Class::csessionSet)->GetFunction());

           


}

NODE_MODULE(client_session, Init)