const express = require("express")
const {Route} = require("../router/route")
const app = express()
const http = require("http")
const server = http.createServer(app)
const port = 3000 | process.env.PORT

const websocket = require("ws")
const chat_socket = require("../chat/chat_socket")
const wss = new websocket.Server({server: server, path:'/fammes/api/sk'})

wss.on("connection", new chat_socket().connect)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Route(app)

server.listen(port , ()=>{
    console.log(`App running on port ${port}`);
})