import React from 'react'
import "../css/login_register_form.css"
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Registerform() {
    return (
        <div class="container">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center text-dark mt-5">Registration Form</h2>
                    <div class="card my-5">
                        <form class="card-body cardbody-color p-lg-5">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="Username" aria-describedby="emailHelp"
                                       placeholder="User Name"/>
                            </div>
                            <div class="mb-3">
                                <input type="email" class="form-control" id="email" aria-describedby="emailHelp"
                                       placeholder="Email"/>
                            </div>
                            <div class="mb-3">
                                <input type="password" class="form-control" id="password" placeholder="Password"/>
                            </div>
                            <div class="mb-3">
                                <input type="password" class="form-control" id="confirmPassword"
                                       placeholder="Confirm Password"/>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-outline-secondary px-5 mb-5 w-100">Register</button>
                            </div>
                            <div id="emailHelp" class="form-text text-center mb-5 text-dark">Already have an account? <a
                                href="/login" class="text-dark fw-bold">Log in</a></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
