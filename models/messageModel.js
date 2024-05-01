const SqlTools = require("../tools/SqlTools")
const sqlTool = require("../tools/SqlTools")
const sqlTypeJoin = require("../tools/SqlTypeJoin")
const sqlModel = require("../tools/sqlModel")
const sqlTypeOrder = require("../tools/sqlTypeOrder")

class mesModel{

    async getAll(user_id){
        try{
            var cond = []
            cond.push(new sqlModel("id_user_inchat", user_id, "equal", "AND"))
            var slectCol = ["chat_id", "chat_img", "chat_name", "id_user_last", "name_user_last", "last_mes","date_format(fammes.userinchat.lastest, '%H:%i %d/%m/%y') as lastest", "last_mes_type", "seen_status"]
            var orderBy = new sqlTypeOrder("lastest","DESC")
            const data = await new sqlTool().select("userinchat",slectCol, cond,null, null,orderBy)
            return data
        }catch(err){
            console.log(err)
        }
    }

    async getMesByID(mes_id){
        try{
            var table = "fammes.message"
            var select_col = ["fammes.message.ID_mes","fammes.message.ID_chat", "fammes.message.message", "fammes.message.Time", "fammes.message.ID_user_send", "fammes.user.name", "fammes.user.img"]
            var JoinTable = []
            var On1 = []
            On1.push(new sqlModel("fammes.message.ID_user_send" , "fammes.user.ID" ,"equal", "AND"))
            JoinTable.push(new sqlTypeJoin("left join", "fammes.user", On1))
            var WhereCond = []
            WhereCond.push(new sqlModel("ID_chat", mes_id , "equal" , "AND"))

            const data = await new sqlTool().selectJoin(select_col, table, JoinTable, WhereCond, null, null)

            return data
        }catch(err){
            console.log(err)
        }
    }

    async getChatID(id_user){
        try{
            var table = "userinchat"
            var select_col = ["chat_id"]
            var cond = [new sqlModel("id_user_inchat",id_user,"equal","AND")]
            var data = await new SqlTools().select(table,select_col, cond,null,null,null)
            return data
        }catch(error){
            console.log(error)
        }
    }

    async checkChatIsOwner(id_user, id_chat){
        var check = false
        try{
            var table = "userInChat"
            var cond = []
            cond.push(new sqlModel("id_user_inchat", id_user,"equal","and"))
            cond.push(new sqlModel("chat_id", id_chat, "equal", "and"))
            var data = await new SqlTools().getCount(table,cond,null,null,"id_user_inchat")
            if(data > 0){
                check = true
            }
        }catch(err){
            console.log
        }
        return check
       
    }

}

module.exports = mesModel
