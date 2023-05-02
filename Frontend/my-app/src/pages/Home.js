import React, {useEffect, useState, useContext} from 'react'
import {SUCCESS, ERROR} from "../components/Helpers/custom_alert";
import {
    formatTitle,
    formatDate,
    formatSummary,
    handleClipboard,
    PrintNewspaper,
    handleHideArticle,
    shares,
    extractBaseUrl
} from "../components/Helpers/general";
import "./Home.css"
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Modal from 'react-bootstrap/Modal';
import {userSession} from '../App'


function ArticleCard({article, onFilterTextChange, logged, uid, favorites, setFavorites}) {
    const [show, setShow] = useState(false);
    const text = formatSummary(article.Summary);

    console.log(article.Image)
    const addFavorite = async (URL) => {
        try {
            const response = await axios.post('http://localhost:4444/api/addFavored', {
                UID: uid,
                article_url: URL,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.data.status === 200) {
                SUCCESS(response.data.message)
                console.log(response.data)
                setFavorites([...favorites, URL]) // Update the favorites state immediately
            } else {
                console.log(response.data.message)
                ERROR(response.data.message)
            }
        } catch (err) {
            console.log('response:', err)
            ERROR(err)
        }
    }

    const removeFavorite = async (URL) => {
        try {
            const response = await axios.post('http://localhost:4444/api/delete_favored', {
                UID: uid,
                article_url: URL,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.data.status === 200) {
                SUCCESS(response.data.message)
                console.log(response.data)
                setFavorites(favorites.filter(favorite => favorite !== URL)) // Update the favorites state immediately
            } else {
                ERROR(response.data.message)
            }
        } catch (err) {
            ERROR(err)
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [isLoading, setIsLoading] = useState(article.Image !== 'None');
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="article-card hide-btn-group">
            <div className='boxi'>
                <a href={article.URL} target="_blank" rel="noreferrer">
                    {article.Image ? (
                        <>
                            {isLoading && <div className="loading-animation"></div>}
                            <img
                                src={article.Image}
                                onError={(e) => e.target.style.display = 'none'}
                                alt=''
                                className="img-fluid rounded-top"
                                onLoad={handleImageLoad}
                            />
                        </>
                    ) : (
                        <div className="no-image"></div>
                    )}
                </a>
                <div className="bottom-0">
                    <button
                        className='background-newspaper text-decoration-none'
                        onClick={() => {
                            onFilterTextChange(PrintNewspaper({url: article.URL}))
                        }
                        }
                    >
                        <PrintNewspaper url={article.URL}/>
                    </button>
                </div>
            </div>
            <div className="article-card-body pe-3 ps-3">
                <a href={article.URL} target="_blank" rel="noreferrer">
                    <h3 className="card-title pt-2 pb-1">{formatTitle(article.Title)}</h3>
                </a>

                <div className="article-card-content"
                     dangerouslySetInnerHTML={{__html: text[0]}}/>

                <div className="article-card-footer pb-3 mt-3">

                    <div className="container mt-3">

                        <button className='btn btn-outline-primary me-2 ms-2 hide-btn' onClick={handleShow}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Share">
                            <i className="far fa-share-square"></i>
                        </button>
                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop={true}
                            keyboard={true}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Share this article!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{
                                margin: '20px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div className="card">
                                    <img
                                        src={article.Image}
                                        onError={(e) => e.target.style.display = 'none'}
                                        alt=''
                                        className="card-img-top"
                                        style={{display: article.Image ? 'block' : 'none'}}
                                    />
                                    <div className="card-body">
                                        <p>{<PrintNewspaper url={article.URL}/>}</p>
                                        <h5 className="card-title">{article.Title}</h5>
                                    </div>
                                </div>
                                <div className="mt-3">

                                    <div
                                        className="d-flex justify-content-between align-items-center bg-light p-3 rounded"
                                        style={{position: "relative"}}>
                                        <div className="me-auto" style={{paddingRight: "40px"}}>
                                            {article.URL}
                                        </div>
                                        <CopyToClipboard text={article.URL}>
                                            <button
                                                className="btn "
                                                style={{position: "absolute", right: "0"}}
                                                title="Copy link"
                                                onClick={handleClipboard}
                                            >
                                                <i className="far fa-clipboard" aria-hidden="true"></i>
                                            </button>
                                        </CopyToClipboard>
                                    </div>

                                    {shares(article)}

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className='btn btn-danger' onClick={handleClose}>
                                    Close
                                </button>
                            </Modal.Footer>
                        </Modal>

                        {(logged) ?
                            <>
                                <button
                                    className="btn btn-outline-warning me-2 hide-btn"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="I don't like this"
                                    onClick={handleHideArticle}
                                >
                                    <i className="far fa-thumbs-down"></i>
                                </button>

                                {favorites.includes(article.URL) ?
                                    <>
                                        <button
                                            className="btn btn-danger me-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Remove from favorites"
                                            onClick={
                                                () => removeFavorite(article.URL)
                                            }
                                        >
                                            <i className="fa fa-heart"></i>
                                        </button>

                                    </>
                                    :
                                    <>
                                        <button
                                            className="btn btn-outline-danger me-2"
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Add to favorites"
                                            onClick={
                                                () => addFavorite(article.URL)
                                            }
                                        >
                                            <i className="far fa-heart"></i>
                                        </button>
                                    </>
                                }
                            </>
                            : <></>
                        }


                        <span className="article-card-date float-end p-2 pb-4">
                        <i>{formatDate(article.Published)}</i>
                    </span>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

function GenreSection({articles, filterText, onFilterTextChange, logged, uid, favorites, setFavorites}) {

    function addDashes(str) {
        return str.replace(/\s+/g, '-');
    }
    const filteredArticles = articles[1].filter((article) => {
        console.log(article.Image)
        const title = article.Title.toLowerCase();
        const summary = article.Summary.toLowerCase();
        const url = extractBaseUrl(article.URL);
        const filter = filterText.toLowerCase();
        console.log(filter)
        return title.includes(filter) || summary.includes(filter) || url.includes(filter);
    });

    if (filteredArticles.length === 0) {
    return null;
    }


    return (
        <div className="genre-section">
            <h2>
                {articles[0]}{' '}
                <a href={`genre/${addDashes(articles[0])}`} rel='noreferrer'>
                    <button className="btn btn-outline-secondary">Show All</button>
                </a>
            </h2>
            <ul className="articles-row">
                {filteredArticles.slice(0, 3).map((article) => (
                    <li key={article.URL} className="p-3">
                        <ArticleCard article={article} onFilterTextChange={onFilterTextChange} logged={logged}
                                     uid={uid} favorites={favorites} setFavorites={setFavorites}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const Home = () => {
        const [articles, setArticles] = useState([])
        const [genres, setGenres] = useState(new Set())
        const [favorites, setFavorites] = useState([])

        const [filterText, setFilterText] = useState("");
        const [sortOption, setSortOption] = useState("Sort By");

        let usersession = useContext(userSession);

        useEffect(() => {
          const fetchArticles = async () => {
            const response = await axios.get('http://localhost:4444/api/articlesDict');
            console.log(response.data)
            setArticles(response.data);

          };

          fetchArticles();

        }, []);

        useEffect(() => {
            async function fetchFavorites() {
                const r_favorites = await fetch('http://localhost:4444/api/favorites')
                const data = await r_favorites.json();
                const data_user = data.favorites[usersession.user.uid]
                if (data_user) {
                    setFavorites(data_user)
                }
            }

            fetchFavorites();
        }, []);

        useEffect(() => {
            const fetchGenres = async () => {
                const response = await axios.get('http://localhost:4444/api/articles/genres');
                // const limitedArticles = response.data.slice(0, 500);
                setGenres(response.data);
            };
            fetchGenres();
        }, []);

        useEffect(() => {
            function compareDatesNewest(a, b) {
                return new Date(b.Published) - new Date(a.Published);
            }

            function compareDatesOldest(a, b) {
                return new Date(a.Published) - new Date(b.Published);
            }

            if (sortOption === "newest") {
                setArticles((prevArticles) => [...prevArticles].sort(compareDatesNewest));
            } else if (sortOption === "oldest") {
                setArticles((prevArticles) => [...prevArticles].sort(compareDatesOldest));
            }
        }, [sortOption]);

        const handleSortChange = (e) => {
            setSortOption(e.target.value);
        };

        const handleFilterTextChange = (newText) => {
            setFilterText(newText);
        };


        return (
            <div className="container-lg pt-5">
                <div className="form-group w-50 pb-3 d-flex justify-content-between">
                    <input
                        type="text"
                        className="form-control"
                        id="filter"
                        name="filter"
                        placeholder="Filter by title, summary or source"
                        value={filterText}
                        onChange={(e) => {
                            setFilterText(e.target.value);
                        }}
                    />
                    <button
                        type="button"
                        className={`btn w-auto ms-1 btn-outline-danger ${filterText === '' ? 'd-none' : ''}`}
                        onClick={() => setFilterText('')}
                    >
                        X
                    </button>
                    <div className="dropdown ps-2">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {sortOption ? sortOption : 'Sort By'}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li>
                                <button className="dropdown-item" type="button" value="newest"
                                        onClick={handleSortChange}>newest
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" type="button" value="oldest"
                                        onClick={handleSortChange}>oldest
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row">
                  {Object.keys(articles).map(key => (
                    <GenreSection key={key} articles={articles[key]} filterText={filterText}
                                  onFilterTextChange={handleFilterTextChange}
                                  logged={usersession.user.isLogged}
                                  uid={usersession.user.uid} favorites={favorites}
                                  setFavorites={setFavorites}
                    />
                  ))}
                </div>
            </div>

        );
    }
;

export default Home;

