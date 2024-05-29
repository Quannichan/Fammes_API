const SqlTools = require("../tools/SqlTools")
const sqlTypeUpdate = require("../tools/SqlTypeUpdate")
const sqlModel = require("../tools/sqlModel")
const fs = require("fs")
const base64 = require("base-64")
const {format} = require("date-fns")
const sqlTypeJoin = require("../tools/SqlTypeJoin")
const sqlTypeIn = require("../tools/sqlTypeIn")

class infoModel{
    async changeUN(id,email ,pass , usname){ 
        var check = false
        const data = []
        data.push(new sqlModel("ID", id, "equal", "and"))
        data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
        data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
        try{
            const count = await new SqlTools().getCount("user",data, null,null,"ID")
            if(count > 0){
                const update_acc = [new sqlTypeUpdate("name", `'${usname}'`)]
                const update_cond_acc = [new sqlModel("ID", id,"equal", "and")]
                await new SqlTools().update("user",update_acc,update_cond_acc, null, null)

                const select_cond = [new sqlModel("chat.chat_type", 1, "equal","and"), new sqlModel("userinchat.id_user_inchat", id, "equal", "and")]
                const on_join = [new sqlModel("userinchat.chat_id", "chat.chat_id","equal", "and")]
                const join = [new sqlTypeJoin("JOIN", "chat",on_join)]
                const col_sel = ["userinchat.chat_id"]
                const id_chat = await new SqlTools().selectJoin(col_sel,"userinchat",join,select_cond,null,null)

                const id_arr = []
                for( var idc of id_chat){
                    id_arr.push(idc.chat_id)
                }

                const update_chat_name = [new sqlTypeUpdate("chat_name", `'${usname}'`), new sqlTypeUpdate("name_user_last", `'${usname}'`)]
                const update_chat_cond = [new sqlModel("id_user_inchat",id, "notequal","and"), new sqlModel("id_user_last", id,"equal","and")]
                const update_chat_condIn = [new sqlTypeIn("chat_id",id_arr," IN ","and")]
                const res = await new SqlTools().update("userinchat",update_chat_name,update_chat_cond,"and",update_chat_condIn)

                if(res){
                    check = true
                }else{
                    check = false
                }
            }else{
                check = false
            }
        }catch(err){
            console.log(err)
            check = false
        }
        return check
    }

    async changePA(id, email,pass, newPass){
        var check = false
        const data = []
        data.push(new sqlModel("ID", id, "equal", "and"))
        data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
        data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
        try{
            const count = await new SqlTools().getCount("user",data, null,null,"ID")
            if(count > 0){
                const update = [new sqlTypeUpdate("pass", `'${newPass}'`)]
                const update_cond = [new sqlModel("ID", id, "equal", "and")]
                const res = await new SqlTools().update("user",update,update_cond, null, null)
                if(res){
                    check = true
                }else{
                    check = false
                }
            }else{
                check = false
            }
        }catch(err){
            console.log(err)
            check =  false
        }
        return check
    }

    async changeIMG(id, email,pass, def ,img){
        var check  = JSON.parse(JSON.stringify({
            "check" : false
        }))
            const data = []
            data.push(new sqlModel("ID", id, "equal", "and"))
            data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
            data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
            await new SqlTools().getCount("user",data, null,null,"ID")
            .then(async (count)=>{
                console.log(count)
                if(count > 0){
                    if(def === "true"){
                        console.log("continue")
                        const update = [new sqlTypeUpdate("img", `'fammes/api/images/defaultimg.jpg'`)]
                        const update_cond = [new sqlModel("ID", id,"equal", "and")]
                        await new SqlTools().update("user",update,update_cond, null, null)
    
                        const select_cond = [new sqlModel("chat.chat_type", 1, "equal","and"), new sqlModel("userinchat.id_user_inchat", id, "equal", "and")]
                        const on_join = [new sqlModel("userinchat.chat_id", "chat.chat_id","equal", "and")]
                        const join = [new sqlTypeJoin("JOIN", "chat",on_join)]
                        const col_sel = ["userinchat.chat_id"]
                        const id_chat = await new SqlTools().selectJoin(col_sel,"userinchat",join,select_cond,null,null)
    
                        const id_arr = []
                        for(var id_ of id_chat){
                            id_arr.push(id_.chat_id)
                        }
    
                        const update_chat_img = [new sqlTypeUpdate("chat_img", `'fammes/api/images/defaultimg.jpg'`)]
                        const update_chat_cond = [new sqlModel("id_user_inchat",id, "notequal","and")]
                        const update_chat_condIn = [new sqlTypeIn("chat_id",id_arr,"IN","and")]
                        const res = await new SqlTools().update("userinchat",update_chat_img,update_chat_cond,"and",update_chat_condIn)
                        if(res){
                            check  = JSON.parse(JSON.stringify({
                                "check" : true,
                                "img" : 'fammes/api/images/defaultimg.jpg'
                            }))
                        }else{
                            check  = JSON.parse(JSON.stringify({
                                "check" : false
                            }))
                        }
                    }else{
                        var name_now = Date.now()
                        const imageData = base64.decode(img)
                        const name_file = `images/${name_now}-image.jpg`
                        const wait = await this.writeFile(id,name_file,imageData)
                        if(wait){
                            check  = JSON.parse(JSON.stringify({
                                "check" : true,
                                "img" : `fammes/api/${name_file}`
                            }))
                        }else{
                            check  = JSON.parse(JSON.stringify({
                                "check" : false
                            }))
                        }
                    }
                }else{
                    check  = JSON.parse(JSON.stringify({
                        "check" : false
                    }))
                }
                console.log(check)
            })
            return check
        }

        async writeFile(id, name_file,imageData){
            return new Promise((resolve, reject)=>{
                fs.writeFile(name_file,imageData, "binary" , async (err)=>{
                    if(err){
                        reject(false)
                    }else{
                    const update = [new sqlTypeUpdate("img", `'fammes/api/${name_file}'`)]
                    const update_cond = [new sqlModel("ID", id,"equal", "and")]
                    await new SqlTools().update("user",update,update_cond, null, null)

                    const select_cond = [new sqlModel("chat.chat_type", 1, "equal","and"), new sqlModel("userinchat.id_user_inchat", id, "equal", "and")]
                    const on_join = [new sqlModel("userinchat.chat_id", "chat.chat_id","equal", "and")]
                    const join = [new sqlTypeJoin("JOIN", "chat",on_join)]
                    const col_sel = ["userinchat.chat_id"]
                    const id_chat = await new SqlTools().selectJoin(col_sel,"userinchat",join,select_cond,null,null)

                    var idchat = []
                    for(var idc of id_chat){
                        idchat.push(idc.chat_id)
                    }
                    console.log(idchat)
                    const update_chat_img = [new sqlTypeUpdate("chat_img",`'fammes/api/${name_file}'`)]
                    const update_chat_cond = [new sqlModel("id_user_inchat",id, "notequal","and")]
                    const update_chat_condIn = [new sqlTypeIn("chat_id",idchat,"IN","and")]
                    const res = await new SqlTools().update("userinchat",update_chat_img,update_chat_cond,"and",update_chat_condIn)
                    if(res){
                        resolve(true)
                    }else{
                        reject(false)
                    }
                }
                })
            })
        }
}

module.exports = infoModel