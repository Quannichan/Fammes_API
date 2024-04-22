const login = require("./routes/login")
const register = require("./routes/register")
const message = require("./routes/messages")
const checConnect = require("./routes/checkConnect")
const token = require("./routes/token")
const image = require("./routes/image")
const ROOT_URL = "/fammes/api"

function route(app){
    app.use(ROOT_URL + "/account", [login, register])

    app.use(ROOT_URL + "/messages", message)

    app.use(ROOT_URL + "/private", token)

    app.use(ROOT_URL + "/images", image)

    app.use(ROOT_URL + "/" , checConnect)
    
    
}

module.exports.Route = route