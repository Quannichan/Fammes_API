const infoModel = require("../models/infoModel")
const loginModel = require("../models/loginModel")

class infoController{
    async changeUN(req, res){
        try{
            if(await new loginModel().check(req)){
                if(await new infoModel().changeUN(req.body.id,req.body.email,req.body.pass ,req.body.usname)){
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
            
            if(await new infoModel().changePA(req.body.id,req.body.email,req.body.pass, req.body.newpass)){
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
            if(await new loginModel().check(req)){
                const wait = await new infoModel().changeIMG(req.body.id,req.body.email,req.body.pass, req.body.default ,req.body.newImg)
                    console.log("res: "+wait.img)
                    if(wait.check===true){
                        res.json({
                            "status" : 2000,
                            "newImg" : wait.img
                        })
                    }else{
                        res.json({
                            "status" : 2001,
                            "cause" : "wrongPass"
                        })
                    }
                
            }else{
                console.log("false 2")
                res.json({
                    "status" : 2001,
                    "cause" : "notlogin"
                })
            }

    }
}

module.exports = infoController