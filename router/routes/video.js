const express = require('express');
const Router = express.Router()

Router.use(express.static('videos'));

module.exports = Router
