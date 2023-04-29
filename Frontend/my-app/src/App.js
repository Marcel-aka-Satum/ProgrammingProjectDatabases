import Navbar from './components/Navbar/Navbar'
import Loginform from './components/Loginform';
import Registerform from './components/Registerform';
import Dashboard from "./components/Admin/Dashboard";
import Statistics from "./components/Admin/Statistics";
import Rss from "./components/Admin/Rss";
import Users from "./components/Admin/Users";
import Articles from "./components/Admin/Articles";
import Settings from "./components/Admin/Settings";
import Footer from './components/Footer/Footer'
import Home from './pages/Home';
import Genre from './pages/Genre';
import {Routes, Route} from 'react-router-dom'
import React, {useState, createContext, useEffect} from 'react'
import {User} from './components/User/User'
import Redirection from './components/redirect/Redirection';
import Account from './Profile/Account';
import ScrollToTop from "react-scroll-to-top";


/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
import {ToastContainer} from "react-toastify";
///////////////////

let userSession = createContext();

function App() {

    document.title = "PPDBT8"
    let [user, setUser] = useState(new User());

    //if user is not an admin he should not be able to see pages with admin perms
    if (!user.getIsAdmin()) {
        return (
            <userSession.Provider value={{user, setUser}}>
                <div id="main-container">
                    <Navbar/>
                    <Routes id="routes">
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/login" element={<Loginform/>}></Route>
                        <Route path="/admin" element={<Loginform/>}></Route>
                        {(user.getIsLogged()) ?
                            <Route path="/account" element={<Account/>}></Route>
                            : (
                                <Route path="/account" element={<Redirection/>}></Route>
                            )}
                        <Route path="/register" element={<Registerform/>}></Route>
                        <Route path="/admin/dashboard" element={<Redirection/>}/>
                        <Route path="/admin/articles" element={<Redirection/>}/>
                        <Route path="/admin/rss" element={<Redirection/>}/>
                        <Route path="/admin/users" element={<Redirection/>}/>
                        <Route path="/admin/settings" element={<Redirection/>}/>
                        <Route path="/admin/statistics" element={<Redirection/>}/>
                        <Route path="/genre/:genre" element={<Genre/>}></Route>
                    </Routes>
                    <ScrollToTop smooth/>
                </div>
                <ToastContainer limit={3}/>
            </userSession.Provider>
        )
    } else {
        return (
            <userSession.Provider value={{user, setUser}}>
                <div id="main-container">
                    <Navbar/>
                    <Routes id="routes">
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/login" element={<Loginform/>}></Route>
                        <Route path="/account" element={<Account/>}></Route>
                        <Route path="/admin" element={<Loginform/>}></Route>
                        <Route path="/register" element={<Registerform/>}></Route>
                        <Route path="/admin/dashboard" element={<Dashboard/>}/>
                        <Route path="/admin/articles" element={<Articles/>}/>
                        <Route path="/admin/rss" element={<Rss/>}/>
                        <Route path="/admin/users" element={<Users/>}/>
                        <Route path="/admin/settings" element={<Settings/>}/>
                        <Route path="/admin/statistics" element={<Statistics/>}/>
                        <Route path="genre/:genre" element={<Home/>}></Route>
                    </Routes>
                    <ScrollToTop smooth/>
                </div>
                <ToastContainer limit={3}/>
            </userSession.Provider>
        );
    }

}

export default App;
export {userSession};