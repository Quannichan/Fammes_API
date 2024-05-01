const SqlTools = require("../tools/SqlTools")
const sqlTypeUpdate = require("../tools/SqlTypeUpdate")
const sqlModel = require("../tools/sqlModel")

class imgModel{

    async setDefaultImg(us_id){
        var check = false
        try{
            var updateVal = []
            updateVal.push(new sqlTypeUpdate("img","fammes/api/images/defaultimg.jpg"))
            var cond = [new sqlModel("ID",us_id,"equal","AND")]
            const status = await new SqlTools().update("user",updateVal,cond,null,null)
            if(status){
                check = true
            }
        }catch(err){
            console.log(err)
        }
        return check
    }

    async setImg(img_name, us_id){
        var check = false
        try{
            var updateVal = []
            updateVal.push(new sqlTypeUpdate("img",`'fammes/api/images/${img_name}'`))
            var cond = [new sqlModel("ID",us_id,"equal","AND")]
            const status = await new SqlTools().update("user",updateVal,cond,null,null)
            if(status){
                check = true
            }
        }catch(err){
            console.log(err)
        }
        return check
    }

}

module.exports = imgModel