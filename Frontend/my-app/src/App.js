import React from 'react'
import Navbar from './components/Navbar/Navbar'
import "./css/navbarStyle.css"
import Loginform from './components/Loginform';
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div id="main-container">
      <Navbar/>
      <Routes>
        <Route path="login" element={<Loginform/>}></Route>
      </Routes>

    </div>
  );
}

export default App;