const loginModel = require("../models/loginModel")
const mesModel = require("../models/messageModel")

class mesController{

    async getAll(req, res){
        try{
            if(await new loginModel().check(req)){
                const data = await new mesModel().getAll(req.body.id)
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

    async getMesbyID(res, req){

    }

}

module.exports = mesController