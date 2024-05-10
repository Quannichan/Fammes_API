const express = require('express');
const Router = express.Router()
const multer = require('multer');
const path = require('path');
const imgController = require('../../controller/imgController');
const loginModel = require("../../models/loginModel")
const imgModel = require("../../models/imgModel")

var now = Date.now()

function updateTime(){
    now = Date.now()
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        console.log(now)
        cb(null, now + "-" + file.fieldname + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

Router.use(express.static('images'));


Router.post("/UploadProfileImg", upload.single('image'), (async (req, res)=>{
    console.log(now)
    try{
        if(await new loginModel().check(req)){
            console.log(now)
            const result = await new imgModel().setImg(`${now}-${req.file.originalname}`, req.body.id)
            if(result){
                res.json({
                    "status" : 2000,
                    "imgURL" : `/fammes/api/images/${req.file.originalname}`
                })
            }else{
                res.json({
                    "status" : 2001,
                    "cause" : "cannotsetimg"
                })
            }
        }else{
            res.json({
                "status" : 2001,
                "cause" : "notlogin"
            })
        }
    }catch(err){
        res.json({"status" : 2002})
    }
    updateTime()
}))

Router.post("/setImgProfileDefault", new imgController().setAvaDefault)

module.exports = Router