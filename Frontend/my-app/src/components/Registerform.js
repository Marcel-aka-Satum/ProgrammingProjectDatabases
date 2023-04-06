import React, {useState, useContext} from "react";
import "../css/login_register_form.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import {userSession} from '../App'
import {SUCCESS, ERROR} from "./Helpers/custom_alert"
import axios from 'axios'


export default function Registerform() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    let usersession = useContext(userSession);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4444/api/register', {
                Email: email,
                Password: password,
                ConfirmPassword: confirmPassword,
                Username: username,
                Is_Admin: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    SUCCESS(response.data.message)
                    sessionStorage.setItem("token", response.data.token);
                    usersession.user.register(true, response.data.token, false, email, username)
                    sessionStorage.setItem("user", JSON.stringify(usersession.user))
                    window.location.reload()
                } else {
                    ERROR(response.data.message)
                }
            })
        } catch (err) {
            ERROR(err.response.data.message)
        }
    }

    return (
        <div class="container">
            {(usersession.user.isLogged && usersession.user.token !== false) ?
                <div>
                    <p>hi u are already logged in u can't create account! </p>
                </div>
                : (
                    <div class="row">
                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center text-dark mt-5">Registration Form</h2>
                            <div class="card my-5">
                                <form class="card-body cardbody-color p-lg-5">

                                    <div class="input-group mb-3">
                                        <div className="input-group-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                            </svg>
                                        </div>
                                        <div className="form-floating">
                                            <input type="text" value={username}
                                                   onChange={(e) => setUsername(e.target.value)} class="form-control"
                                                   id="floatingInput"
                                                   placeholder="Username"/>
                                            <label htmlFor="floatingInput">Username</label>
                                        </div>
                                    </div>

                                    <div class="input-group mb-3">
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
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                   class="form-control" id="floatingInput"
                                                   placeholder="Email"/>
                                            <label htmlFor="floatingInput">Email</label>
                                        </div>
                                    </div>

                                    <div class="input-group mb-3">
                                        <div className="input-group-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                                                <path
                                                    d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                            </svg>
                                        </div>

                                        <div className="form-floating">
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                                   class="form-control" id="floatingPassword"
                                                   placeholder="Password"/>
                                        <label htmlFor="floatingPassword">Password</label>
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
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                               className="form-control" id="confirmPassword"
                                               placeholder="Confirm Password"/>
                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                        </div>
                                    </div>

                                    <div class="text-center">
                                        <button type="submit" onClick={handleRegister}
                                                class="btn btn-outline-secondary px-5 mb-5 w-100">Register
                                        </button>
                                    </div>
                                    <div id="emailHelp" className="form-text text-center mb-5 text-dark">Already have an
                                        account? <a
                                            href="/login" className="text-dark fw-bold">Log in</a></div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}