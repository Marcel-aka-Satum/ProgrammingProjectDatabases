export class User {
    constructor() {
        this.isLogged = false;
        this.token = false;
        this.isAdmin = false;
        this.email = "";
        this.uid = -1;
        this.debug = false;
        this.username = "";
        if ((sessionStorage.getItem("token") !== null) && (sessionStorage.getItem("user") !== null)) {
            this.isLogged = true;
            this.token = sessionStorage.getItem("token")
            let userdata = JSON.parse(sessionStorage.getItem("user"))
            if(userdata["isAdmin"]){
                this.isAdmin = true
            }
            this.username = userdata["username"]
            this.email = userdata["email"]
            this.uid = userdata["uid"]
            console.log("constructor of User class called")
        }
    }

    getUsername(){
        return this.username
    }

    getIsLogged() {
        return this.isLogged
    }

    getIsAdmin() {
        return this.isAdmin
    }

    getToken() {
        return this.token
    }

    getEmail() {
        return this.email
    }

    getUid() {
        return this.uid
    }

    getDebug() {
        return this.debug
    }

    setDebug(debug) {

    }


    logout() {
        this.isLogged = false
        this.token = false
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        window.location.href = "/"
    }

    register(iL, t, iA, e, u){
        this.isLogged = iL
        this.token = t
        this.isAdmin = iA
        this.email = e
        this.username = u
    }

    login(uid,username, email, token, isAdmin){
        this.isLogged = true
        this.uid = uid
        this.username = username
        this.email = email
        this.token = token
        this.isAdmin = isAdmin
    }

    printUserInfo(){
        console.log("Printing user data")
        console.log("user:", this.username)
        console.log("email:", this.email)
        console.log("isLogged:", this.isLogged)
        console.log("isAdmin:", this.isAdmin)
        console.log("token:", this.token)
        console.log("uid:", this.uid)
        console.log("debug:", this.debug)
    }

    updateUserInfo(username, email, token, isAdmin, debug){
        this.username = username
        this.email = email
        this.token = token
        this.isAdmin = isAdmin
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("user",
            JSON.stringify({
                "username":username,
                "email":email,
                "isAdmin":isAdmin,
                "uid":this.uid,
                "debug":debug
            })
        )
    }

}