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
import React, {useState, createContext} from 'react'
import {User} from './components/User/User'

/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
import {ToastContainer} from "react-toastify";
///////////////////


let userSession = createContext();

function App() {
    document.title = "PPDBT8"
    let [user, setUser] = useState(new User());
    return (
        <userSession.Provider value={{user, setUser}}>
            <div id="main-container">
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    {/* {['/login', '/admin'].map(path => <Route path={path} element={<Loginform/>} />)} */}
                    <Route path="/login" element={<Loginform/>}></Route>
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
            </div>
            <ToastContainer limit={3}/>

        </userSession.Provider>
    );
}

export default App;
export {userSession};