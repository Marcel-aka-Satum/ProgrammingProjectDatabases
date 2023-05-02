import Navbar from './components/Navbar/Navbar'
import Loginform from './components/Loginform';
import Registerform from './components/Registerform';
import Dashboard from "./components/Admin/Dashboard";
import Statistics from "./components/Admin/Statistics";
import Rss from "./components/Admin/Rss";
import Users from "./components/Admin/Users";
import Articles from "./components/Admin/Articles";
import AdminSettings from "./components/Admin/Settings";
import Home from './pages/Home';
import Genre from './pages/Genre';
import {Routes, Route} from 'react-router-dom'
import React, {useState, createContext, useEffect} from 'react'
import {User} from './components/User/User'
import Redirection from './components/redirect/Redirection';
import Favorites from './Profile/Favorites';
import About_us from './pages/About-us';
import UserSettings from './Profile/Settings';
import ScrollToTop from "react-scroll-to-top";
import { v4 as uuid } from 'uuid';
import Cookies from 'js-cookie';

/////////////////// import css
import "./components/Navbar/navbarStyle.css"
import "./components/Footer/footerStyle.css"
import {ToastContainer} from "react-toastify";
///////////////////

let userSession = createContext();


function App() {
    const [cookies, setCookies] = useState([]);
    useEffect(() => {
        // Set cookie expiration date to one week from now
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        const unique_id = uuid();
        const ifCookie = Cookies.get('user')
        
        async function fetchCookie() {
            try {
                const response = await fetch('http://127.0.0.1:4444/api/add_Visitor');
                const data = await response.json();
                setCookies(data)
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
        if(ifCookie === undefined){
            fetchCookie();
            // Set the cookie with a value and expiration time
            Cookies.set('user', unique_id, { expires: 60000 });
        }
        
        
    }, []);

    document.title = "PPDBT8"
    let [user, setUser] = useState(new User());
    console.log(user.getIsAdmin())
    //if user is not an admin he should not be able to see pages with admin perms
    if (!user.getIsAdmin()) {
        return (
            <userSession.Provider value={{user, setUser}}>
                <div id="main-container">
                    <Navbar/>
                    <Routes id="routes">
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/about-us" element={<About_us/>}></Route>
                        <Route path="/login" element={<Loginform/>}></Route>
                        <Route path="/admin" element={<Loginform/>}></Route>
                        {(user.getIsLogged()) ?
                            <>
                                <Route path="/favorites" element={<Favorites/>}></Route>
                                <Route path="/settings" element={<UserSettings/>}></Route>
                            </>
                            : (
                                <>
                                    <Route path="/favorites" element={<Redirection/>}></Route>
                                    <Route path="/settings" element={<Redirection/>}></Route>
                                </>
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
                        <Route path="/about-us" element={<About_us/>}></Route>
                        <Route path="/login" element={<Loginform/>}></Route>
                        <Route path="/favorites" element={<Favorites/>}></Route>
                        <Route path="/settings" element={<UserSettings/>}></Route>
                        <Route path="/admin" element={<Loginform/>}></Route>
                        <Route path="/register" element={<Registerform/>}></Route>
                        <Route path="/admin/dashboard" element={<Dashboard/>}/>
                        <Route path="/admin/articles" element={<Articles/>}/>
                        <Route path="/admin/rss" element={<Rss/>}/>
                        <Route path="/admin/users" element={<Users/>}/>
                        <Route path="/admin/settings" element={<AdminSettings/>}/>
                        <Route path="/admin/statistics" element={<Statistics/>}/>
                        <Route path="genre/:genre" element={<Genre/>}></Route>
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