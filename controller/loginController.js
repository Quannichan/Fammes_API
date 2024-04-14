const loginModel = require("../models/loginModel")
const user = require("../Entity/user")

class loginController{

    async login(req, res){
        try{
            const data = await new loginModel().login(new user().setLoginInfo(req.body.email, req.body.pass))
            if(data){
                const userdata = 
                res.json({"status" : 2000})
            }else{
                res.json({"status" : 2001})
            }
        }catch(error){
            console.log(error)
            res.json({"status" : 2002})
        }
        
    }
}

module.exports = loginController
