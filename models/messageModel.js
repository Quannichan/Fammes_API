const sqlTool = require("../tools/SqlTools")
const sqlModel = require("../tools/sqlModel")
const sqlTypeOrder = require("../tools/sqlTypeOrder")

class mesModel{

    async getAll(user_id){
        try{
            var cond = []
            cond.push(new sqlModel("id_user", user_id, "equal", "AND"))
            var slectCol = ["chat_id", "chat_img", "last_mes"]
            var orderBy = new sqlTypeOrder("lastest","DESC")
            const data = await new sqlTool().select("chat",slectCol, cond,null, null,orderBy)
            console.log(data)
            return data
        }catch(err){
            console.log(err)
        }
    }

    async getMesByID(user_id, mes_id){

    }

}

module.exports = mesModel
