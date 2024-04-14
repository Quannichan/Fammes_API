const sqlTool = require("../tools/SqlTools")
const sqlModel = require("../tools/sqlModel")
const sqlTypeIn = require("../tools/sqlTypeIn")

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

    check(){
        console.log(userModel.email)
    }
}

module.exports = loginModel