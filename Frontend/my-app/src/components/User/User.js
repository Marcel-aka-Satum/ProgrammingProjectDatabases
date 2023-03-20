
export class User{
    constructor(){
        this.isLogged = false;
        this.token = false;
        this.isAdmin = false;
        this.email = "";
        this.username = "";
        if(sessionStorage.getItem("token") !== null){
            this.isLogged = true;
            this.token = sessionStorage.getItem("token")
        }
    }

    getIsLogged(){
        return this.isLogged
    }

    getIsAdmin(){
        return this.isAdmin
    }

    getToken(){
        return this.token
    }

    logout(){
        this.isLogged = false
        this.token = false
        sessionStorage.removeItem("token")
        window.location.reload()
    }

}