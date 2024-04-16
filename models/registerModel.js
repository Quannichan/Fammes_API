const sqlTool = require("../tools/SqlTools")
const sqlModel = require("../tools/sqlModel")

class registerModel{

    async register(user){
        try{
            var col_insert = ["name" , "email", "pass", "img"]
            var table = "user"
            var col_value = [`'${user.name}'`, `'${user.email}'`, `'${user.pass}'`, "''"]
            const canInsert = await new sqlTool().insert(table, col_insert, col_value)
            if(canInsert){
                return true
            }
        }catch(error){
            console.log(error)
        }
        
    }

    async checkExist(user){
        var check = false
        try{
            var table = "user"
            var countCol = "ID"
            var cond = []
            cond.push(new sqlModel("email", user.email, "equal", null))
            const count = new sqlTool().getCount(table, cond, null, null, countCol)
            if(count === 0){
                check = true
            }
        }catch(error){
            console.log(error)
        }
        return check
    }

}

module.exports = registerModel