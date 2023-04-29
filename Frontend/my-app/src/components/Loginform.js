import React, {useState, useContext, useEffect} from "react";
import "../css/login_register_form.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import {userSession} from "../App"
import {SUCCESS, ERROR} from "./Helpers/custom_alert";


export default function Loginform() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let usersession = useContext(userSession);

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4444/api/login', {
                Email: email,
                Password: password,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    SUCCESS(response.data.message)
                    console.log(response.data)
                    sessionStorage.setItem("token", response.data.token);
                    usersession.user.login(response.data.Username, response.data.Email, response.data.token, response.data.isAdmin)
                    sessionStorage.setItem("user", JSON.stringify(usersession.user))
                    window.location.reload()
                } else {
                    console.log(response.data.message)
                    ERROR(response.data.message)
                }
            })
        } catch (err) {
            console.log('response', err.response.data.message)
            ERROR(err.response.data.message)
        }
    }

    function redirectToAccount(){
        window.location.href = "/account"
    }
    
    return (
        <div className="container">
            {(usersession.user.isLogged && usersession.user.token !== false) ?
                <div>
                    {redirectToAccount()}
                </div>
                :
                (
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <h2 className="text-center text-dark mt-5">Login Form</h2>
                            <div className="card my-5">
                                <form className="card-body cardbody-color p-lg-5">

                                    <div className="input-group mb-3">
                                        <div className="input-group-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-envelope-at-fill"
                                                 viewBox="0 0 16 16">
                                                <path
                                                    d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/>
                                                <path
                                                    d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/>
                                            </svg>
                                        </div>
                                        <div className="form-floating">
                                            <input type="email" className="form-control" value={email}
                                                   id="floatingInput" placeholder="Email"
                                                   onChange={(e) => setEmail(e.target.value)}/>
                                            <label htmlFor="floatingInput">Email</label>
                                        </div>

                                    </div>

                                    <div className="input-group mb-3">
                                        <div className="input-group-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                            </svg>
                                        </div>

                                        <div className="form-floating">
                                            <input type="Password" className="form-control" value={password}
                                                   id="floatingPassword"
                                                   placeholder="password"
                                                   onChange={(e) => setPassword(e.target.value)}/>
                                            <label htmlFor="floatingPassword">Password</label>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" onClick={handleLogIn}
                                                className="btn btn-outline-secondary px-5 mb-5 w-100 btn-animation">Login
                                        </button>

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