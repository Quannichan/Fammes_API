class sqlModel{
    constructor(col, col_value, type, match) {
        this.col = col
        this.col_value = col_value
        this.type = type
        this.match = match
    }
}
module.exports = sqlModel