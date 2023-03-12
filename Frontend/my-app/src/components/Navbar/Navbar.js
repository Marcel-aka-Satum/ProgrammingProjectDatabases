import React from "react";
import { Link, NavLink } from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'

const Navbar = () => {
  return (
    <nav class="navbar navbar-expand-md navbar-expand-lg">
      <div class="container-fluid">
        <div class="navbar-header">
            <Link class="navbar-brand" to="/">
            <span class="p-2"><img src={Logo} width="30" height="30" alt=""/></span>
            Newsagregator
            </Link>
      </div>
        <ul class="nav navbar-nav">
          <li>
            <NavLink to="/">Home</NavLink> 
          </li>
          <li>
            <NavLink to="/login">Login</NavLink> 
          </li>
          <li>
            <NavLink to="/artikels">Artikels</NavLink> 
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;