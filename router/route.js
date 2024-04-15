const login = require("./routes/login")

function route(app){
    app.use("/fammes/api/account", login)
}

module.exports.Route = route