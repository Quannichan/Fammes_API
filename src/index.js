const express = require("express")
const {Route} = require("../router/route")
const app = express()
const http = require("http")
const server = http.createServer(app)
const port = 3000 | process.env.PORT

const websocket = require("ws")
const chat_socket = require("../chat/chat_socket")
const wss = new websocket.Server({server: server, path:'/fammes/api/sk'})
const bodyParser = require('body-parser');


wss.on("connection", new chat_socket().connect)
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({limit: '300mb', extended: true }));

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

Route(app)

server.listen(port , ()=>{
    console.log(`App running on port ${port}`);
})