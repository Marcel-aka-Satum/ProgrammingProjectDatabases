import React, {useEffect, useState, useContext} from 'react'
import {SUCCESS, ERROR} from "../components/Helpers/custom_alert";
import {
    formatTitle,
    formatDate,
    getTimeAgo,
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
import {site_domain, request_headers} from "../globals";
import Cookies from 'js-cookie';

function ArticleCard({article, onFilterTextChange, logged, uid, favorites, setFavorites}) {
    const [show, setShow] = useState(false);
    const [showSimilarModal, setShowSimilarModal] = useState(false);
    const [isLoading, setIsLoading] = useState(article.Image !== 'None');
    const text = formatSummary(article.Summary);
    let usersession = useContext(userSession);

    const addFavorite = async (URL) => {
        console.log('ADD:', URL)
        try {
            const response = await axios.post(`${site_domain}/api/favorites`, {
                UID: uid,
                article_url: URL,
                headers: request_headers
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
        console.log('REMOVE:', URL);
        try {
            const response = await fetch(`${site_domain}/api/favorites`, {
                method: 'DELETE',
                headers: request_headers,
                body: JSON.stringify({
                    UID: uid,
                    article_url: URL
                })
            });
            const responseData = await response.json();
            if (response.ok) {
                SUCCESS(responseData.message);
                console.log(responseData);
                setFavorites(favorites.filter(favorite => favorite !== URL));
            } else {
                ERROR(responseData.message);
            }
        } catch (err) {
            ERROR(err);
        }
    };


    const handleClick = async (URL) => {
        console.log('URL clicked:', URL);
        try {
            await axios.post(`${site_domain}/api/clicked`, {
                URL: URL,
                Cookie: Cookies.get('user'),
            });
        } catch (err) {
            console.log('Error clicking:', err);
        }
    };


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseSimilarModal = () => setShowSimilarModal(false);
    const handleShowSimilarModal = () => setShowSimilarModal(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    function showImage() {
        if (article.Image.includes('logo')) {
            return (
                <img
                    src={article.Image}
                    onError={(e) => e.target.style.display = 'none'}
                    alt=''
                    className="rounded-top logo"
                    onLoad={handleImageLoad}
                />

            );
        } else {
            return (
                <img
                    src={article.Image}
                    onError={(e) => e.target.style.display = 'none'}
                    alt=''
                    className="img-fluid rounded-top"
                    onLoad={handleImageLoad}
                />
            );
        }
    }

    return (
        <div className="article-card hide-btn-group">
            <a
                href={article.URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleClick(article.URL)}
                onAuxClick={() => handleClick(article.URL)}
                onTouchEnd={() => handleClick(article.URL)}
            >
                <div className='boxi'>
                    {article.Image ? (
                        <>
                            {isLoading && <div className="loading-animation"></div>}
                            {showImage()}
                        </>
                    ) : (
                        <div className="no-image"></div>
                    )}
                </div>
            </a>

            <div className="bottom-0" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <button
                    className='background-newspaper text-decoration-none'
                    onClick={() => {
                        onFilterTextChange(PrintNewspaper({url: article.URL}));
                    }}
                >
                    <PrintNewspaper url={article.URL}/>
                </button>
            </div>

            <div className="article-card-body pe-3 ps-3">
                <a href={article.URL} target="_blank" rel="noreferrer"
                   onClick={() => handleClick(article.URL)}
                   onAuxClick={() => handleClick(article.URL)}
                   onTouchEnd={() => handleClick(article.URL)}>
                    <h3 className="card-title pt-2 pb-1">{formatTitle(article.Title)}</h3>
                </a>

                <div className="article-card-content" dangerouslySetInnerHTML={{__html: text[0]}}/>

                <div className="article-card-footer pb-3 mt-3">
                    <div className="container mt-3 btn-group">
                        <button className='btn btn-outline-primary' onClick={handleShow} data-toggle="tooltip"
                                data-placement="top"
                                title="Share">
                            <i className="far fa-share-square"></i>
                        </button>

                        {/*button that says 'Similar'*/}
                        <button className='btn btn-outline-primary' onClick={handleShowSimilarModal}
                                data-toggle="tooltip" data-placement="top" title="Similar">
                            <i className="fas fa-search"></i>
                            <span className="text-custom-dark">10</span>
                        </button>
                        <Modal show={showSimilarModal} onHide={handleCloseSimilarModal} backdrop={true} keyboard={true}>
                            <Modal.Header closeButton>
                                <Modal.Title>Similar Articles</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{
                                margin: '20px', padding: '20px', display: 'flex',
                                flexDirection: 'column', alignItems: 'center',
                            }}>
                                <div style={{height: '500px', overflowY: 'scroll'}}>

                                    {/*TODO: This should loop over the cluster, now only the clicked article is hardcoded*/}
                                    <div className="card" style={{marginBottom: '10px'}}>
                                        <img
                                            src={article.Image}
                                            onError={(e) => (e.target.style.display = 'none')}
                                            alt=''
                                            className="card-img-top"
                                            style={{display: article.Image ? 'block' : 'none'}}
                                        />
                                        <div className="card-body">
                                            <p>{<PrintNewspaper url={article.URL}/>}</p>
                                            <a
                                                href={article.URL}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() => handleClick(article.URL)}
                                                onAuxClick={() => handleClick(article.URL)}
                                                onTouchEnd={() => handleClick(article.URL)}
                                                className="text-decoration-none text-dark"
                                            >
                                                <h5 className="card-title">{formatTitle(article.Title)}</h5>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="card" style={{marginBottom: '10px'}}>
                                        <img
                                            src={article.Image}
                                            onError={(e) => (e.target.style.display = 'none')}
                                            alt=''
                                            className="card-img-top"
                                            style={{display: article.Image ? 'block' : 'none'}}
                                        />
                                        <div className="card-body">
                                            <p>{<PrintNewspaper url={article.URL}/>}</p>
                                            <a
                                                href={article.URL}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() => handleClick(article.URL)}
                                                onAuxClick={() => handleClick(article.URL)}
                                                onTouchEnd={() => handleClick(article.URL)}
                                                className="text-decoration-none text-dark"
                                            >
                                                <h5 className="card-title">{formatTitle(article.Title)}</h5>
                                            </a>
                                        </div>
                                    </div>

                                    {/*TODO: End of loop*/}
                                </div>
                            </Modal.Body>
                        </Modal>

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
                                                className="btn"
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

                                {favorites.includes(article.URL) ?
                                    <>
                                        <button
                                            className="btn btn-danger"
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


                    </div>
                    <span className="article-card-date float-end pb-2 pt-2">
                            <i>{formatDate(article.Published)}</i>
                        </span>
                </div>
            </div>
        </div>
    );
}

function GenreSection({
                          genre,
                          articles,
                          filterText,
                          onFilterTextChange,
                          logged,
                          uid,
                          favorites,
                          setFavorites,
                          usersession
                      }) {
    function addDashes(str) {
        return str.replace(/\s+/g, '-');
    }

    const filteredArticles = articles.filter((article) => {
        const title = article.Title.toLowerCase();
        const summary = article.Summary.toLowerCase();
        const url = extractBaseUrl(article.URL);
        const filter = filterText.toLowerCase();
        return title.includes(filter) || summary.includes(filter) || url.includes(filter);
    });

    if (filteredArticles.length === 0) {
        return null; // return null to skip rendering this component
    }

    return (
        <div className="genre-section">
            <h2>
                {genre} {logged && usersession.user.isAdmin && usersession.user.debug && (
                `(${filteredArticles.length})`
            )}


                <a href={`genre/${addDashes(genre)}`} rel='noreferrer'>
                    <button className="btn btn-outline-secondary ms-3">Show All</button>
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
        const [articlesGenre, setArticlesGenre] = useState([])
        const [favorites, setFavorites] = useState([])

        const [filterText, setFilterText] = useState("");
        const [sortOption, setSortOption] = useState("newest");

        let usersession = useContext(userSession);

        useEffect(() => {
            const fetchArticles = async () => {
                const response = await axios.get(`${site_domain}/api/articles`);
                // const limitedArticles = response.data.slice(0, 500);
                if (response.data !== "tuple index out of range") {
                    setArticles(response.data);
                }
            };
            fetchArticles();

        }, []);

        useEffect(() => {
            async function fetchFavorites() {
                const r_favorites = await fetch(`${site_domain}/api/favorites`)
                const data = await r_favorites.json();
                const data_user = data.favorites[usersession.user.uid]
                if (data_user) {
                    setFavorites(data_user)
                }
            }

            fetchFavorites();
        }, []);

        useEffect(() => {
            function compareDatesNewest(a, b) {
                return new Date(b.Published) - new Date(a.Published);
            }

            function compareDatesOldest(a, b) {
                return new Date(a.Published) - new Date(b.Published);
            }

            function sortArticlesByDate(articles, sortOption) {
                if (sortOption === "newest") {
                    return articles.sort(compareDatesNewest);
                } else if (sortOption === "oldest") {
                    return articles.sort(compareDatesOldest);
                } else {
                    return articles;
                }
            }

            function fetchGenres(sortedArticles) {
                const uniqueGenres = new Set();
                const grouped = {};

                for (const article of sortedArticles) {
                    uniqueGenres.add(article.Topic);

                    if (!grouped[article.Topic]) {
                        grouped[article.Topic] = [];
                    }
                    grouped[article.Topic].push(article);
                }

                // Sort each genre's articles by date
                for (const genre in grouped) {
                    grouped[genre] = sortArticlesByDate(grouped[genre], sortOption);
                }

                // Sort the genres by the date of the latest article in each genre
                const sortedGenres = Array.from(uniqueGenres).sort((a, b) => {
                    const latestA = grouped[a][0].Published;
                    const latestB = grouped[b][0].Published;
                    return new Date(latestB) - new Date(latestA);
                });

                // Reverse the order so that the genres with the latest articles are first
                if (sortOption === "oldest") {
                    sortedGenres.reverse();
                }
                setGenres(sortedGenres);

                setArticlesGenre(grouped);
            }

            if (articles.length > 0) {
                // Sort all articles by date before grouping them by genre
                const sortedArticles = sortArticlesByDate([...articles], sortOption);
                fetchGenres(sortedArticles);
            }
        }, [articles, sortOption]);


        const handleSortChange = (e) => {
            setSortOption(e.target.value);
        };

        const handleFilterTextChange = (newText) => {
            setFilterText(newText);
        };


        return (
            <div className="container-lg pt-5">
                <div className="form-group w-auto pb-3 d-flex justify-content-between">
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
                    <div className="filter-bar">


                        <div className="dropdown ps-2">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {sortOption ? sortOption : 'newest'}
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
                        <a href="/genre/recommended">
                            <button className="btn btn-outline-secondary d-inline-flex align-items-center">
                                <i className="fa fa-fire me-2" style={{color: "#c01c28"}}> </i> Recommended
                            </button>
                        </a>
                    </div>
                </div>
                <div className="row">
                    {Array.from(genres).map((genre) => (
                        <GenreSection key={genre} genre={genre} articles={articlesGenre[genre]} filterText={filterText}
                                      onFilterTextChange={handleFilterTextChange} logged={usersession.user.isLogged}
                                      uid={usersession.user.uid} favorites={favorites} setFavorites={setFavorites}
                                      usersession={usersession}
                        />
                    ))}
                </div>
            </div>

        );
    }
;

export default Home;
