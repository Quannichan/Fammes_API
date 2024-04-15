const sqlTool = require("../tools/SqlTools")
const sqlModel = require("../tools/sqlModel")
// const sqlTypeIn = require("../tools/sqlTypeIn")

class loginModel{

    async login(userModel){
        var check = false
        try{
            var data = []
            data.push(new sqlModel("email", userModel.email , "equal", "and"))
            data.push(new sqlModel("pass", userModel.pass, "equal", "and"))
            const count = await new sqlTool().getCount("user", data, null, null, "ID")
            if(count === 1){
                check = true
            }
        }catch(error){
            console.log(error)
        }
        return check
    }

    check(data, req){
        var check = false
        if(data.user){
            if(data.user.data_session.userdata.ID === req.body.id){
                if(data.user.data_session.tok === req.body.token){
                    check = true
                }
            }
        }
        return check
    }

    logout(data, req){
        var check = false
        if(data.user){
            if(data.user.data_session.userdata.ID === req.body.id){
                if(data.user.data_session.tok === req.body.token){
                    req.session.destroy()
                    check = true
                }
            }
        }
        return check
    }
}

module.exports = loginModel