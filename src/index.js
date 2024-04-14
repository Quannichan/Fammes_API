const express = require("express")
const bodyParser = require("body-parser")
const {Route} = require("../router/route")
const app = express()
const http = require("http")
const server = http.createServer(app)
const port = 3000 | process.env.PORT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
Route(app)

server.listen(port , ()=>{
    console.log(`App running on port ${port}`);
})