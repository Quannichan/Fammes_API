const express = require("express")
const Router = express.Router()
const mesController = require("../../controller/mesController")

Router.get("/All", new mesController().getAll)

Router.get("/getMes", new mesController().getMesbyID)

module.exports = Router