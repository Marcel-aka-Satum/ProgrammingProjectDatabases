import {userSession} from "../../App";

export class User {
    constructor() {
        this.isLogged = false;
        this.token = false;
        this.isAdmin = false;
        this.email = "";
        this.uid = -1;
        this.debug = false;
        this.username = "";
        if ((localStorage.getItem("token") !== null) && (localStorage.getItem("user") !== null)) {
            this.isLogged = true;
            this.token = localStorage.getItem("token")
            let userdata = JSON.parse(localStorage.getItem("user"))
            if(userdata["isAdmin"]){
                this.isAdmin = true
            }
            this.username = userdata["username"]
            this.email = userdata["email"]
            this.uid = userdata["uid"]
            this.debug = userdata["debug"]
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
        console.log('return of debug:', this.debug)
        return this.debug
    }

    setDebug(debug) {
        this.debug = debug
    }


    logout() {
        this.isLogged = false
        this.token = false
        localStorage.removeItem("token")
        localStorage.removeItem("user")
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
        localStorage.setItem("token", token)
        localStorage.setItem("user",
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