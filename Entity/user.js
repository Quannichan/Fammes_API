class user{
    
    setUserInfo(Id, Name, Email, Pass, Img){
        this.id = Id
        this.name = Name
        this.email = Email
        this.img = Img
        this.pass = Pass
        return this
    }

    setLoginInfo(Email, Pass){
        this.email = Email
        this.pass = Pass 
        return this
    }

}
module.exports = user
