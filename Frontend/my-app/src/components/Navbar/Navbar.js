import React, {useState, useContext, useEffect} from "react";
import {Link, NavLink} from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'
import {userSession} from '../../App'





const Navbar = () => {
    let usersession = useContext(userSession);
    const handleLogOut = async (e) => {
        e.preventDefault();
        usersession.user.logout()
    }

    return (
        <nav className="navbar navbar-expand-md navbar-expand-lg fixed-top">
            <div className="container-fluid m-2">
                <div className="navbar-header">
                    <Link className="navbar-brand" to="/">
                        <span className="p-2"><img src={Logo} width="30" height="30" alt=""/></span>
                        Newsagregator
                    </Link>
                </div>
                <ul className="nav navbar-nav allign-items-center mr-4">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link dropdown-toggle" to="#/" id="articlesDropdown" role="button"
                                 data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Articles</NavLink>

                        <div className="dropdown-menu dropdown-menu-left custom-bg m-0 fix-top"
                             aria-labelledby="articlesDropdown">
                            <ul className="list-inline mx-4 p-0">
                                <li><NavLink to={`genre/economics`} target='_blank'>Economics</NavLink></li>
                                <li><NavLink to={`genre/sport`} target='_blank'>Sport</NavLink></li>
                                <li><NavLink to={`genre/politics`}target='_blank'>Politics</NavLink></li>
                                <li><NavLink to={`genre/inland`} target='_blank'>Inland</NavLink></li>
                                <li><NavLink to={`genre/international`} target='_blank'>International</NavLink></li>
                                <li><NavLink to={`genre/science-and-technology`} target='_blank'>Science And Technology</NavLink></li>
                                <li><NavLink to={`genre/Lifestyle`} target='_blank'>LifeStyle</NavLink></li>
                                <li><NavLink to={`genre/health`} target='_blank'>Health</NavLink></li>
                                <li><NavLink to={`genre/entertainment`} target='_blank'>Entertainment</NavLink></li>
                            </ul>
                        </div>
                    </li>
                    {(usersession.user.isLogged && usersession.user.token !== false) ?
                        <li>
                        <NavLink to="/profile">Profile</NavLink>
                        </li>
                        : (<p></p>)
                    }
                    {(usersession.user.isLogged && usersession.user.token !== false && usersession.user.isAdmin) ?
                        <li>
                        <NavLink to="/admin/dashboard">Dashboard</NavLink>
                        </li>
                        : (<p></p>)
                    }

                    <li>
                        {(usersession.user.isLogged && usersession.user.token !== false) ? 
                            <NavLink to="/login" onClick={handleLogOut}>Logout</NavLink>
                        : (    
                            <NavLink to="/login">Login</NavLink>
                            )
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;