import React from "react";
import {Link, NavLink} from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'

const Navbar = () => {
    return (
        <nav class="navbar navbar-expand-md navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <Link class="navbar-brand" to="/">
                        <span class="p-2"><img src={Logo} width="30" height="30" alt=""/></span>
                        Newsagregator
                    </Link>
                </div>
                <ul class="nav navbar-nav allign-items-center mr-4">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink class="nav-link dropdown-toggle" to="#/" id="articlesDropdown" role="button"
                                 data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Articles</NavLink>

                        <div class="dropdown-menu btn-outline-secondary dropdown-menu-left"
                             aria-labelledby="articlesDropdown">
                            <ul class="list-inline mx-4">
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
