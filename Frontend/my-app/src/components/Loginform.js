import React, { useState, useContext} from "react";
import "../css/login_register_form.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import {userSession} from "../App"
import {SUCCESS, ERROR} from "./Helpers/custom_alert";

export default function Loginform() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");
    let usersession = useContext(userSession);

    const handleLogIn = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:4444/api/login',{
                Email:email,
                Password:password,
                headers: {
                    'Content-Type': 'application/json'
                  }
            }).then(response => {
                if(response.status === 200){
                    SUCCESS(response.data.message)
                    sessionStorage.setItem("token", response.data.token);
                    window.location.reload()
                } else{
                    console.log(response.data.message)
                    ERROR(response.data.message)
                }
            })
        } catch (err){
            console.log('response', err.response.data.error)
            ERROR(err.response.data.error)
        }
    }

    const handleLogOut = async (e) => {
        e.preventDefault();
        usersession.user.logout()
    }

    return (
        <div className="container">
            {(usersession.user.isLogged && usersession.user.token !== false) ?
            <div>
                <p>hi u are logged in as user </p>

                <p> if u want to log out press this button</p>
                <button type="submit" onClick={handleLogOut} className="btn btn-outline-secondary px-5 mb-5 w-100">Logout</button>
            </div>
            :
            (
                <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2 className="text-center text-dark mt-5">Login Form</h2>
                    <div className="card my-5">
                        <form className="card-body cardbody-color p-lg-5">
                            <div className="mb-3">
                                <input type="text" className="form-control" value={email} id="Username" aria-describedby="emailHelp"
                                       placeholder="User Name" onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" value={password} id="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="text-center">
                                <button type="submit" onClick={handleLogIn} className="btn btn-outline-secondary px-5 mb-5 w-100">Login</button>

                            </div>
                            <div id="emailHelp" className="form-text text-center mb-5 text-dark">Not
                                Registered? <a href="/register" className="text-dark fw-bold"> Create an
                                    Account</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )
            }
        </div>
    )
}