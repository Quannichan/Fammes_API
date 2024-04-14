const express = require("express")
const Router = express.Router()
const login = require("../../controller/loginController")

Router.post("/login", new login().login)

module.exports = Router