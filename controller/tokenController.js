const tokenModel = require("../models/tokenModel")

class tokenController{
    async delAllTok(req, res){
        try{
            if(await new tokenModel().deleteAllTok()){
                res.json({
                    "status" : 2000
                })
            }else{
                res.json({
                    "status" : 2001
                })
            }
        }catch(err){
            console.log(err)
            res.json({"status" : 2002})
        }
    }
}

module.exports = tokenController