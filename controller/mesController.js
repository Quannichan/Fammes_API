var loginModel = require("../models/loginModel")
var mesModel = require("../models/messageModel")

class mesController{

    async getAll(req, res){
        try{
            if(await new loginModel().check_GET(req)){
                const data = await new mesModel().getAll(req.query.id)
                res.json({
                    "status" : 2000,
                    "chat" : data
                })
            }else{
                res.json({
                    "status" : 2001,
                    "cause"  : "notlogin"
                })
            }
        }catch(err){
            console.log(err)
            res.json({"status" : 2002})
        }
    }

    async getMesbyID(req, res){
        try{
            if(await new loginModel().check_GET(req)){
                const data = await new mesModel().getMesByID(req.query.iMess)
                res.json({
                    "status" : 2000,
                    "messages" : data
                })
            }else{
                res.json({
                    "status" : 2001,
                    "cause"  : "notlogin"
                })
            }
        }catch(err){
            console.log(err)
            res.json({"status" : 2002})
        }
    }

}

module.exports = mesController