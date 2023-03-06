import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Loginform from './components/Loginform';
import Footer from './components/Footer/Footer'
import {Routes, Route} from 'react-router-dom'

/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
///////////////////

function App() {
  return (
    <div id="main-container">
      <Navbar/>
      <Routes>
        <Route path="login" element={<Loginform/>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;