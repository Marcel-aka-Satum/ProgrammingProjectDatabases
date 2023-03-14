import React from "react";
import { Link, NavLink } from 'react-router-dom'
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
            <NavLink class="nav-link dropdown-toggle" to="#/" id="articlesDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Articles</NavLink>  
            
            <div class="dropdown-menu dropdown-menu-left" aria-labelledby="articlesDropdown">
              <ul class="list-inline mx-4">
              <li><NavLink to="/articles">All</NavLink></li>
              <li><NavLink to="/articles">Latest</NavLink></li>
              <li><NavLink to="/articles">Economics</NavLink></li>
              <li><NavLink to="/articles">Culture</NavLink></li>
              <li><NavLink to="/articles">Sport</NavLink></li>
              <li><NavLink to="/articles">Politics</NavLink></li>
              <li><NavLink to="/articles">Inland</NavLink></li>
              <li><NavLink to="/articles">International</NavLink></li>
              <li><NavLink to="/articles">Science</NavLink></li>
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
