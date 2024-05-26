const express = require("express")
const infoController = require("../../controller/infoController")
const Router = express.Router()

Router.post("/changeUN", new infoController().changeUN)

Router.post("/changePA", new infoController().changePA)

Router.post("/changeIMG", new infoController().changeImg)

module.exports = Router