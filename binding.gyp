{
  "targets":[
    {
      "target_name": "client_session",
      "conditions": [
            ["OS==\"mac\"", {  
                "sources": ["src/clientsession.cpp","src/client_session_class.cpp","src/md5.cpp"],
                "libraries": [],
                "cflags": [],
            }],
            ["OS==\"linux\"", {
	            "sources": ["src/clientsession.cpp","src/client_session_class.cpp","src/md5.cpp"],
                "libraries": [],
                "cflags": [],
            }],
            ["OS==\"win\"", {  
                 "sources": ["src/clientsession.cpp","src/client_session_class.cpp","src/md5.cpp"],
                 "libraries": [],
                 "cflags": ["/TP",'/J','/E'],
            }]
        ]
    }
  ]
}
