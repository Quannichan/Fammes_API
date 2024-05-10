const userSocket = require("../Entity/userSocket");
const mesModel = require("../models/messageModel");
const fs = require("fs")
const base64 = require("base-64")
const {format} = require("date-fns")

var user = []
var array_chat         


class chat_socket{

    connect(ws){
        ws.on('message', async (data)=> {
            var req = JSON.parse(data)
            switch (req.request) {
                case "start_connect":
                    user.push(new userSocket(ws, req.id_user, req.name,req.img  ,null, 0))
                    console.log("user " + req.name + " join websocket")
                    break;

                case "join_chat":
                    for(var u of user){
                        if(u.ws === ws){
                            u.id_chat = req.id_chat 
                            await new mesModel().Update_seen_user_receive(u.id,req.id_chat)
                            break
                        }
                    }
                    break;

                case "out_chat":
                    for(var u of user){
                        if(u.ws === ws){
                            u.id_chat = 0 
                            console.log("out")
                            break
                        }
                    }
                    break; 

                case "send_mes":
                    var now = new Date()
                    var user_send = null
                    var now_format = format(now , "HH:mm:ss dd/MM/yy")
                    console.log(now_format)
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
                                if(await new mesModel().UpdateChat_user_send(req.id_user, u.name, req.id_chat, req.message,req.message,now_format,1,1)){
                                    u.ws.send(JSON.stringify({
                                        "status" : 2000,
                                        "id_chat" : req.id_chat,
                                        "name_chat" : u.name_chat,
                                        "message" : req.message,
                                        "from" : "mine",
                                        "id_isInchat" : req.id_chat,
                                        "mes_type" : 1
                                    }))
                                }else {
                                    u.ws.send(JSON.stringify({
                                        "status" : 2002
                                    }))
                                }
                               
                            }else{
                                u.ws.send(JSON.stringify({
                                    "id_chat" : req.id_chat,
                                    "status" : 2000,
                                    "message" : req.message,
                                    "name_chat" : u.name_chat,
                                    "from" : "mine",
                                    "id_isInchat" : req.id_chat,
                                    "mes_type" : 1
                                }))
                            }
                        }else if(u.id !== req.id_user){
                            console.log(req.id_user)
                            const check = await new mesModel().checkChatIsOwner(u.id, req.id_chat)
                            console.log(check)
                            if(check){
                                if(u.id_chat === 0){
                                    const data_name_chat = await new mesModel().getChatName(u.id, req.id_chat)
                                        console.log(data_name_chat)
                                        var name = data_name_chat[0].chat_name
                                            u.ws.send(JSON.stringify({
                                                "id_chat" : req.id_chat,
                                                "status" : 2000,
                                                "name_chat" : name,
                                                "message" : req.message,
                                                "name_user_send" : user_send.name,
                                                "id_user_send" : req.id_user, 
                                                "from" : "their",
                                                "id_isInchat" : req.id_chat,
                                                "img" : user_send.img,
                                                "mes_type" : 1
                                            }))
                                }else{
                                    console.log(u.id + " " + u.name + " owner")
                                    if(await new mesModel().Update_seen_user_receive(u.id,req.id_chat)){
                                        const data_name_chat = await new mesModel().getChatName(u.id, req.id_chat)
                                        console.log(data_name_chat)
                                        var name = data_name_chat[0].chat_name
                                            u.ws.send(JSON.stringify({
                                                "id_chat" : req.id_chat,
                                                "status" : 2000,
                                                "name_chat" : name,
                                                "message" : req.message,
                                                "id_user_send" : req.id_user, 
                                                "name_user_send" : user_send.name,
                                                "from" : "their",
                                                "id_isInchat" : req.id_chat,
                                                "img" : user_send.img,
                                                "mes_type" : 1
                                            }))
                                    }else{
                                        u.ws.send(JSON.stringify({
                                            "status" : 2002
                                        }))
                                    }
                                }
                               
                            }else{
                                console.log(u.id + " " + u.name + "not owner")
                            }
                        }
                    }
                break

                case "send_img":
                    var now = new Date()
                    var user_send = null
                    var now_format = format(now , "HH:mm:ss dd/MM/yy")
                    var name_now = Date.now()
                    try{
                        console.log("Hello")
                        const imageData = base64.decode(req.file);
                        const name_file = `images/${req.id_chat}_${req.id_user}_IMAGE_${name_now}.image.jpg`

                        fs.writeFile(name_file,imageData, "binary",async (err) => {
                            if (err) {
                                console.error('Error saving image:', err);
                            } else {
                                console.log(now_format)
                                for(var i = 0 ; i < user.length; i++){
                                    if(user[i].ws == ws){
                                        user_send = user[i]
                                        break
                                    }
                                }
                                const message = `fammes/api/${name_file}`
                                for(var u of user){
                                    if(u.id === req.id_user){
                                        if(u.ws == ws){
                                            if(await new mesModel().UpdateChat_user_send(req.id_user, u.name, req.id_chat, "sent an image", message ,now_format,3, 2)){
                                                u.ws.send(JSON.stringify({
                                                    "status" : 2000,
                                                    "id_chat" : req.id_chat,
                                                    "name_chat" : u.name_chat,
                                                    "message" : message,
                                                    "from" : "mine",
                                                    "id_isInchat" : req.id_chat,
                                                    "mes_type" : 2
                                                }))
                                            }else {
                                                u.ws.send(JSON.stringify({
                                                    "status" : 2002
                                                }))
                                            }
                                           
                                        }else{
                                            u.ws.send(JSON.stringify({
                                                "id_chat" : req.id_chat,
                                                "status" : 2000,
                                                "message" : message,
                                                "name_chat" : u.name_chat,
                                                "from" : "mine",
                                                "id_isInchat" : req.id_chat,
                                                "mes_type" : 2
                                            }))
                                        }
                                    }else if(u.id !== req.id_user){
                                        console.log(req.id_user)
                                        const check = await new mesModel().checkChatIsOwner(u.id, req.id_chat)
                                        console.log(check)
                                        if(check){
                                            if(u.id_chat === 0){
                                                const data_name_chat = await new mesModel().getChatName(u.id, req.id_chat)
                                                    console.log(data_name_chat)
                                                    var name = data_name_chat[0].chat_name
                                                        u.ws.send(JSON.stringify({
                                                            "id_chat" : req.id_chat,
                                                            "status" : 2000,
                                                            "name_chat" : name,
                                                            "message" : message,
                                                            "name_user_send" : user_send.name,
                                                            "id_user_send" : req.id_user, 
                                                            "from" : "their",
                                                            "id_isInchat" : req.id_chat,
                                                            "img" : user_send.img,
                                                            "mes_type" : 2
                                                        }))
                                            }else{
                                                console.log(u.id + " " + u.name + " owner")
                                                if(await new mesModel().Update_seen_user_receive(u.id,req.id_chat)){
                                                    const data_name_chat = await new mesModel().getChatName(u.id, req.id_chat)
                                                    console.log(data_name_chat)
                                                    var name = data_name_chat[0].chat_name
                                                        u.ws.send(JSON.stringify({
                                                            "id_chat" : req.id_chat,
                                                            "status" : 2000,
                                                            "name_chat" : name,
                                                            "message" : message,
                                                            "id_user_send" : req.id_user, 
                                                            "name_user_send" : user_send.name,
                                                            "from" : "their",
                                                            "id_isInchat" : req.id_chat,
                                                            "img" : user_send.img,
                                                            "mes_type" : 2
                                                        }))
                                                }else{
                                                    u.ws.send(JSON.stringify({
                                                        "status" : 2002
                                                    }))
                                                }
                                            }
                                           
                                        }else{
                                            console.log(u.id + " " + u.name + "not owner")
                                        }
                                    }
                                }
                            }
                        });
                    }catch(err){
                        console.log(err)
                    }
                    
                break

                case "send_video":
                    var now = new Date()
                    var user_send = null
                    var now_format = format(now , "HH:mm:ss dd/MM/yy")
                    var name_now = Date.now()
                    try{
                        const videoData = base64.decode(req.file);
                        const name_file = `videos/${req.id_chat}_${req.id_user}_VIDEO_${name_now}.video.mp4`
                        fs.writeFile(name_file,videoData, "binary",async (err) => {
                            if (err) {
                                console.error('Error saving image:', err);
                            } else {
                                console.log(now_format)
                                for(var i = 0 ; i < user.length; i++){
                                    if(user[i].ws == ws){
                                        user_send = user[i]
                                        break
                                    }
                                }
                                const message = `fammes/api/${name_file}`
                                for(var u of user){
                                    if(u.id === req.id_user){
                                        if(u.ws == ws){
                                            if(await new mesModel().UpdateChat_user_send(req.id_user, u.name, req.id_chat, "sent a video", message ,now_format,4, 3)){
                                                u.ws.send(JSON.stringify({
                                                    "status" : 2000,
                                                    "id_chat" : req.id_chat,
                                                    "name_chat" : u.name_chat,
                                                    "message" : message,
                                                    "from" : "mine",
                                                    "id_isInchat" : req.id_chat,
                                                    "mes_type" : 3
                                                }))
                                            }else {
                                                u.ws.send(JSON.stringify({
                                                    "status" : 2002
                                                }))
                                            }
                                           
                                        }else{
                                            u.ws.send(JSON.stringify({
                                                "id_chat" : req.id_chat,
                                                "status" : 2000,
                                                "message" : message,
                                                "name_chat" : u.name_chat,
                                                "from" : "mine",
                                                "id_isInchat" : req.id_chat,
                                                "mes_type" : 3
                                            }))
                                        }
                                    }else if(u.id !== req.id_user){
                                        console.log(req.id_user)
                                        const check = await new mesModel().checkChatIsOwner(u.id, req.id_chat)
                                        console.log(check)
                                        if(check){
                                            if(u.id_chat === 0){
                                                const data_name_chat = await new mesModel().getChatName(u.id, req.id_chat)
                                                    console.log(data_name_chat)
                                                    var name = data_name_chat[0].chat_name
                                                        u.ws.send(JSON.stringify({
                                                            "id_chat" : req.id_chat,
                                                            "status" : 2000,
                                                            "name_chat" : name,
                                                            "message" : message,
                                                            "name_user_send" : user_send.name,
                                                            "id_user_send" : req.id_user, 
                                                            "from" : "their",
                                                            "id_isInchat" : req.id_chat,
                                                            "img" : user_send.img,
                                                            "mes_type" : 3
                                                        }))
                                            }else{
                                                console.log(u.id + " " + u.name + " owner")
                                                if(await new mesModel().Update_seen_user_receive(u.id,req.id_chat)){
                                                    const data_name_chat = await new mesModel().getChatName(u.id, req.id_chat)
                                                    console.log(data_name_chat)
                                                    var name = data_name_chat[0].chat_name
                                                        u.ws.send(JSON.stringify({
                                                            "id_chat" : req.id_chat,
                                                            "status" : 2000,
                                                            "name_chat" : name,
                                                            "message" : message,
                                                            "id_user_send" : req.id_user, 
                                                            "name_user_send" : user_send.name,
                                                            "from" : "their",
                                                            "id_isInchat" : req.id_chat,
                                                            "img" : user_send.img,
                                                            "mes_type" : 3
                                                        }))
                                                }else{
                                                    u.ws.send(JSON.stringify({
                                                        "status" : 2002
                                                    }))
                                                }
                                            }
                                           
                                        }else{
                                            console.log(u.id + " " + u.name + "not owner")
                                        }
                                    }
                                }
                            }
                        });
                    }catch(err){
                        console.log(err)
                    }
                break

                default:
                   
                    break;
            }
            
        });

        ws.on("close", (data)=>{ 
           console.log("user_out")
           for(var i = 0 ; i < user.length; i++){
               if(user[i].ws === ws){ 
                   user.splice(i, 1)
                   break
               }
           }
        })
    }

}

module.exports = chat_socket
