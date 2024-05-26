const sqlTool = require("../tools/SqlTools")
const { randomToken } = require("../tools/randomTool")
const sqlModel = require("../tools/sqlModel")
// const sqlTypeIn = require("../tools/sqlTypeIn")

class loginModel{

    async login(userModel){
        var check = false
        try{
            var data = []
            data.push(new sqlModel("email",  `'${userModel.email}'` , "equal", "and"))
            data.push(new sqlModel("pass", `'${userModel.pass}'`, "equal", "and"))
            const count = await new sqlTool().getCount("user", data, null, null, "ID")
            if(count === 1){
                check = true
            }
        }catch(error){
            console.log(error)
        }
        return check
    }

    async createToken(id_user){
        var tokenreturn = ""
        try{
            const token = randomToken()
            var table = "tokenizer"
            var col = [" id_user ", " token "]
            var data = [id_user, `'${token}'`]
            const result = await new sqlTool().insert(table, col, data)
            if(result === true){
                tokenreturn = token
            }
        }catch(err){
            console.log(err)
        }
        return tokenreturn
    }

    async check(req){
        var check = false
        var table = "tokenizer"
        var data = []
        data.push(new sqlModel("id_user", req.body.id, "equal" , "and"))
        data.push(new sqlModel("TOKEN", `'${req.body.token}'`, "equal" , "and"))
        const count = await new sqlTool().getCount(table, data, null, null, "ID")
        if(count > 0){
            check = true
        }
        return check
    }

    async check_GET(req){
        var check = false
        var table = "tokenizer"
        var data = []
        data.push(new sqlModel("id_user", `${req.query.id}`, "equal" , "and"))
        data.push(new sqlModel("TOKEN", `'${req.query.token}'`, "equal" , "and"))
        const count = await new sqlTool().getCount(table, data, null, null, "ID")
        if(count > 0){
            check = true
        }
        return check
    }

    async logout(req){
        var check = false
        var token = req.body.token
        var id = req.body.id
        try{
            var table = "tokenizer"
            var cond = []
            cond.push(new sqlModel("id_user", id, "equal" , "and"))
            cond.push(new sqlModel("TOKEN", `'${token}'`, "equal" , "and"))
            if(await new sqlTool().delete(table,cond,null, null) === true){
                check = true
            }
        }catch(error){
            console.log(error)
        }
        return check
    }
}

module.exports = loginModel
