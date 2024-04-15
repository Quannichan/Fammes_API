const SqlTools = require("../tools/SqlTools")
const sqlModel = require("../tools/sqlModel")

class userModels{
    async getUsInfo(user, by){
        try{
            var data = []
            var selectCol = []
            
            selectCol.push("ID")
            selectCol.push("name")
            selectCol.push("email")
            selectCol.push("img")

            data.push(new sqlModel("email", user.email , "equal", "AND"))
            data.push(new sqlModel("pass", user.pass , "equal", "AND"))

            const user_data = await new SqlTools().select("user", selectCol, data, null, null)
            return user_data
        }catch(error){
            console.log(error)
        }
    }

}

module.exports = userModels