import Navbar from './components/Navbar/Navbar'
import Loginform from './components/Loginform';
import Registerform from './components/Registerform';
import Dashboard from "./components/Admin/Dashboard";
import Rss from "./components/Admin/Rss";
import Users from "./components/Admin/Users";
import Articles from "./components/Admin/Articles";
import Settings from "./components/Admin/Settings";
import Footer from './components/Footer/Footer'
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom'
import React, {useState, useEffect} from 'react'

/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
import {ToastContainer} from "react-toastify";

///////////////////


function App() {

    //test if Backend works
    const [data, setData] = useState([{}])

    return (
        <div id="main-container">
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                {['/login', '/admin'].map(path => <Route path={path} element={<Loginform/>}/>)}
                <Route path="/register" element={<Registerform/>}></Route>

                <Route path="/admin/dashboard" element={<Dashboard/>}></Route>

                <Route path="/admin/articles" element={<Articles/>}></Route>
                <Route path="/admin/articles/view/:id" element={<Articles/>}></Route>

                <Route path="/admin/rss" element={<Rss/>}></Route>

                <Route path="/admin/users" element={<Users/>}></Route>

                <Route path="/admin/settings"
                       element={<Settings/>}></Route> {/* frequency of updates from news sources*/}

            </Routes>
            <Footer/>
            <ToastContainer limit={3}/>
        </div>
    );
}

export default App;