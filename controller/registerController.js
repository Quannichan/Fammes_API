const user = require("../Entity/user")
const registerModel = require("../models/registerModel")
const userModel = require("../models/userModels")
const loginModel = require("../models/loginModel")


class registerController{

    async register(req, res){
        try{
            const check = await new registerModel().checkExist(new user().setUserInfo(null, req.body.name, req.body.email, req.body.pass, null))
            if(check){
                const canRegis = await new registerModel().register(new user().setUserInfo(null, req.body.name, req.body.email, req.body.pass, null))
                if(canRegis){
                    const userdata = await new userModel().getUsInfo(new user().setLoginInfo(req.body.email, req.body.pass))
                    const token = await new loginModel().createToken(userdata[0].ID)
                    res.json({"status" : 2000, "userdata" : userdata[0], "tokenizer" : token})
                }else{
                    res.json({
                        "status" : 2001,
                        "command" : "Cannotcreateaccount"
                    })
                }
            }else{
                res.json({
                    "status" : 2001,
                    "command" : "Userexist"
                })
            }
        }catch(error){
            res.json({"status" : 2002})
            console.log(error)
        }
    }

}

module.exports = registerController