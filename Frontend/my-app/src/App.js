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

///////////////////


function App() {

    //test if Backend works
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/members").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
        )
    }, []);

    return (
        <div id="main-container">
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                {['/login', '/admin'].map(path => <Route path={path} element={<Loginform/>} />)}
                <Route path="/register" element={<Registerform/>}></Route>

                <Route path="/admin/dashboard" element={<Dashboard/>}></Route>

                <Route path="/admin/articles" element={<Articles/>}></Route>
                <Route path="/admin/articles/:id" element={<Articles/>}></Route>

                <Route path="/admin/rss" element={<Rss/>}></Route>
                <Route path="/admin/rss/:id" element={<Rss/>}></Route>
                <Route path="/admin/rss/add" element={<Rss/>}></Route>
                <Route path="/admin/rss/edit/:id" element={<Rss/>}></Route>
                <Route path="/admin/rss/delete/:id" element={<Rss/>}></Route>

                <Route path="/admin/users" element={<Users/>}></Route>
                <Route path="/admin/users/:id" element={<Users/>}></Route>
                <Route path="/admin/users/add" element={<Users/>}></Route>
                <Route path="/admin/users/edit/:id" element={<Users/>}></Route>
                <Route path="/admin/users/delete/:id" element={<Users/>}></Route>

                <Route path="/admin/settings" element={<Settings/>}></Route> {/* frequency of updates from news sources*/}

            </Routes>
            <Footer/>
        </div>
    );
}

export default App;