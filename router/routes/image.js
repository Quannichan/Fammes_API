const express = require('express');
const Router = express.Router()
const multer = require('multer');
const path = require('path');
const imgController = require('../../controller/imgController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

Router.use(express.static('images'));

Router.post("/UploadProfileImg", upload.single('image'), new imgController().UploadAvaProfile)

Router.post("/setImgProfileDefault", new imgController().setAvaDefault)

module.exports = Router