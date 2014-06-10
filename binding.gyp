{
  "targets":[
    {
      "target_name": "client_session",
      "conditions": [
            ["OS==\"mac\"", {  
                "sources": ["src/clientsession.cpp","src/client_session_class.cpp","src/md5.cpp","src/base64.cpp","src/modp_base64/modp_b64.cc"],
                "libraries": [],
                "cflags": [],
            }],
            ["OS==\"linux\"", {
	            "sources": ["src/clientsession.cpp","src/client_session_class.cpp","src/md5.cpp","src/base64.cpp","src/modp_base64/modp_b64.cc"],
                "libraries": [],
                "cflags": [],
            }],
            ["OS==\"win\"", {  
                 "sources": ["src/clientsession.cpp","src/client_session_class.cpp","src/md5.cpp","src/base64.cpp","src/modp_base64/modp_b64.cc"],
                 "libraries": [],
                 "cflags": ["/TP",'/J','/E'],
            }]
        ]
    }
  ]
}
