const loginModel = require("../models/loginModel")
const user = require("../Entity/user")
const userModel = require("../models/userModels")
const {randomToken} = require("../tools/randomTool")

class loginController{

    async login(req, res){
        try{
            const data = await new loginModel().login(new user().setLoginInfo(req.body.email, req.body.pass))
            if(data){
                const userdata = await new userModel().getUsInfo(new user().setLoginInfo(req.body.email, req.body.pass))
                const token = await new loginModel().createToken(userdata[0].ID)
                res.json({"status" : 2000, "userdata" : userdata[0], "tokenizer" : token})
            }else{
                res.json({"status" : 2001})
            }
        }catch(error){
            console.log(error)
            res.json({"status" : 2002})
        }
        
    }

    async checklogin(req, res){
        try{
            if(await new loginModel().check(req)){
                res.json({"status" : 2000})
            }else{
                res.json({"status" : 2001})
            }
        }catch(err){
            res.json({"status" : 2002})
        }
    }

    logout(req, res){
        if(new loginModel().logout(req.session, req)){
            res.json({"status" : 2000})
        }else{
            res.json({"status" : 2002})
        }
    }
}

module.exports = loginController
