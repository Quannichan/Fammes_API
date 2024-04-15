const express = require("express")
const Router = express.Router()
const login = require("../../controller/loginController")

Router.post("/login", new login().login)

Router.post("/islogin", new login().checklogin)

Router.post("/logout" , new login().logout)

module.exports = Router