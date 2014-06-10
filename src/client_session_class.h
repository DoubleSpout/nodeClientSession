#ifndef CSESSION_H
#define CSESSION_H

#include <time.h>
#include <string>
using namespace v8;
using namespace std;

class Csession_Class {

 public:
  //JS API
  static Handle<Value> csessionGet(const Arguments& args);
  static Handle<Value> csessionSet(const Arguments& args);

  //check session is valid
  static int checkSign(const char *sessionString, char *key, string &ojson_ptr);
  //encrypt
  static void xorSessionStr(string &sessionString, char *key);
  static string md5Str(char *sessionString, char *key);

  Csession_Class(){};
  ~Csession_Class(){};


};

#endif