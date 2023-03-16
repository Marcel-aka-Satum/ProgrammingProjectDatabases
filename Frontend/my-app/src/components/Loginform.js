import React from 'react'
import "../css/login_register_form.css"
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Loginform() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2 className="text-center text-dark mt-5">Login Form</h2>
                    <div className="card my-5">
                        <form className="card-body cardbody-color p-lg-5">
                            <div className="mb-3">
                                <input type="text" className="form-control" id="Username" aria-describedby="emailHelp"
                                       placeholder="User Name"/>
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" id="password" placeholder="password"/>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-outline-secondary px-5 mb-5 w-100">Login</button>
                            </div>
                            <div id="emailHelp" className="form-text text-center mb-5 text-dark">Not
                                Registered? <a href="/register" className="text-dark fw-bold"> Create an
                                    Account</a>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
