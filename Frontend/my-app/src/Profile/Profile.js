import React, {useState, useContext, useEffect} from "react";
import {userSession} from "../App"


export default function Profile() {
    let usersession = useContext(userSession);

    function showFavorite(){
        
    }

    function showProfile(){

    }

  return (
    <div>
        <h1>Profile</h1>
        <p>Welcome to ur profile {usersession.user.username} </p>
        <p>Here u can see your profile details and also ur favorite articles!</p>


                               
        <button type="submit" onClick={showFavorite}
                className="btn btn-outline-secondary px-5 mb-5 w-25 btn-animation">Show favorites
        </button>
        <br></br>
        <button type="submit" onClick={showProfile}
                className="btn btn-outline-secondary px-5 mb-5 w-25 btn-animation">Show profile details
        </button>
    </div>
  )
}
