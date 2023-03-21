import React, {useState, useContext} from "react";
import "../css/login_register_form.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import {userSession} from '../App'
import {SUCCESS, ERROR, UNKNOWN_ERROR} from "./Helpers/custom_alert"
import axios from 'axios'


export default function Registerform() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    let usersession = useContext(userSession);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4444/api/register', {
                Email: email,
                Password: password,
                Username: username,
                Is_Admin: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    sessionStorage.setItem("token", response.data.token);
                    usersession.user.username = username
                    usersession.user.email = email
                    window.location.reload()
                } else {
                    alert("wrong credentials")
                }
            })
        } catch (err) {
            ERROR(err.message)
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
                                    <div class="mb-3">
                                        <input type="text" value={username}
                                               onChange={(e) => setUsername(e.target.value)} class="form-control"
                                               id="Username" aria-describedby="emailHelp"
                                               placeholder="User Name"/>
                                    </div>
                                    <div class="mb-3">
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                               class="form-control" id="email" aria-describedby="emailHelp"
                                               placeholder="Email"/>
                                    </div>
                                    <div class="mb-3">
                                        <input type="password" value={password}
                                               onChange={(e) => setPassword(e.target.value)} class="form-control"
                                               id="password" placeholder="Password"/>
                                    </div>
                                    <div className="mb-3">
                                        <input type="password" className="form-control" id="confirmPassword"
                                               placeholder="Confirm Password"/>
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