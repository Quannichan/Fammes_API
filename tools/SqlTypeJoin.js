class sqlTypeJoin{
    constructor(join_type, table, on_cond) {
        this.join_type = join_type
        this.table = table
        this.on_cond = on_cond
    }
}
module.exports = sqlTypeJoin