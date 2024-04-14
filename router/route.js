const login = require("./routes/login")

function route(app){
    app.use("/fammes/api", login)
}

module.exports.Route = route