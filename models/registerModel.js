const sqlTool = require("../tools/SqlTools")
const sqlModel = require("../tools/sqlModel")

class registerModel{

    async register(user){
        try{
            var col_insert = ["name" , "email", "pass", "img"]
            var table = "user"
            var col_value = [`'${user.name}'`, `'${user.email}'`, `'${user.pass}'`, "'fammes/api/images/defaultimg.jpg'"]
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
            cond.push(new sqlModel("email", `'${user.email}'`, "equal", null))
            const status = await new sqlTool().getCount(table, cond, null, null, countCol)
            if(status === 0){
                console.log("not exist")
                check = true
            }else{
                console.log("exist")
            }
        }catch(error){
            console.log(error)
        }
        return check
    }

}

module.exports = registerModel