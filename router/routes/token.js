const express = require("express")
const tokenController = require("../../controller/tokenController")
const Router = express.Router()

Router.get("/delAllTok", new tokenController().delAllTok)
module.exports = Router