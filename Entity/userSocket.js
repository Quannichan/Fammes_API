class userSocket{
    constructor(ws, id,name ,img, id_chat){
        this.ws = ws
        this.id = id
        this.name = name
        this.img = img

        this.id_chat = id_chat
    }
}

module.exports = userSocket