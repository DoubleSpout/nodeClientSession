#include "md5.h"
#include <string>
#include <iostream>
int main() {
   using namespace std;
   string str = "abc";
   MD5 md5(str);
   string result = md5.md5();
   cout << "abc md5 is " << result << endl;
   return 0;
}
