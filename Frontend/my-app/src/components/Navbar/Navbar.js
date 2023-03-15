import React from "react";
import {Link, NavLink} from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'
import { useState } from 'react';

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

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
                                <li><NavLink to="/articles">All</NavLink></li>
                                <li><NavLink to={`/articles?p=latest`}>Latest</NavLink></li>
                                <li><NavLink to={`/articles?p=economics`}>Economics</NavLink></li>
                                <li><NavLink to={`/articles?p=culture`}>Culture</NavLink></li>
                                <li><NavLink to={`/articles?p=sport`}>Sport</NavLink></li>
                                <li><NavLink to={`/articles?p=politics`}>Politics</NavLink></li>
                                <li><NavLink to={`/articles?p=inland`}>Inland</NavLink></li>
                                <li><NavLink to={`/articles?p=international`}>International</NavLink></li>
                                <li><NavLink to={`/articles?p=science`}>Science</NavLink></li>
                                <li><NavLink to="/articles"></NavLink></li>
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
