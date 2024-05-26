const SqlTools = require("../tools/SqlTools")
const sqlTypeUpdate = require("../tools/SqlTypeUpdate")
const sqlModel = require("../tools/sqlModel")
const fs = require("fs")
const base64 = require("base-64")
const {format} = require("date-fns")

class infoModel{
    async changeUN(id,email ,pass , usname){ 
        var check = false
        const data = []
        data.push(new sqlModel("ID", id, "equal", "and"))
        data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
        data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
        try{
            const count = await new SqlTools().getCount("user",data, null,null,"ID")
            data = null
            if(count > 0){
                const update = [new sqlTypeUpdate("name", usname)]
                const update_cond = [new sqlModel("ID", id,"equal", "and")]
                const res = new SqlTools().update("user",update,update_cond, null, null)
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

    async changePA(id, email,pass, newPass){
        var check = false
        const data = []
        data.push(new sqlModel("ID", id, "equal", "and"))
        data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
        data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
        try{
            const count = await new SqlTools().getCount("user",data, null,null,"ID")
            data = null
            if(count > 0){
                const update = [new sqlTypeUpdate("pass", newPass)]
                const update_cond = [new sqlModel("ID", id,"equal", "and")]
                const res = new SqlTools().update("user",update,update_cond, null, null)
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
        var check = false
        
        try{
            if(def){
                const data = []
                data.push(new sqlModel("ID", id, "equal", "and"))
                data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
                data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
                const count = await new SqlTools().getCount("user",data, null,null,"ID")
                data = null
                if(count > 0){
                    const update = [new sqlTypeUpdate("img", `'fammes/api/images/defaultimg.jpg'`)]
                    const update_cond = [new sqlModel("ID", id,"equal", "and")]
                    const res = new SqlTools().update("user",update,update_cond, null, null)
                    if(res){
                        check = true
                    }else{
                        check = false
                    }
                }else{
                    check = false
                }
            }else{
            const imageData = base64.decode(img);
            const name_file = `images/${name_now}-image.jpg`
            fs.writeFile(name_file,imageData, "binary",async (err) => {
                if (err) {
                    console.error('Error saving image:', err);
                } else {
                    const data = []
                    data.push(new sqlModel("ID", id, "equal", "and"))
                    data.push(new sqlModel("email", `'${email}'`, "equal", "and"))
                    data.push(new sqlModel("pass", `'${pass}'`, "equal", "and"))
                    const count = await new SqlTools().getCount("user",data, null,null,"ID")
                    data = null
                    if(count > 0){
                        const update = [new sqlTypeUpdate("img", `'fammes/api/${name_file}'`)]
                        const update_cond = [new sqlModel("ID", id,"equal", "and")]
                        const res = new SqlTools().update("user",update,update_cond, null, null)
                        if(res){
                            check = true
                        }else{
                            check = false
                        }
                    }else{
                        check = false
                    }
                }
            })
        }
        }catch(err){
            console.log(err)
            check =  false
        }
        return check
    }
}

module.exports = infoModel