import React, {useContext} from 'react';
import {userSession} from '../App';
import {NavLink} from 'react-router-dom'
import './profileStyle.css'

// import printUserInfo from '../components/User/User';

export default function Account() {
    let usersession = useContext(userSession);

    const handleLogOut = async (e) => {
        e.preventDefault();
        usersession.user.logout()
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12 pt-4">
                    <h1 className={'col-md-3'}>My Account</h1>
                    <p>Welcome to your profile「{usersession.user.username}」</p>
                    <hr/>
                    <div className="d-grid col-md-4">
                        <NavLink to="/favorites" className={'btn btn-outline-secondary mb-3 w-100'}>
                            <i className="fas fa-heart me-2"></i>My Favorites</NavLink>

                        <NavLink to="/settings" className={'btn btn-outline-secondary mb-3 w-100'}>
                            <i className="fas fa-cog me-2"></i>Settings</NavLink>

                        <NavLink to="/login" className={'btn btn-outline-secondary mb-3 w-100'} onClick={handleLogOut}>
                            <i className="fas fa-sign-out-alt me-2"></i>Logout</NavLink>

                    </div>
                </div>
            </div>
        </div>
    );
}
