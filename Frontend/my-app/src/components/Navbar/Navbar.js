import React from "react";
import {Link, NavLink} from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Navbar = () => {
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

                        <div className="dropdown-menu dropdown-menu-left custom-bg"
                             aria-labelledby="articlesDropdown">
                            <ul className="list-inline mx-4">
                                <li><NavLink to={`/economics`}>Economics</NavLink></li>
                                <li><NavLink to={`/sport`}>Sport</NavLink></li>
                                <li><NavLink to={`/politics`}>Politics</NavLink></li>
                                <li><NavLink to={`/inland`}>Inland</NavLink></li>
                                <li><NavLink to={`/international`}>International</NavLink></li>
                                <li><NavLink to={`/science-and-technology`}>Science And Technology</NavLink></li>
                                <li><NavLink to={`/Lifestyle`}>LifeStyle</NavLink></li>
                                <li><NavLink to={`/health`}>Health</NavLink></li>
                                <li><NavLink to={`/entertainment`}>Entertainment</NavLink></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;