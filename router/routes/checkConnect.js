const express = require("express")
const Router = express.Router()

Router.get("/check",(req, res)=>{
    res.json({
        "status" : 2000 
    })
})

module.exports = Router