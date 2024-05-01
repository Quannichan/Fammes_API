const imgModel = require("../models/imgModel");
const loginModel = require("../models/loginModel");



class imgController{

    async setAvaDefault(req, res){
        try{
            if(await new loginModel().check(req)){
                const result = await new imgModel().setDefaultImg(req.body.id)
                if(result){
                    res.json({
                        "status" : 2000,
                        "imgURL" : `fammes/api/images/defaultimg.jpg`
                    })
                }else{
                    res.json({
                        "status" : 2001,
                        "cause" : "cannotsetdefault"
                    })
                }
            }else{
                res.json({
                    "status" : 2001,
                    "cause" : "notlogin"
                })
            }
        }catch(err){
            res.json({"status" : 2002})
        }
    }

}

module.exports = imgController