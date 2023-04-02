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
import {Routes, Route} from 'react-router-dom'
import React, {useState, createContext, useEffect} from 'react'
import {User} from './components/User/User'
import axios from 'axios'

/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
import {ToastContainer} from "react-toastify";
///////////////////

let userSession = createContext();


function App() {
    document.title = "PPDBT8"
    let [user, setUser] = useState(new User());
    //test if Backend works

    return (
        <userSession.Provider value={{user, setUser}}>
            <div id="main-container">
                <Navbar/>
                <Routes id="routes">
                    <Route path="/" element={<Home/>}></Route>
                    {/*{['/login', '/admin'].map(path => <Route path={path} element={<Loginform/>}/>)}*/}
                    <Route path="/login" element={<Loginform/>}></Route>
                    <Route path="/admin" element={<Loginform/>}></Route>

                    <Route path="/register" element={<Registerform/>}></Route>

                    {/*{*/}
                    {/*    user.isLogged && user.isAdmin && user.token !== false ? (*/}
                    {/*            <>*/}
                    {/*                <Route path="/admin/dashboard" element={<Dashboard/>}*/}
                    {/*                       isLoggedIn={user.isLogged}/>*/}
                    {/*                <Route path="/admin/articles" element={<Articles/>} isLoggedIn={user.isLogged}/>*/}
                    {/*                <Route path="/admin/rss" element={<Rss/>} isLoggedIn={user.isLogged}/>*/}
                    {/*                <Route path="/admin/users" element={<Users/>} isLoggedIn={user.isLogged}/>*/}
                    {/*                <Route*/}
                    {/*                    path="/admin/settings"*/}
                    {/*                    element={<Settings/>}*/}
                    {/*                    isLoggedIn={user.isLogged}*/}
                    {/*                />*/}
                    {/*            </>*/}
                    {/*        ) :*/}
                    {/*        <Route path="*" element={<Loginform/>}> </Route>*/}
                    {/*}*/}

                    <Route path="/admin/dashboard" element={<Dashboard/>}/>
                    <Route path="/admin/articles" element={<Articles/>}/>
                    <Route path="/admin/rss" element={<Rss/>}/>
                    <Route path="/admin/users" element={<Users/>}/>
                    <Route path="/admin/settings" element={<Settings/>}/>
                    <Route path="/admin/statistics" element={<Statistics/>}/>

                    
                    <Route path="/:genre" element={<Home/>}></Route>
                </Routes>
                <Footer/>
            </div>
            <ToastContainer limit={3}/>
        </userSession.Provider>
    );
}

export default App;
export {userSession};