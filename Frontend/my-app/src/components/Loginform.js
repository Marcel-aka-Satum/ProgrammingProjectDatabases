import React, {useState} from "react";
import "../css/login_register_form.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios";

export default function Loginform() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");
    const handleClick = () => {
        const url = 'http://127.0.0.1:4444/api/login';

        axios.post(url, {
            email: email,
            password: password
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                sessionStorage.setItem('token', response.data.token);
                console.log('this came from backend', response.data);
            })
            .catch(error => {
                if (error.response) {
                    // The server returned an error response
                    console.log("Has response, but error")
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    alert('Error: ' + error.response.data.message);
                } else if (error.request) {
                    console.log("No response from server")
                    // The request was made but no response was received
                    console.log(error.request);
                    alert('Error: No response from server');
                } else {
                    // Something else happened in setting up the request
                    console.log('Error', error.message);
                    alert('Error: ' + error.message);
                }
            });

    }

    return (
        <div class="container">
            {(token && token !== "" && token !== undefined) ? "You are logged in and your token is" + token :
                (
                    <div class="row">
                        <div class="col-md-6 offset-md-3">
                            <h2 class="text-center text-dark mt-5">Login Form</h2>
                            <div class="card my-5">
                                <form class="card-body cardbody-color p-lg-5">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" value={email} id="Username"
                                               aria-describedby="emailHelp"
                                               placeholder="User Name" onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                    <div class="mb-3">
                                        <input type="password" class="form-control" value={password} id="password"
                                               placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" onClick={handleClick}
                                                class="btn btn-outline-secondary px-5 mb-5 w-100">Login button
                                        </button>
                                    </div>
                                    <div id="emailHelp" class="form-text text-center mb-5 text-dark">Not
                                        Registered? <a href="/register" class="text-dark fw-bold"> Create an
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
