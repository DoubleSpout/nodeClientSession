nodeClientSession
=================

nodejs client cookie session middleware, support cross process and multi server without any other database(such as redis or mongodb) to store session data, cookie is encryption and sha1 verify  signatures. 

working flow
1.Generation middleware and set the key which is strong enough

2.When client request is comming,send the req,res and cookie string to c++ addon

3.get the client session data from cookie string, and store it in req object

4.Generate the signature and store it in res object.

5.Before server respones the client, nodeClientSession package will add cookie header in it, and update the client session data.

still coding~ comming soon!
