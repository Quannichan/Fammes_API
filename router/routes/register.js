const express = require("express")
const Router = express.Router()

const registerController = require("../../controller/registerController")

Router.post("/register",  new registerController().register)

module.exports = Router