const sql= require("../config/connectSql")
const sqlModels = require("../tools/sqlModel")

class SqlTools{
    async getCount(table, cond, matchInCond, cond_in,  countCol ){
        return new Promise((resolve, reject)=>{
            var query = `SELECT COUNT(${countCol}) as COUNT from fammes.${table} WHERE `
            query = query + this.buildCond(cond, cond_in, matchInCond)
            console.log(query)
            sql.query(query, (err,res)=>{
                if(err){
                    reject(err)
                }else{
                    console.log(JSON.parse(JSON.stringify(res))[0].COUNT)
                    resolve(JSON.parse(JSON.stringify(res))[0].COUNT)
                }
            })
        })
    }

    select(table,select_col, cond, matchInCond, cond_in){
        var selectCol_str = select_col.join(", ")
        var condStr = `SELECT ${selectCol_str} from fammes.${table} WHERE `
        condStr = condStr + this.buildCond(cond, cond_in ,matchInCond)

        sql.query(query, (err,res)=>{
            if(err){
                reject(err)
            }else{
                console.log(JSON.parse(JSON.stringify(res))[0])
                resolve(JSON.parse(JSON.stringify(res))[0])
            }
        })
    }

    buildCond(cond, condin , matchInCond){
        var query = ""
        if(cond){
            for(var i = 0; i < cond.length; i++){
                switch (cond[i].type) {
                    case "equal":
                        if(i === cond.length -1){
                            query = query + this.equal(cond[i].col, cond[i].col_value, cond[i].match, true)
                        }else{
                            query = query + this.equal(cond[i].col, cond[i].col_value, cond[i].match,false)
                        }
                        break;
    
                    case "notequal":
                        if(i === cond.length -1){
                            query = query + this.notequal(cond[i].col, cond[i].col_value,  cond[i].match, true)
                        }else{
                            query = query + this.notequal(cond[i].col, cond[i].col_value,  cond[i].match, true)
    
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        if(condin){
            query = query + matchInCond + " "
            for(var i = 0; i < condin.length; i++){
                if(i === condin.length -1){
                    query = query + ` ${condin[i].col} IN (${condin[i].dataIn.join(", ")} )`
                }else{
                    query = query + ` ${condin[i].col} IN (${condin[i].dataIn.join(", ")} )  ${condin[i].match}  `
                }
            }
        }
        
        return query
    }

    equal(cond, condVal, Cond_type, isEnd){
        var condition = ""
        if(isEnd){
            condition = condition +  `${cond} = '${condVal}' `
        }else{
            if(Cond_type === "or"){
                condition = condition + `${cond} = '${condVal}' OR `
            }else if(Cond_type === "and"){
                condition = condition +`${cond} = '${condVal}' AND `
            }else if(Cond_type === "none"){
                condition = condition +`${cond} = '${condVal}' `
            }
        }
        return condition
    }

    notequal(cond, condVal, Cond_type, isEnd){
        var condition = ""
        if(isEnd){
            condition = condition + `${cond} != '${condVal}' `
        }else{
            if(Cond_type === "or"){
                condition = condition +`${cond} != '${condVal}' OR `
            }else if(Cond_type === "and"){
                condition = condition +`${cond} != '${condVal}' AND `
            }else if(Cond_type === "none"){
                condition = condition +`${cond} != '${condVal}' `
            }
            
        }
        return condition
    }
}

module.exports = SqlTools