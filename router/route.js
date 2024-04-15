const login = require("./routes/login")
const register = require("./routes/register")

function route(app){
    app.use("/fammes/api/account", [login, register])
}

module.exports.Route = route