import React, { useState } from "react";
import "../css/login_register_form.css"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Loginform() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = sessionStorage.getItem("token");
    const handleClick = () => {
        fetch('http://127.0.0.1:4444/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(resp =>{
            if(resp.status === 200) return resp.json();
            else alert("wrong credentials");
        })
        .then(data => {
            sessionStorage.setItem("token", data.token);
            console.log("this came from backend", data)
        })
        .catch(error =>{
            alert(error);
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
                                <input type="text" class="form-control" value={email} id="Username" aria-describedby="emailHelp"
                                       placeholder="User Name" onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div class="mb-3">
                                <input type="password" class="form-control" value={password} id="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div class="text-center">
                                <button type="submit" onClick={handleClick} class="btn btn-outline-secondary px-5 mb-5 w-100">Login button</button>
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
