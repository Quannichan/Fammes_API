const SqlTools = require("../tools/SqlTools")
const sqlTool = require("../tools/SqlTools")
const sqlTypeJoin = require("../tools/SqlTypeJoin")
const sqlTypeUpdate = require("../tools/SqlTypeUpdate")
const sqlModel = require("../tools/sqlModel")
const sqlTypeOrder = require("../tools/sqlTypeOrder")

class mesModel{

    async getAll(user_id){
        try{
            var cond = []
            cond.push(new sqlModel("id_user_inchat", user_id, "equal", "AND"))
            var slectCol = ["chat_id", "chat_img", "chat_name", "id_user_last", "name_user_last", "last_mes","date_format(fammes.userinchat.lastest, '%H:%i:%S %d/%m/%y') as lastest", "last_mes_type", "seen_status"]
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
            var select_col = ["fammes.message.ID_mes","fammes.message.ID_chat", "fammes.message.message", "fammes.message.Time", "fammes.message.ID_user_send", "fammes.user.name", "fammes.user.img", "fammes.message.mess_type"]
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

    async UpdateChat_user_send(id_user,name_user,id_chat, message, mes_messageTable, time, mes_type, message_type){
        var check = false
        try{
            //add row to message table
            var table_mes = "message"
            var insert_col = ["ID_chat", "ID_user_send", "message", "Time","mess_type"]
            var insert_value = [id_chat, id_user, `'${mes_messageTable}'`, "str_to_date('"+time+"', '%H:%i:%S %d/%m/%y')",message_type]
            var res_message = await new SqlTools().insert(table_mes,insert_col, insert_value)
            if(res_message){
                var table = "userinchat"
                var update_val = [new sqlTypeUpdate("id_user_last",id_user),new sqlTypeUpdate("name_user_last", `'${name_user}'`),new sqlTypeUpdate("last_mes", `'${message}'` ),new sqlTypeUpdate("lastest", `str_to_date("${time}", "%H:%i:%S %d/%m/%y")`),new sqlTypeUpdate("last_mes_type", `'${mes_type}'`),new sqlTypeUpdate("seen_status", 0)]
                var cond = [new sqlModel("chat_id", id_chat,"equal", "and")]
                var res = await new SqlTools().update(table,update_val,cond,null,null)
                if(res){
                    var update_user_send = [new sqlTypeUpdate("seen_status",1)]
                    cond.push(new sqlModel("id_user_inchat", id_user,"equal","and"))
                    var res_user_send = await new SqlTools().update(table,update_user_send,cond,null,null)
                    if(res_user_send){
                        check = true
                    }
                }
            }
            //update to userinchat table
        }catch(err){
            console.log(err)
            check = false
        }
        return check
    }

    async Update_seen_user_receive(id_user, id_chat){
        var check = false
        try{
            var table = "userinchat"
            var update_user_send = [new sqlTypeUpdate("seen_status",1)]
            var cond = []
            cond.push(new sqlModel("chat_id", id_chat,"equal", "and"))
            cond.push(new sqlModel("id_user_inchat", id_user, "equal", "and"))
            var res_user_send = await new SqlTools().update(table,update_user_send,cond,null,null)
            if(res_user_send){
                check = true
            }
        }catch(err){
            console.log(err)
            check = false
        }
        return check
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

    async getChatName(id_user, id_chat){
        try{
            var table = "userinchat"
            var select_col = ["chat_name"]
            var cond = [new sqlModel("id_user_inchat",id_user,"equal","and"), new sqlModel("chat_id", id_chat, "equal", "and")]
            var data = await new SqlTools().select(table,select_col, cond,null,null,null)
            console.log(data)
            return data
        }catch(error){
            console.log(error)
        }
    }

}

module.exports = mesModel
