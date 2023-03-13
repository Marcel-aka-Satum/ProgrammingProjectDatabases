import Navbar from './components/Navbar/Navbar'
import Loginform from './components/Loginform';
import Footer from './components/Footer/Footer'
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom'
import React, {useState, useEffect} from 'react'

/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
///////////////////


function App() {

  //test if Backend works
  const [data, setData] = useState([{}])
  useEffect(()=>{
    fetch("/members").then(
      res => res.json()
    ).then(
      data =>{
        setData(data)
        console.log(data)
      }
    )
  }, []);

  return (
    <div id="main-container">
      <Navbar/>
      <Routes>
        <Route path="" element={<Home/>}></Route>
        <Route path="login" element={<Loginform/>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;