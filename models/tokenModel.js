const SqlTools = require("../tools/SqlTools")

class tokenModel{
    async deleteAllTok(){
        var check = false
        try{
            var table = "tokenizer"
            const result = await new SqlTools().delete(table, null, null, null)
            if(result === true){
                check = true
            }
        }catch(err){
            console.log(err)
        }
        return check
    }
}

module.exports = tokenModel