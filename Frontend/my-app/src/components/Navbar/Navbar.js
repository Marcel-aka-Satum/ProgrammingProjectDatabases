import React, {useState, useContext, useEffect, useRef} from "react";
import {Link, NavLink} from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'
import {userSession} from '../../App'
import axios from 'axios'
import { Squash as Hamburger } from 'hamburger-react'


function GenreF({genre}) {

    const formattedGenre = genre.replace(/\s+/g, '-');

    return (
        <li><NavLink to={`genre/${formattedGenre}`} target='_blank'>{formattedGenre}</NavLink></li>
    );
}


const Navbar = () => {

    const [articles, setArticles] = useState([])
    const [genres, setGenres] = useState(new Set())

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await axios.get('http://localhost:4444/api/articles');
            // const limitedArticles = response.data.slice(0, 500);

            setArticles(response.data);
        };
        fetchArticles();
    }, []);

    let usersession = useContext(userSession);
    const handleLogOut = async (e) => {
        e.preventDefault();
        usersession.user.logout()
    }

    useEffect(() => {
        const fetchGenres = () => {
            const uniqueGenres = new Set();
            const grouped = {};

            for (const article of articles) {
                uniqueGenres.add(article.Topic);

                if (!grouped[article.Topic]) {
                    grouped[article.Topic] = [];
                }
                grouped[article.Topic].push(article);
            }

            setGenres(uniqueGenres);
        };

        if (articles.length > 0) {
            fetchGenres();
        }
    }, [articles]);

    
    const [Open, setOpen] = useState(false)
    const refIn = useRef(null)

function colConCollapse(){
    const colCon = document.querySelector(".container-fluid");
        setOpen(!Open)
        colCon.classList.toggle("collapse")
    }
    const handleClickOutside = (e) => {
        if(Open){
            if(!refIn.current.contains(e.target)){
            const colCon = document.querySelector(".container-fluid");
            colCon.classList.toggle("collapse")
            setOpen(!Open)
        }
        }
    }

    useEffect(()=>{
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    },[Open])

    return (
        <nav className="navbar navbar-expand-md navbar-expand-lg fixed-top">
            <div className="container-fluid m-2" ref={refIn}>
                <div className="navbar-header">
                    <NavLink className="navbar-brand" to="/">
                        <span className="p-2"><img src={Logo} width="30" height="30" alt=""/></span>
                        Newsaggregator
                    </NavLink>
                </div>
                <div className="toggle-collapse">
                    <div className="toggle-icon">
                        <span><Hamburger toggled={Open} onToggle={colConCollapse}/></span>
                    </div>
                </div>
                <ul className="nav navbar-nav allign-items-center mr-4">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link dropdown-toggle" to="#/" id="articlesDropdown" role="button"
                                 data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Articles</NavLink>

                        <div className="dropdown-menu m-0 fix-top"
                             aria-labelledby="articlesDropdown" >
                            <ul className="list-inline mx-4 p-0">
                            {Array.from(genres).map((genre) => (
                                <GenreF key={genre} genre={genre}/>
                            ))}
                            </ul>
                        </div>
                    </li>
                    {(usersession.user.isLogged && usersession.user.token !== false) ?
                        <li>
                        <NavLink to="/profile">Profile</NavLink>
                        </li>
                        : (<p></p>)
                    }
                    {(usersession.user.isLogged && usersession.user.token !== false && usersession.user.isAdmin) ?
                        <li>
                        <NavLink to="/admin/dashboard">Dashboard</NavLink>
                        </li>
                        : (<p></p>)
                    }

                    <li>
                        {(usersession.user.isLogged && usersession.user.token !== false) ? 
                            <NavLink to="/login" onClick={handleLogOut}>Logout</NavLink>
                        : (    
                            <NavLink to="/login">Login</NavLink>
                            )
                        }
                    </li>
                </ul>
                
            </div>
        </nav>
    );
};

export default Navbar;