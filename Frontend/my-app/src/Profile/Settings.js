import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom'
import './profileStyle.css'


export default function Settings() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12 pt-4">
                    <h1 className={'col-md-3'}>My Settings</h1>
                    <hr/>

                </div>
            </div>
        </div>
    );
}