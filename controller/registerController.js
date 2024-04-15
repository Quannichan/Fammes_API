const { json } = require("body-parser")
const user = require("../Entity/user")
const registerModel = require("../models/registerModel")

class registerController{

    async register(req, res){
        try{
            const canRegis = await new registerModel().register(new user().setUserInfo(null, req.body.name, req.body.email, req.body.pass, null))
            if(canRegis){
                res.json({"status" : 2000})
            }else{
                res.json({"status" : 2001})
            }
        }catch(error){
            res.json({"status" : 2002})
            console.log(error)
        }
    }

}

module.exports = registerController