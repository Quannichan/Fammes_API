const sql= require("../config/connectSql")
const sqlModels = require("../tools/sqlModel")

class SqlTools{
    async getCount(table, cond, matchInCond, cond_in, countCol){
        return new Promise((resolve, reject)=>{
            var query = `SELECT COUNT(${countCol}) as COUNT from fammes.${table} WHERE `
            query = query + this.buildCond(cond, cond_in, matchInCond)
            console.log(query)
            sql.query(query, (err,res)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(JSON.parse(JSON.stringify(res))[0].COUNT)
                }
            })
        })
    }

    async select(table,select_col, cond, matchInCond, cond_in, order){
        return new Promise((resolve, reject)=>{
            var selectCol_str = select_col.join(", ")
            var condStr = `SELECT ${selectCol_str} from fammes.${table} WHERE `
            condStr = condStr + this.buildCond(cond, cond_in ,matchInCond) + this.orderBy(order)
            console.log(condStr)
            sql.query(condStr, (err,res)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(JSON.parse(JSON.stringify(res)))
                }
            })
        })
    }

    async insert(table, col_insert, colVal){
        return new Promise((resolve, reject)=>{
            var query = ""
            if(col_insert){
                var colInsStr = col_insert.join(", ")
                query = `INSERT INTO ${table}(${colInsStr}) VALUES `
            }else{
                query = `INSERT INTO ${table} VALUES `
            }
            query = query + this.buildInsertValue(colVal)
            sql.query(query, (err)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(true)
                }
            })
        })
    }

    async delete(table, cond, next_cond, condIn){
        return new Promise((resolve, reject)=>{
            var delStr = `DELETE FROM ${table} `
            const buildCond = this.buildCond(cond, condIn, next_cond)
            if(buildCond.length > 0){
                delStr = delStr + " WHERE " + buildCond
            }
            sql.query(delStr, (err)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(true)
                }
            })
        })
       
    }   

    async update(table, update_val, cond,  next_cond, condIn){
        return new Promise((resolve, reject)=>{
            var updateStr = `UPDATE ${table} `
            updateStr = updateStr + " set " + this.buildUpdateValue(update_val)
            const buildCond = this.buildCond(cond, condIn, next_cond)
            
            if(buildCond.length > 0){
                updateStr = updateStr + " WHERE " + buildCond
            }
            console.log(updateStr)
            sql.query(updateStr, (err)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(true)
                }
            })
        })
    }

    async selectJoin(col_select, table ,table_join, where_cond, matchInCon, inCond){
        return new Promise((resolve, reject)=>{
            var condition_str = col_select.join(", ")
            var selectjoin = `SELECT ${condition_str} FROM ${table} `
            selectjoin = selectjoin + this.buildOnCondition(table_join)
            if(where_cond){
                selectjoin = selectjoin + " WHERE " + this.buildCond(where_cond, inCond, matchInCon)
            }
            sql.query(selectjoin, (err,res)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(JSON.parse(JSON.stringify(res)))
                }
            })
        })
    }


    buildOnCondition(table_join){
        var joinCon = []
        for(var tab of table_join){
           
            joinCon.push(` ${tab.join_type} ${tab.table} ON ${this.buildCond(tab.on_cond, null, null)}`)
        }
        return joinCon.join(", ")
    }

    buildUpdateValue(cond){
        var update = ""
        var updateArr = []
        for(var i = 0; i < cond.length; i++){
            updateArr.push(`${cond[i].col} = ${cond[i].value}`)
        }
        update = update + updateArr.join(", ")
        return update
    }

    buildInsertValue(col_value){
        var insert = ""
        if(col_value){
            var insertStr = col_value.join(", ")
            insert = insert + `(${insertStr})`
        }else{
            console.log("no insert value")
        }
        return insert
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
                            query = query + this.notequal(cond[i].col, cond[i].col_value,  cond[i].match, false)
    
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

                    query = query + ` ${condin[i].col} ${condin[i].intype} (${condin[i].dataIn.join(", ")} )`
                }else{
                    query = query + ` ${condin[i].col} ${condin[i].intype} (${condin[i].dataIn.join(", ")} )  ${condin[i].match}  `
                }
            }
        }
        
        return query
    }

    equal(cond, condVal, Cond_type, isEnd){
        var condition = ""
        if(isEnd){
            condition = condition +  `${cond} = ${condVal} `
        }else{
            if(Cond_type === "or"){
                condition = condition + `${cond} = ${condVal} OR `
            }else if(Cond_type === "and"){
                condition = condition +`${cond} = ${condVal} AND `
            }else if(Cond_type === "none"){
                condition = condition +`${cond} = ${condVal} `
            }
        }
        return condition
    }

    notequal(cond, condVal, Cond_type, isEnd){
        var condition = ""
        if(isEnd){
            condition = condition + `${cond} != ${condVal} `
        }else{
            if(Cond_type === "or"){
                condition = condition +`${cond} != ${condVal} OR `
            }else if(Cond_type === "and"){
                condition = condition +`${cond} != ${condVal} AND `
            }else if(Cond_type === "none"){
                condition = condition +`${cond} != ${condVal} `
            }
            
        }
        return condition
    }

    orderBy(order){
        var orderStr = ""
        if(order){
            orderStr = orderStr + "ORDER BY " + `${order.col} ${order.order_type}`
        }
        return orderStr
    }

}

    

module.exports = SqlTools