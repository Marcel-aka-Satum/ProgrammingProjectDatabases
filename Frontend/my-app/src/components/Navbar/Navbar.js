// import { FaBars } from 'react-icons/fa'
// import styled from 'styled-components'
import { Link } from 'react-router-dom'

import React from 'react'

const Navbar = () =>{
  return (
    <>
    <nav className="nav">
      <a href="/" className="site-title">Site Name</a>
      <ul>
        <li>
        <a href='/login'>Login site</a>
        </li>
        <li>
        <a href='/about'>About</a>
        </li>
      </ul>
    </nav>
    </>
  )
};


export default Navbar;