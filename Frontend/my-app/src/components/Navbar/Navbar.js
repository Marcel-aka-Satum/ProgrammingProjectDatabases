import React from "react";
import { Link, NavLink } from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'
// import {Home} from './pages/Home'
// import {About} from './pages/About'
// import {Products} from './pages/Products'
// import {Blog} from './pages/Blog'


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <ul>
            <li>
              <Link to="/">
              <img src={Logo} width="30" height="30" alt="Sitelogo"/>
              </Link>
            </li>
        <li>
          <NavLink to="/">Newsagregator</NavLink> 
        </li>
          </ul>
      </div>
      <div className="nav-elements">
        <ul>
          <li>
            <NavLink to="/">Home</NavLink> 
          </li>
          <li>
            <NavLink to="/login">Login</NavLink> 
          </li>
          <li>
            <NavLink to="/artikels">artikels</NavLink> 
          </li>
        </ul>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;