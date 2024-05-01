const userSocket = require("../Entity/userSocket");
const mesModel = require("../models/messageModel");

var user = []
var array_chat         


class chat_socket{

    connect(ws){
        ws.on('message', async (data)=> {
            var req = JSON.parse(data)
            switch (req.request) {
                case "start_connect":
                    user.push(new userSocket(ws, req.id_user, req.name,req.img))
                    console.log("user " + req.name + " join websocket")
                    break;

                case "join_chat":
                    for(var u of user){
                        if(u.ws === ws){
                            u.id_chat = req.id_chat 
                            u.is_inchat = true
                            break
                        }
                    }
                    break;

                case "out_chat":
                    for(var u of user){
                        if(u.ws === ws){
                            u.id_chat = 0 
                            u.is_inchat = false
                            console.log("out")
                            break
                        }
                    }
                    break;

                case "send_mes":
                    var user_send = null

                    for(var i = 0 ; i < user.length; i++){
                        if(user[i].ws == ws){
                            user_send = user[i]
                            break
                        }
                    }

                    console.log(req.id_user)

                    for(var u of user){
                        if(u.id === req.id_user){
                            if(u.ws == ws){
                                u.ws.send(JSON.stringify({
                                    "status" : 2000,
                                    "message" : req.message,
                                    "from" : "mine",
                                    "id_isInchat" : req.id_chat
                                }))
                            }else{
                                u.ws.send(JSON.stringify({
                                    "status" : 2000,
                                    "message" : req.message,
                                    "from" : "mine",
                                    "id_isInchat" : req.id_chat
                                }))
                            }
                        }else if(u.id !== req.id_user){
                            const check = await new mesModel().checkChatIsOwner(u.id, req.id_chat)
                            console.log(check)
                            if(check){
                                console.log(u.id + " " + u.name + " owner")
                                u.ws.send(JSON.stringify({
                                    "status" : 2000,
                                    "message" : req.message,
                                    "from" : "their",
                                    "id_isInchat" : req.id_chat,
                                    "img" : user_send.img
                                }))
                            }else{
                                console.log(u.id + " " + u.name + "not owner")
                            }
                        }
                    }
                    break

                default:
                   
                    break;
            }
            
        });

        ws.on("close", (data)=>{ 
           console.log("user_out")
           var us = null
           for(var i = 0 ; i < user.length; i++){
               if(user[i].ws === ws){
                   us = i
                   break
               }
           }
           delete user[us]
        })
    }

}

module.exports = chat_socket