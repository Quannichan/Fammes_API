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

}

module.exports = registerModel