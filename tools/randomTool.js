function randomToken(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&_:,.<>?[]{}+=-*/';
    var i = 0
    var randomToken = ""
    while(i < 100){
        var random = Math.floor(Math.random() * characters.length)
        randomToken = randomToken + characters[random]
        i++
    }

    return "FAMMES"+randomToken
}

module.exports.randomToken = randomToken
