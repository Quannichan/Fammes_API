const infoModel = require("../models/infoModel")
const loginModel = require("../models/loginModel")

class infoController{
    async changeUN(req, res){
        try{
            if(await new loginModel().check(req)){
                if(await new infoModel().changeUN(req.id,req.email,req.pass ,req.usname)){
                    res.json({
                        "status" : 2000
                    })
                }else{
                    res.json({
                        "status" : 2001,
                        "cause" : "wrongPass"
                    })
                }
            }else{
                res.json({
                    "status" : 2001,
                    "cause" : "notlogin"
                })
            }
        }catch(err){
            console.log(err)
            res.json({
                "status" : 2002,
            })
        }
        
    }

    async changePA(req, res){
        if(new loginModel().check(req)){
            if(await new infoModel().changePA(req.id,req.email,req.pass, req.newpass)){
                res.json({
                    "status" : 2000
                })
            }else{
                res.json({
                    "status" : 2001,
                    "cause" : "wrongPass"
                })
            }
        }else{
            res.json({
                "status" : 2001,
                "cause" : "notlogin"
            })
        }
    }

    async changeImg(req, res){
        if(new loginModel().check(req)){
            if(await new infoModel().changeIMG(req.id,req.email,req.pass, req.default ,req.newImg)){
                res.json({
                    "status" : 2000
                })
            }else{
                res.json({
                    "status" : 2001,
                    "cause" : "wrongPass"
                })
            }
        }else{
            res.json({
                "status" : 2001,
                "cause" : "notlogin"
            })
        }
    }
}

module.exports = infoController