import React, {useState, useContext, useEffect, useRef} from "react";
import {NavLink} from 'react-router-dom'
import Logo from './newspaper.png'
import './navbarStyle.css'
import {userSession} from '../../App'
import axios from 'axios'
import {Squash as Hamburger} from 'hamburger-react'


const Navbar = () => {
    const [genres, setGenres] = useState(new Set())

    useEffect(() => {
        const fetchGenres = async () => {
            const response = await axios.get('http://localhost:4444/api/articles/genres');
            // const limitedArticles = response.data.slice(0, 500);
            console.log(response.data)
            setGenres(response.data);
        };
        fetchGenres();
    }, []);

    function GenreF({genre}) {
        const formattedGenre = genre.replace(/\s+/g, '-');
        return (
            <li><NavLink to={`genre/${formattedGenre}`} onClick={colConCollapse}>{formattedGenre}</NavLink></li>
        );
    }

    let usersession = useContext(userSession);
    const handleLogOut = async (e) => {
        e.preventDefault();
        usersession.user.logout()
    }


    const [Open, setOpen] = useState(false)
    const refIn = useRef(null)


    function handleClick() {
      colConCollapse();
      handleLogOut();
    }
    function colConCollapse() {
        const colCon = document.querySelector(".container-fluid");
        setOpen(!Open)
        colCon.classList.toggle("collapse")
    }

    const handleClickOutside = (e) => {
        if (Open) {
            if (!refIn.current.contains(e.target)) {
                const colCon = document.querySelector(".container-fluid");
                colCon.classList.toggle("collapse")
                setOpen(!Open)
                console.log("out")
            }
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [Open])

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
                        <NavLink to="/" onClick={colConCollapse}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about-us" onClick={colConCollapse}>About Us</NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link dropdown-toggle" to="#/" id="articlesDropdown" role="button"
                                 data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Articles</NavLink>

                        <div className="dropdown-menu articledrop m-0 fix-top"
                             aria-labelledby="articlesDropdown">
                            <ul className="list-inline mx-4 p-0">
                                {Array.from(genres).map((genre) => (
                                    <GenreF key={genre} genre={genre}/>
                                ))}
                            </ul>
                        </div>
                    </li>
                    {(usersession.user.isLogged && usersession.user.token !== false && usersession.user.isAdmin) ?
                        <li>
                            <NavLink to="/admin/dashboard" onClick={colConCollapse}>Dashboard</NavLink>
                        </li>
                        : (<p></p>)
                    }
                    <li>
                        {(usersession.user.isLogged && usersession.user.token !== false) ?
                            <>
                                <NavLink className="nav-link dropdown-toggle" to="#/" id="profileDropdown" role="button"
                                         data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">My
                                    Profile</NavLink>

                                <div className="dropdown-menu dropprof dropdown-menu-end fix-top"
                                     aria-labelledby="profileDropdown">
                                    <ul className="list-unstyled p-2 px-3 py-2">
                                        <li>
                                            <NavLink to="/favorites"><i className="fas fa-heart me-2" onClick={colConCollapse}></i>Favorites</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings"><i className="fas fa-cog me-2" onClick={colConCollapse}></i>Settings</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/login" onClick={handleClick}><i
                                                className="fas fa-sign-out-alt me-2"></i>Logout</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </>
                            : (<NavLink to="/login" onClick={colConCollapse}><i
                                className="fas fa-sign-out-alt me-2"></i>Login</NavLink>)
                        }
                    </li>
                </ul>

            </div>
        </nav>
    );
};

export default React.memo(Navbar);
